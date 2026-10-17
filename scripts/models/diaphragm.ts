import { createHash } from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { Document, NodeIO } from "@gltf-transform/core"
import { MeshoptSimplifier } from "meshoptimizer"

// Builds apps/web/public/models/diaphragm.glb from BodyParts3D 3.0 binary
// STLs (Kevin-Mattheus-Moerman/BodyParts3D mirror, pinned commit). Every input
// is checked against its SHA-256. The diaphragm is one source mesh; it is cut
// at the midline into the right and left hemidiaphragms. Dense meshes are
// simplified with meshoptimizer to keep the download small; no geometry is
// moved or reshaped beyond that.
//
// Run from the repository root: bun scripts/models/diaphragm.ts
// Needs @gltf-transform/core@4.5.0 and meshoptimizer@0.22.0 (not workspace
// dependencies: install them in a scratch directory and set NODE_PATH).
const commit = "f0eeb6e843380cfe6b83797cf8c3e1af74de5e61"
const base = `https://raw.githubusercontent.com/Kevin-Mattheus-Moerman/BodyParts3D/${commit}/assets/BodyParts3D_data/stl/`
const sources = {
  FMA13295: [
    "diaphragm",
    "c795e5300bf93f81805de8e2788449d9230da2c1bc93a005bb995c691b3fae84",
  ],
  FMA7131: [
    "esophagus",
    "7783e109c2f4c81936632e1662686c9081460f4be2b5f1f51f8ebd439d0e464f",
  ],
  FMA10951: [
    "inferior vena cava",
    "627622da12b0716e3b564c2f4812c6a5b0fbec0d49e0cbdc018c70247b66b609",
  ],
  FMA3784: [
    "descending aorta",
    "b6bf061b1b50163b91ac0b11c3fb8dd0b5a28a18a3ee4d95d395a622448e4c16",
  ],
  FMA7274: [
    "wall of heart",
    "ed570773264c7abf73db5f5da20e5e4f69943315e8c5995da850a2821988b0a2",
  ],
  FMA7337: [
    "lower lobe of right lung",
    "cfb1641ad8443abd6da3919d3f7565f7d119dc740b7cf91d51d17ae9f2f67eda",
  ],
  FMA7371: [
    "lower lobe of left lung",
    "17419dd2f9d837e162286b8545308893a9377e1f410c6e3c6385b45f1a6e90a3",
  ],
  FMA7197: [
    "liver",
    "cbd634ccfbb532b33c01b6a1361dd706e95955de67aa729169d7d68752b6a98d",
  ],
  FMA7148: [
    "stomach",
    "a6764d20879cf7ba1acd8284c1b0255b20111d8bd3b92838cf97600e6f3d9065",
  ],
  FMA7196: [
    "spleen",
    "72c0248b1e35490c66a0d0bde0ecdde6a362f3940a5bb6d3e770718ff5eeb94a",
  ],
  FMA22342: [
    "right psoas major",
    "a41bd94eaafc31f127dddc9a8542a7933abb048a386d292c80c05ac463d2955d",
  ],
  FMA22343: [
    "left psoas major",
    "df2024fdff4cd7cb971bd7cb6c8eb98b707ab2e482b782f7cd7fc7ed0d165597",
  ],
} as const
type Source = keyof typeof sources

