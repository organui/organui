// Builds public/models/appendix.glb from pinned BodyParts3D 3.0 meshes.
// Run with `bun scripts/models/appendix.ts` from apps/web. Inputs are checked
// against SHA-256 pins so a changed upstream file is never used silently.
import { createHash } from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

const mirror =
  "https://raw.githubusercontent.com/Kevin-Mattheus-Moerman/BodyParts3D/f0eeb6e843380cfe6b83797cf8c3e1af74de5e61/assets/BodyParts3D_data/stl/"

// Region kept from meshes that run far beyond the right iliac fossa, in source
// millimetres: patient right of the midline, from the pelvic brim to the
// upper ascending colon. Triangles with any vertex outside it are dropped.
const region = { min: [-125, -200, 820], max: [-5, 0, 985] }

const structures: {
  id: string
  fma: string
  sha256: string
  color: string
  clip: boolean
  /** Keep only the connected pieces that touch this structure. */
  touching?: string
}[] = [
  {
    id: "appendix",
    fma: "FMA14542",
    sha256: "a33df099870c84b9fa131d8b5167dda0f8efc8e56d2788b0061101fd10a7d370",
    color: "#d67b9a",
    clip: false,
  },
  {
    id: "colon",
    fma: "FMA14543nsn",
    sha256: "ab970c4d688cf48b30d1c4f88634a0fca9233fc8e0cf3e7570edf0403448377f",
    color: "#d8b08c",
    clip: true,
    // Drops pieces of the sigmoid colon that reach into the region.
    touching: "appendix",
  },
  {
    id: "ileum",
    fma: "FMA7208",
    sha256: "47d26fb1bbc906d1b0743255cc049ef8bec28f17b6e00f47976e059c46f2f457",
    color: "#e2c29b",
    clip: true,
    // The other coils would hide the appendix from the front.
    touching: "colon",
  },
  {
    id: "right-external-iliac-artery",
    fma: "FMA18806",
    sha256: "c66c1bfa717ce58a76003bb1ced5fc671d265cc7a86a87d97b053c767cce47d1",
    color: "#c4544c",
    clip: false,
  },
  {
    id: "right-external-iliac-vein",
    fma: "FMA18885",
    sha256: "ea737a84477bca371b36452e186d9257dc71cd936ce87d1b786e8107d298c04a",
    color: "#5f7fa3",
    clip: false,
  },
  {
    id: "right-psoas-major",
    fma: "FMA22342",
    sha256: "a41bd94eaafc31f127dddc9a8542a7933abb048a386d292c80c05ac463d2955d",
    color: "#a8675e",
    clip: true,
  },
  {
    id: "right-iliacus",
    fma: "FMA22322",
    sha256: "1314ee5d2a7e70727f05d4b2c50f291b402144651e63add240df32597a02faa5",
    color: "#b97f72",
    clip: true,
  },
]

const sha = (data: Uint8Array) =>
  createHash("sha256").update(data).digest("hex")
const cache = join(tmpdir(), "organui-model-cache")
await mkdir(cache, { recursive: true })

async function input(fma: string, pin: string) {
  const path = join(cache, `${fma}.stl`)
  let bytes = await readFile(path).catch(() => undefined)
  if (!bytes) {
    const response = await fetch(`${mirror}${fma}.stl`)
    if (!response.ok) throw new Error(`${fma}: HTTP ${response.status}`)
    bytes = Buffer.from(await response.arrayBuffer())
    await writeFile(path, bytes)
  }
  const hash = sha(bytes)
  if (pin && hash !== pin) throw new Error(`Checksum mismatch: ${fma}`)
  return { bytes, hash }
}

const inside = (v: number[]) =>
  v.every((p, i) => p >= region.min[i]! && p <= region.max[i]!)

