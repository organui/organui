// Builds apps/web/public/models/breast.glb from the HuBMAP Human Reference
// Atlas left and right breast reference organs (CC BY 4.0).
//
//   cd scripts/models && bun install && bun breast.ts
//
// Downloads are pinned by commit and SHA-256, and the source node names are
// checked against the official ASCT+B to 3D crosswalk.
import { createHash } from "node:crypto"
import { mkdir } from "node:fs/promises"
import { Document, NodeIO, type Node } from "@gltf-transform/core"
import { prune, simplifyPrimitive, weld } from "@gltf-transform/functions"
import { MeshoptSimplifier } from "meshoptimizer"
import inputs from "./breast.inputs.json"

const output = new URL(
  "../../apps/web/public/models/breast.glb",
  import.meta.url
)
const cache = new URL(".cache/", import.meta.url)

// Source part name, then the most triangles it keeps per side. The sculpted
// source is very dense (855k triangles); these caps keep the shapes and bring
// the GLB to a size a docs page can load.
const parts = {
  fat: 14000,
  suspensory_ligaments: 12000,
  mammary_lobes: 16000,
  main_lactiferous_ducts: 9000,
  main_lactiferous_sinuses: 3000,
  areola: 3000,
  areolar_tubercles: 1500,
  nipple: 2000,
} as const
// Metres to display units, the same scale the HRA-based explorers use.
const scale = 16

const sha = (data: Uint8Array) =>
  createHash("sha256").update(data).digest("hex")

async function pinned(url: string, file: string, sha256: string) {
  const path = new URL(file, cache)
  let bytes: Uint8Array
  try {
    bytes = new Uint8Array(await Bun.file(path).arrayBuffer())
  } catch {
    console.log(`Downloading ${url}`)
    const response = await fetch(url)
    if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`)
    bytes = new Uint8Array(await response.arrayBuffer())
    await Bun.write(path, bytes)
  }
  if (sha(bytes) !== sha256)
    throw new Error(`Checksum mismatch for ${file}; review upstream first.`)
  return bytes
}

await mkdir(cache, { recursive: true })
const crosswalk = new TextDecoder()
  .decode(
    await pinned(
      `https://raw.githubusercontent.com/hubmapconsortium/ccf-releases/${inputs.crosswalk.commit}/${inputs.crosswalk.path}`,
      "crosswalk.csv",
      inputs.crosswalk.sha256
    )
  )
  .split(/\r?\n/)
  .map((line) => line.split(","))

const io = new NodeIO()
const doc = new Document()
doc.getRoot().getAsset().copyright =
  "HuBMAP Human Reference Atlas 3D reference organs for the female left and right breast (Heidi Schlehlein), CC BY 4.0. Adapted by OrganUI."
const buffer = doc.createBuffer()
const scene = doc.createScene("Breast")
const min = [Infinity, Infinity, Infinity]
const max = [-Infinity, -Infinity, -Infinity]
const prepared: { id: string; positions: number[]; indices: number[] }[] = []

for (const input of inputs.files) {
  const suffix = input.side === "left" ? "L" : "R"
  const bytes = await pinned(
    `https://raw.githubusercontent.com/hubmapconsortium/ccf-3d-reference-object-library/${inputs.commit}/${input.path}`,
    input.path.split("/").pop()!,
    input.sha256
  )
  const source = await io.readBinary(bytes)
  const nodes = source.getRoot().listNodes()
  const meshNodes = nodes.filter((node) => node.getMesh())
  if (meshNodes.length !== Object.keys(parts).length)
    throw new Error(`${input.path} has ${meshNodes.length} mesh nodes`)
  for (const part of Object.keys(parts)) {
    const name = `VH_F_${part}_${suffix}`
    const crosswalkFile = `3d-vh-f-mammary-gland-${suffix.toLowerCase()}`
    if (!crosswalk.some((row) => row[2] === name && row[6] === crosswalkFile))
      throw new Error(`${name} is not in the crosswalk for ${crosswalkFile}`)
    const node = nodes.find((candidate: Node) => candidate.getName() === name)
    const mesh = node?.getMesh()
    if (!node || !mesh) throw new Error(`Missing mesh node ${name}`)
    const matrix = node.getWorldMatrix()
    const positions: number[] = []
    const indices: number[] = []
    for (const primitive of mesh.listPrimitives()) {
      if (primitive.getMode() !== 4)
        throw new Error(`${name} has a non-triangle primitive`)
      const position = primitive.getAttribute("POSITION")!
      const offset = positions.length / 3
      const v = [0, 0, 0]
      for (let i = 0; i < position.getCount(); i++) {
        position.getElement(i, v)
        const world = [0, 1, 2].map(
          (row) =>
            matrix[row] * v[0]! +
            matrix[row + 4] * v[1]! +
            matrix[row + 8] * v[2]! +
            matrix[row + 12]
        )
        world.forEach((value, axis) => {
          if (!Number.isFinite(value)) throw new Error(`${name}: bad vertex`)
          min[axis] = Math.min(min[axis]!, value)
          max[axis] = Math.max(max[axis]!, value)
        })
        positions.push(world[0]!, world[1]!, world[2]!)
      }
      const index = primitive.getIndices()?.getArray()
      const faces = index
        ? Array.from(index)
        : [...Array(position.getCount()).keys()]
      for (const i of faces) indices.push(i + offset)
    }
    prepared.push({
      id: `${input.side}-${part.replaceAll("_", "-")}`,
      positions,
      indices,
    })
  }
}