const structures: {
  id: string
  source: Source
  color: string
  triangles: number
  side?: "right" | "left"
  /** Source z range (mm) to keep, for long structures that run far past the diaphragm. */
  clip?: [number, number]
}[] = [
  {
    id: "right-hemidiaphragm",
    source: "FMA13295",
    color: "#c97f6d",
    triangles: 25000,
    side: "right",
  },
  {
    id: "left-hemidiaphragm",
    source: "FMA13295",
    color: "#d6937e",
    triangles: 25000,
    side: "left",
  },
  {
    id: "esophagus",
    source: "FMA7131",
    color: "#d9a88f",
    triangles: 6000,
    clip: [0, 1250],
  },
  {
    id: "inferior-vena-cava",
    source: "FMA10951",
    color: "#5f7fae",
    triangles: 8000,
  },
  {
    id: "descending-aorta",
    source: "FMA3784",
    color: "#c0564b",
    triangles: 12000,
    clip: [0, 1250],
  },
  { id: "heart", source: "FMA7274", color: "#b98a80", triangles: 15000 },
  {
    id: "right-lung-lower-lobe",
    source: "FMA7337",
    color: "#b9c3cf",
    triangles: 10000,
  },
  {
    id: "left-lung-lower-lobe",
    source: "FMA7371",
    color: "#c4ccd6",
    triangles: 10000,
  },
  { id: "liver", source: "FMA7197", color: "#9c5a4c", triangles: 15000 },
  { id: "stomach", source: "FMA7148", color: "#d4a3a0", triangles: 9000 },
  { id: "spleen", source: "FMA7196", color: "#8f5a6e", triangles: 9000 },
  {
    id: "right-psoas-major",
    source: "FMA22342",
    color: "#b46b5e",
    triangles: 6000,
    clip: [980, 2000],
  },
  {
    id: "left-psoas-major",
    source: "FMA22343",
    color: "#bf7769",
    triangles: 6000,
    clip: [980, 2000],
  },
]

const cache = process.env.STL_CACHE ?? ".asset-cache/diaphragm"
await mkdir(cache, { recursive: true })
const sha = (bytes: Uint8Array) =>
  createHash("sha256").update(bytes).digest("hex")

async function stl(id: Source) {
  const file = `${cache}/${id}.stl`
  let bytes: Uint8Array
  try {
    bytes = new Uint8Array(await readFile(file))
  } catch {
    const response = await fetch(`${base}${id}.stl`)
    if (!response.ok) throw new Error(`${id}: HTTP ${response.status}`)
    bytes = new Uint8Array(await response.arrayBuffer())
    await writeFile(file, bytes)
  }
  if (sha(bytes) !== sources[id][1]) throw new Error(`${id}: checksum changed`)
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const count = view.getUint32(80, true)
  if (bytes.length !== 84 + count * 50)
    throw new Error(`${id}: invalid binary STL`)
  // Weld on exact position so the simplifier and normals see a connected surface.
  const positions: number[] = []
  const indices: number[] = []
  const weld = new Map<string, number>()
  for (let t = 0; t < count; t++)
    for (let k = 0; k < 3; k++) {
      const o = 84 + t * 50 + 12 + k * 12
      const v = [0, 1, 2].map((i) => view.getFloat32(o + i * 4, true))
      const key = v.join(",")
      let index = weld.get(key)
      if (index === undefined) {
        index = weld.size
        weld.set(key, index)
        positions.push(...v)
      }
      indices.push(index)
    }
  return {
    positions: new Float32Array(positions),
    indices: new Uint32Array(indices),
    count,
  }
}

const meshes = new Map<Source, Awaited<ReturnType<typeof stl>>>()
for (const id of new Set(structures.map(({ source }) => source)))
  meshes.set(id, await stl(id))

const min = [Infinity, Infinity, Infinity]
const max = [-Infinity, -Infinity, -Infinity]
for (const { positions } of meshes.values())
  for (let i = 0; i < positions.length; i++) {
    min[i % 3] = Math.min(min[i % 3], positions[i])
    max[i % 3] = Math.max(max[i % 3], positions[i])
  }
const center = min.map((v, i) => (v + max[i]) / 2)
const scale = 0.016 // millimetres to display units, as in the explorers

// The midline is the centre of the diaphragm's own left-right extent.
const diaphragm = meshes.get("FMA13295")!
let dMin = Infinity
let dMax = -Infinity
for (let i = 0; i < diaphragm.positions.length; i += 3) {
  dMin = Math.min(dMin, diaphragm.positions[i])
  dMax = Math.max(dMax, diaphragm.positions[i])
}
const midline = (dMin + dMax) / 2

await MeshoptSimplifier.ready
const credit =
  "BodyParts3D / Anatomography, © The Database Center for Life Science. CC BY-SA 2.1 Japan. Adapted by OrganUI."