// Binary STL stores unindexed triangles; vertices are welded on exact position
// so smooth normals can be recomputed.
const meshes = []
for (const structure of structures) {
  const { bytes, hash } = await input(structure.fma, structure.sha256)
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const count = view.getUint32(80, true)
  if (bytes.length !== 84 + count * 50)
    throw new Error(`Invalid binary STL: ${structure.fma}`)
  const positions: number[] = []
  const indices: number[] = []
  const weld = new Map<string, number>()
  for (let t = 0; t < count; t++) {
    const corners = [0, 1, 2].map((k) =>
      [0, 1, 2].map((i) =>
        view.getFloat32(84 + t * 50 + 12 + k * 12 + i * 4, true)
      )
    )
    if (structure.clip && !corners.every(inside)) continue
    for (const v of corners) {
      const key = v.join(",")
      let index = weld.get(key)
      if (index === undefined) {
        index = positions.length / 3
        weld.set(key, index)
        positions.push(...v)
      }
      indices.push(index)
    }
  }
  meshes.push({ ...structure, hash, positions, indices, source: count })
}

for (const mesh of meshes) {
  const other = meshes.find(({ id }) => id === mesh.touching)
  if (!other) continue
  const parent = mesh.positions
    .map((_, i) => i)
    .slice(0, mesh.positions.length / 3)
  const root = (i: number): number =>
    parent[i] === i ? i : (parent[i] = root(parent[i]!))
  for (let i = 0; i < mesh.indices.length; i += 3) {
    parent[root(mesh.indices[i + 1]!)] = root(mesh.indices[i]!)
    parent[root(mesh.indices[i + 2]!)] = root(mesh.indices[i]!)
  }
  const touching = new Set<number>()
  for (let i = 0; i < mesh.positions.length; i += 3)
    for (let j = 0; j < other.positions.length; j += 3)
      if (
        Math.hypot(
          mesh.positions[i]! - other.positions[j]!,
          mesh.positions[i + 1]! - other.positions[j + 1]!,
          mesh.positions[i + 2]! - other.positions[j + 2]!
        ) < 4
      ) {
        touching.add(root(i / 3))
        break
      }
  const kept: number[] = []
  const remap = new Map<number, number>()
  const positions: number[] = []
  for (let i = 0; i < mesh.indices.length; i += 3) {
    if (!touching.has(root(mesh.indices[i]!))) continue
    for (const index of mesh.indices.slice(i, i + 3)) {
      let next = remap.get(index)
      if (next === undefined) {
        next = positions.length / 3
        remap.set(index, next)
        positions.push(...mesh.positions.slice(index * 3, index * 3 + 3))
      }
      kept.push(next)
    }
  }
  mesh.positions = positions
  mesh.indices = kept
}

const min = [Infinity, Infinity, Infinity]
const max = [-Infinity, -Infinity, -Infinity]
for (const { positions } of meshes)
  for (let i = 0; i < positions.length; i++) {
    min[i % 3] = Math.min(min[i % 3]!, positions[i]!)
    max[i % 3] = Math.max(max[i % 3]!, positions[i]!)
  }
const center = min.map((value, i) => (value + max[i]!) / 2)
// Millimetres to display units, uniform; axes change from Z-up to Y-up.
const scale = 0.02

const chunks: Buffer[] = []
let offset = 0
const bufferViews: object[] = []
const accessors: object[] = []
function push(array: Float32Array | Uint32Array, target: number) {
  const data = Buffer.from(array.buffer, array.byteOffset, array.byteLength)
  bufferViews.push({
    buffer: 0,
    byteOffset: offset,
    byteLength: data.length,
    target,
  })
  chunks.push(data)
  offset += data.length
  return bufferViews.length - 1
}