const center = min.map((value, axis) => (value + max[axis]!) / 2)
for (const { id, positions, indices } of prepared) {
  const transformed = new Float32Array(positions.length)
  for (let i = 0; i < positions.length; i++)
    transformed[i] = (positions[i]! - center[i % 3]!) * scale
  const primitive = doc
    .createPrimitive()
    .setAttribute(
      "POSITION",
      doc
        .createAccessor()
        .setType("VEC3")
        .setArray(transformed)
        .setBuffer(buffer)
    )
    .setIndices(
      doc
        .createAccessor()
        .setType("SCALAR")
        .setArray(new Uint32Array(indices))
        .setBuffer(buffer)
    )
    .setMaterial(
      doc
        .createMaterial(id)
        .setRoughnessFactor(0.6)
        .setMetallicFactor(0)
        .setDoubleSided(true)
    )
  scene.addChild(
    doc.createNode(id).setMesh(doc.createMesh(id).addPrimitive(primitive))
  )
}

await MeshoptSimplifier.ready
await doc.transform(weld())
let before = 0
let after = 0
for (const node of doc.getRoot().listNodes()) {
  const primitive = node.getMesh()!.listPrimitives()[0]!
  const triangles = primitive.getIndices()!.getCount() / 3
  const part = node
    .getName()
    .replace(/^(left|right)-/, "")
    .replaceAll("-", "_")
  const cap = parts[part as keyof typeof parts]
  before += triangles
  if (triangles > cap)
    simplifyPrimitive(primitive, {
      simplifier: MeshoptSimplifier,
      ratio: cap / triangles,
      error: 0.01,
    })
  const kept = primitive.getIndices()!.getCount() / 3
  after += kept
  console.log(`${node.getName()}: ${triangles} -> ${kept} triangles`)
}
await doc.transform(prune())
// Smooth, area-weighted normals on the welded vertices.
for (const primitive of doc
  .getRoot()
  .listMeshes()
  .map((mesh) => mesh.listPrimitives()[0]!)) {
  const position = primitive.getAttribute("POSITION")!.getArray()!
  const index = primitive.getIndices()!.getArray()!
  const normal = new Float32Array(position.length)
  for (let i = 0; i < index.length; i += 3) {
    const [a, b, c] = [index[i]!, index[i + 1]!, index[i + 2]!].map(
      (v) => v * 3
    )
    const u = [0, 1, 2].map((k) => position[b! + k]! - position[a! + k]!)
    const w = [0, 1, 2].map((k) => position[c! + k]! - position[a! + k]!)
    const n = [
      u[1]! * w[2]! - u[2]! * w[1]!,
      u[2]! * w[0]! - u[0]! * w[2]!,
      u[0]! * w[1]! - u[1]! * w[0]!,
    ]
    for (const v of [a!, b!, c!])
      for (let k = 0; k < 3; k++) normal[v + k] += n[k]!
  }
  for (let v = 0; v < normal.length; v += 3) {
    const length = Math.hypot(normal[v]!, normal[v + 1]!, normal[v + 2]!) || 1
    for (let k = 0; k < 3; k++) normal[v + k] /= length
  }
  primitive.setAttribute(
    "NORMAL",
    doc.createAccessor().setType("VEC3").setArray(normal).setBuffer(buffer)
  )
}
for (const accessor of doc.getRoot().listAccessors())
  if (
    accessor.getArray() instanceof Uint32Array &&
    accessor.getMax([])[0]! < 65536
  )
    accessor.setArray(new Uint16Array(accessor.getArray()!))

const glb = await io.writeBinary(doc)
await Bun.write(output, glb)
console.log(
  `Wrote ${output.pathname}: ${before} -> ${after} triangles, ${glb.byteLength} bytes, sha256 ${sha(glb)}`
)
console.log(`Source bounds (m): ${JSON.stringify({ min, max })}`)