const doc = new Document()
doc.getRoot().getAsset().copyright = credit
const scene = doc.createScene("OrganUI Diaphragm — BodyParts3D 3.0")
const buffer = doc.createBuffer()
const report = []
for (const structure of structures) {
  const { positions, indices: all } = meshes.get(structure.source)!
  let indices = all
  if (structure.side || structure.clip) {
    // Keep whole triangles by centroid: source -x is the patient's right.
    const centroid = (t: number, axis: number) =>
      (positions[all[t] * 3 + axis] +
        positions[all[t + 1] * 3 + axis] +
        positions[all[t + 2] * 3 + axis]) /
      3
    const kept: number[] = []
    for (let t = 0; t < all.length; t += 3) {
      if (
        structure.side &&
        centroid(t, 0) < midline !== (structure.side === "right")
      )
        continue
      const z = centroid(t, 2)
      if (structure.clip && (z < structure.clip[0] || z > structure.clip[1]))
        continue
      kept.push(all[t], all[t + 1], all[t + 2])
    }
    indices = new Uint32Array(kept)
  }
  const target = Math.min(indices.length, structure.triangles * 3)
  const [simplified] =
    target < indices.length
      ? MeshoptSimplifier.simplify(indices, positions, 3, target, 0.01, [
          "LockBorder",
        ])
      : [indices]
  // Compact to the vertices this structure uses, in display axes [x, z, -y].
  const remap = new Map<number, number>()
  const out: number[] = []
  const index = new Uint32Array(simplified.length)
  simplified.forEach((v, i) => {
    let n = remap.get(v)
    if (n === undefined) {
      n = remap.size
      remap.set(v, n)
      out.push(
        (positions[v * 3] - center[0]) * scale,
        (positions[v * 3 + 2] - center[2]) * scale,
        -(positions[v * 3 + 1] - center[1]) * scale
      )
    }
    index[i] = n
  })
  const position = new Float32Array(out)
  const normal = new Float32Array(position.length)
  for (let t = 0; t < index.length; t += 3) {
    const [a, b, c] = [index[t], index[t + 1], index[t + 2]].map((i) => i * 3)
    const e1 = [0, 1, 2].map((k) => position[b + k] - position[a + k])
    const e2 = [0, 1, 2].map((k) => position[c + k] - position[a + k])
    const n = [
      e1[1] * e2[2] - e1[2] * e2[1],
      e1[2] * e2[0] - e1[0] * e2[2],
      e1[0] * e2[1] - e1[1] * e2[0],
    ]
    for (const v of [a, b, c]) for (let k = 0; k < 3; k++) normal[v + k] += n[k]
  }
  for (let v = 0; v < normal.length; v += 3) {
    const length = Math.hypot(normal[v], normal[v + 1], normal[v + 2]) || 1
    for (let k = 0; k < 3; k++) normal[v + k] /= length
  }
  const rgb = [1, 3, 5].map(
    (i) => parseInt(structure.color.slice(i, i + 2), 16) / 255
  )
  const linear = rgb.map((c) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  )
  const material = doc
    .createMaterial(structure.id)
    .setBaseColorFactor([...linear, 1] as [number, number, number, number])
    .setRoughnessFactor(0.65)
    .setMetallicFactor(0)
    .setDoubleSided(true)
  const primitive = doc
    .createPrimitive()
    .setAttribute(
      "POSITION",
      doc.createAccessor().setType("VEC3").setArray(position).setBuffer(buffer)
    )
    .setAttribute(
      "NORMAL",
      doc.createAccessor().setType("VEC3").setArray(normal).setBuffer(buffer)
    )
    .setIndices(
      doc.createAccessor().setType("SCALAR").setArray(index).setBuffer(buffer)
    )
    .setMaterial(material)
  scene.addChild(
    doc
      .createNode(structure.id)
      .setMesh(doc.createMesh(structure.id).addPrimitive(primitive))
      .setExtras({ structureId: structure.id, fma: structure.source })
  )
  report.push({
    id: structure.id,
    fma: structure.source,
    sourceName: sources[structure.source][0],
    triangles: index.length / 3,
  })
}
const glb = await new NodeIO().writeBinary(doc)
const output = process.env.OUTPUT ?? "apps/web/public/models/diaphragm.glb"
await writeFile(output, glb)
console.log(
  JSON.stringify(
    { output, bytes: glb.byteLength, sha256: sha(glb), midline, report },
    null,
    2
  )
)