const nodes = meshes.map((mesh, m) => {
  const p = new Float32Array(mesh.positions.length)
  for (let i = 0; i < p.length; i += 3) {
    p[i] = (mesh.positions[i]! - center[0]!) * scale
    p[i + 1] = (mesh.positions[i + 2]! - center[2]!) * scale
    p[i + 2] = -(mesh.positions[i + 1]! - center[1]!) * scale
  }
  const n = new Float32Array(p.length)
  for (let i = 0; i < mesh.indices.length; i += 3) {
    const [a, b, c] = mesh.indices.slice(i, i + 3).map((v) => v * 3) as [
      number,
      number,
      number,
    ]
    const e1 = [0, 1, 2].map((k) => p[b + k]! - p[a + k]!)
    const e2 = [0, 1, 2].map((k) => p[c + k]! - p[a + k]!)
    const cross = [
      e1[1]! * e2[2]! - e1[2]! * e2[1]!,
      e1[2]! * e2[0]! - e1[0]! * e2[2]!,
      e1[0]! * e2[1]! - e1[1]! * e2[0]!,
    ]
    for (const v of [a, b, c])
      for (let k = 0; k < 3; k++) n[v + k] = n[v + k]! + cross[k]!
  }
  for (let i = 0; i < n.length; i += 3) {
    const length = Math.hypot(n[i]!, n[i + 1]!, n[i + 2]!) || 1
    for (let k = 0; k < 3; k++) n[i + k] = n[i + k]! / length
  }
  const pmin = [Infinity, Infinity, Infinity]
  const pmax = [-Infinity, -Infinity, -Infinity]
  p.forEach((value, i) => {
    pmin[i % 3] = Math.min(pmin[i % 3]!, value)
    pmax[i % 3] = Math.max(pmax[i % 3]!, value)
  })
  accessors.push(
    {
      bufferView: push(p, 34962),
      componentType: 5126,
      count: p.length / 3,
      type: "VEC3",
      min: pmin,
      max: pmax,
    },
    {
      bufferView: push(n, 34962),
      componentType: 5126,
      count: n.length / 3,
      type: "VEC3",
    },
    {
      bufferView: push(new Uint32Array(mesh.indices), 34963),
      componentType: 5125,
      count: mesh.indices.length,
      type: "SCALAR",
    }
  )
  return {
    name: mesh.id,
    mesh: m,
    extras: { structureId: mesh.id, fma: mesh.fma },
  }
})

const hex = (color: string) =>
  [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16) / 255)
const linear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
const credit =
  "BodyParts3D, © The Database Center for Life Science licensed under CC Attribution-Share Alike 2.1 Japan"
const json = {
  asset: { version: "2.0", generator: "OrganUI", copyright: credit },
  scene: 0,
  scenes: [{ name: "OrganUI Appendix", nodes: nodes.map((_, i) => i) }],
  nodes,
  meshes: meshes.map((mesh, m) => ({
    name: mesh.id,
    primitives: [
      {
        attributes: { POSITION: m * 3, NORMAL: m * 3 + 1 },
        indices: m * 3 + 2,
        material: m,
      },
    ],
  })),
  materials: meshes.map((mesh) => ({
    name: mesh.id,
    doubleSided: true,
    pbrMetallicRoughness: {
      baseColorFactor: [...hex(mesh.color).map(linear), 1],
      metallicFactor: 0,
      roughnessFactor: 0.65,
    },
  })),
  accessors,
  bufferViews,
  buffers: [{ byteLength: offset }],
}

const pad = (data: Buffer, fill: number) =>
  Buffer.concat([data, Buffer.alloc((4 - (data.length % 4)) % 4, fill)])
const jsonChunk = pad(Buffer.from(JSON.stringify(json)), 0x20)
const binChunk = pad(Buffer.concat(chunks), 0)
const header = (length: number, type: number) => {
  const b = Buffer.alloc(8)
  b.writeUInt32LE(length, 0)
  b.writeUInt32LE(type, 4)
  return b
}
const glb = Buffer.concat([
  header(0x46546c67, 2),
  Buffer.alloc(4),
  header(jsonChunk.length, 0x4e4f534a),
  jsonChunk,
  header(binChunk.length, 0x004e4942),
  binChunk,
])
glb.writeUInt32LE(glb.length, 8)
await writeFile(
  new URL("../../public/models/appendix.glb", import.meta.url),
  glb
)

for (const mesh of meshes)
  console.log(
    `${mesh.id} ${mesh.fma} sha256=${mesh.hash} triangles=${mesh.indices.length / 3}/${mesh.source}`
  )
console.log(`appendix.glb ${glb.length} bytes sha256=${sha(glb)}`)
