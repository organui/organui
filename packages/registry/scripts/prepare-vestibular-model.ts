// Builds apps/web/public/models/vestibular.glb from Z-Anatomy.
//
// Z-Anatomy models the right bony labyrinth's vestibule and its three
// semicircular canals as one mesh, so this script splits it: canal walls are
// thin tubes and the vestibule is a wide chamber, so each vertex is measured by
// how far a ray travels inward before leaving the surface. Thin regions become
// canals, named after the Z-Anatomy label pin that touches them. The cochlea
// and vestibular nerve are copied as they are. See
// apps/web/public/models/vestibular.ATTRIBUTION.md.
//
// Run from packages/registry: bun scripts/prepare-vestibular-model.ts
import { createHash } from "node:crypto"
import { mkdir } from "node:fs/promises"
import { tmpdir } from "node:os"
import {
  BufferAttribute,
  BufferGeometry,
  Mesh,
  Ray,
  Vector3,
  type Object3D,
} from "three"
import { FBXLoader } from "three/addons/loaders/FBXLoader.js"
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js"

const source = {
  repository: "https://github.com/LluisV/Z-Anatomy",
  commit: "6c7f9016bd5899ac8edafd31b9900c151df42ed6",
  path: "Resources/Models/FBX/NervousSystem100.fbx",
  sha256: "3ea1aad64956cad27348a27b8fb50494b7cc307c6bc77bee0810ec2a67dff2b1",
  bytes: 53887724,
}
const output = new URL("../../../apps/web/public/models/", import.meta.url)

// Inward thickness, in centimetres, below which the wall belongs to a canal.
const canalThickness = 0.25
const canals = [
  { id: "anterior-canal", pin: "Anterior_semicircular_canalj" },
  { id: "posterior-canal", pin: "Posterior_semicircular_canalj" },
  { id: "lateral-canal", pin: "Lateral_semicircular_canalj" },
]
const copied = [
  { id: "cochlea", object: "Cochlear" },
  { id: "vestibular-nerve", object: "Vestibular_nerver" },
]
const colors: Record<string, string> = {
  vestibule: "#93b4cf",
  "anterior-canal": "#d98c6a",
  "posterior-canal": "#7fb07a",
  "lateral-canal": "#c9a64f",
  cochlea: "#a99cc9",
  "vestibular-nerve": "#e9d36f",
}

// FBXLoader only touches these globals for textures, which this file lacks.
Object.assign(globalThis, { window: globalThis, self: globalThis })
const sha = (data: Uint8Array) =>
  createHash("sha256").update(data).digest("hex")

const cache = `${tmpdir()}/organui-model-cache`
await mkdir(cache, { recursive: true })
const file = Bun.file(`${cache}/${source.sha256}.fbx`)
if (!(await file.exists())) {
  const url = `${source.repository.replace("github.com", "raw.githubusercontent.com")}/${source.commit}/${source.path}`
  console.log(`Downloading ${url}`)
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  await Bun.write(file, response)
}
const bytes = new Uint8Array(await file.arrayBuffer())
if (bytes.length !== source.bytes || sha(bytes) !== source.sha256)
  throw new Error("Checksum mismatch; review upstream before updating the pin")
const root: Object3D = new FBXLoader().parse(bytes.buffer, "")
root.updateMatrixWorld(true)

function geometryOf(name: string) {
  const found: Mesh[] = []
  root.traverse((object) => {
    if (object instanceof Mesh && object.name === name) found.push(object)
  })
  if (found.length !== 1)
    throw new Error(`Expected one mesh named ${name}, found ${found.length}`)
  const mesh = found[0]!
  const geometry = new BufferGeometry().setAttribute(
    "position",
    mesh.geometry.getAttribute("position").clone()
  )
  if (mesh.geometry.index) geometry.setIndex(mesh.geometry.index.clone())
  geometry.applyMatrix4(mesh.matrixWorld)
  const welded = mergeVertices(geometry, 1e-5)
  welded.computeVertexNormals()
  return welded
}

type Part = {
  id: string
  positions: number[]
  normals: number[]
  indices: number[]
}
const parts: Part[] = []

// --- Split the vestibule mesh ------------------------------------------------
const labyrinth = geometryOf("Vestibuler")
const position = labyrinth.getAttribute("position") as BufferAttribute
const normal = labyrinth.getAttribute("normal") as BufferAttribute
const index = labyrinth.index!
const count = position.count
const vertex = (i: number) => new Vector3().fromBufferAttribute(position, i)
const triangles: [number, number, number][] = []
for (let i = 0; i < index.count; i += 3)
  triangles.push([index.getX(i), index.getX(i + 1), index.getX(i + 2)])

const neighbours = Array.from({ length: count }, () => new Set<number>())
for (const [a, b, c] of triangles) {
  neighbours[a]!.add(b).add(c)
  neighbours[b]!.add(a).add(c)
  neighbours[c]!.add(a).add(b)
}

// The source normals point into the labyrinth; check rather than assume.
const centroid = new Vector3()
for (let i = 0; i < count; i++) centroid.add(vertex(i))
centroid.divideScalar(count)
let outward = 0
for (let i = 0; i < count; i++)
  outward += vertex(i)
    .sub(centroid)
    .dot(new Vector3().fromBufferAttribute(normal, i))
const inward = outward > 0 ? -1 : 1

const corners = triangles.map(
  (corner) => corner.map(vertex) as [Vector3, Vector3, Vector3]
)
const hit = new Vector3()
let thickness = new Float64Array(count)
for (let i = 0; i < count; i++) {
  const origin = vertex(i)
  const direction = new Vector3()
    .fromBufferAttribute(normal, i)
    .multiplyScalar(inward)
  const ray = new Ray(
    origin.clone().addScaledVector(direction, 1e-4),
    direction
  )
  let nearest = 1 // Rays that escape through the window openings count as wide.
  for (const [a, b, c] of corners)
    if (ray.intersectTriangle(a, b, c, false, hit)) {
      const distance = hit.distanceTo(origin)
      if (distance > 1e-3 && distance < nearest) nearest = distance
    }
  thickness[i] = nearest
}
for (let pass = 0; pass < 3; pass++) {
  const smoothed = new Float64Array(count)
  for (let i = 0; i < count; i++) {
    let sum = thickness[i]!
    for (const j of neighbours[i]!) sum += thickness[j]!
    smoothed[i] = sum / (neighbours[i]!.size + 1)
  }
  thickness = smoothed
}

function regions(member: (i: number) => boolean) {
  const region = new Int32Array(count).fill(-1)
  const sizes: number[] = []
  for (let start = 0; start < count; start++) {
    if (!member(start) || region[start] !== -1) continue
    const stack = [start]
    region[start] = sizes.length
    let size = 0
    while (stack.length) {
      const i = stack.pop()!
      size++
      for (const j of neighbours[i]!)
        if (member(j) && region[j] === -1) {
          region[j] = sizes.length
          stack.push(j)
        }
    }
    sizes.push(size)
  }
  return { region, sizes }
}

// The vestibule is the largest wide region; stray wide patches join the canals.
const wide = regions((i) => thickness[i]! >= canalThickness)
const chamber = wide.sizes.indexOf(Math.max(...wide.sizes))
const inVestibule = (i: number) => wide.region[i] === chamber

// Each label pin is a short stalk whose foot touches the canal it names.
const seeds = canals.map(({ pin }) => {
  const stalk = geometryOf(pin).getAttribute("position") as BufferAttribute
  let best = { distance: Infinity, vertex: -1 }
  for (let p = 0; p < stalk.count; p++) {
    const point = new Vector3().fromBufferAttribute(stalk, p)
    for (let i = 0; i < count; i++) {
      const distance = point.distanceTo(vertex(i))
      if (distance < best.distance) best = { distance, vertex: i }
    }
  }
  if (best.distance > 0.05)
    throw new Error(`${pin} does not touch the labyrinth`)
  if (inVestibule(best.vertex)) throw new Error(`${pin} touches the vestibule`)
  return best.vertex
})

// Grow each canal from its pin across thin wall. Where the anterior and
// posterior canals share the common crus, a vertex goes to the nearer pin.
const distances = seeds.map((seed) => {
  const distance = new Float64Array(count).fill(Infinity)
  distance[seed] = 0
  const queue: [number, number][] = [[0, seed]]
  while (queue.length) {
    queue.sort((a, b) => b[0] - a[0] || b[1] - a[1])
    const [d, i] = queue.pop()!
    if (d > distance[i]!) continue
    for (const j of neighbours[i]!) {
      if (inVestibule(j)) continue
      const next = d + vertex(i).distanceTo(vertex(j))
      if (next < distance[j]!) {
        distance[j] = next
        queue.push([next, j])
      }
    }
  }
  return distance
})
// Thin patches the canals can't reach are part of the vestibule wall.
const vestibuleLabel = canals.length
const label = Array.from({ length: count }, (_, i) => {
  const nearest = distances.map((distance) => distance[i]!)
  const best = Math.min(...nearest)
  return best === Infinity ? vestibuleLabel : nearest.indexOf(best)
})

// Where an edge joins two labels, the cut crosses it at the zero of a field
// that is positive on one side: wall thickness against the canal threshold
// between vestibule and canal, the difference in pin distance between canals.
function field(i: number, own: number, other: number) {
  if (own === vestibuleLabel) return thickness[i]! - canalThickness
  if (other === vestibuleLabel) return canalThickness - thickness[i]!
  return distances[other]![i]! - distances[own]![i]!
}
const ids = [...canals.map(({ id }) => id), "vestibule"]
const cutPositions: number[] = []
const cutNormals: number[] = []
const cuts = new Map<string, number>()
// Returns a vertex index; cut points are numbered after the mesh's own.
function cut(from: number, to: number) {
  const key = from < to ? `${from}:${to}` : `${to}:${from}`
  const known = cuts.get(key)
  if (known !== undefined) return known
  const [a, b] = from < to ? [from, to] : [to, from]
  const fa = field(a, label[a]!, label[b]!)
  const fb = -field(b, label[b]!, label[a]!)
  // Labels cleaned up from the raw threshold can disagree with the field's
  // sign, so keep the cut inside the edge.
  const t = Math.min(0.85, Math.max(0.15, fa / (fa - fb || 1)))
  for (const [target, attribute] of [
    [cutPositions, position],
    [cutNormals, normal],
  ] as const)
    target.push(
      attribute.getX(a) + (attribute.getX(b) - attribute.getX(a)) * t,
      attribute.getY(a) + (attribute.getY(b) - attribute.getY(a)) * t,
      attribute.getZ(a) + (attribute.getZ(b) - attribute.getZ(a)) * t
    )
  const created = count + cutPositions.length / 3 - 1
  cuts.set(key, created)
  return created
}
const pieces = ids.map(() => [] as number[])
for (const corner of triangles) {
  const labels = corner.map((i) => label[i]!)
  const distinct = new Set(labels)
  if (distinct.size === 1) {
    pieces[labels[0]!]!.push(...corner)
    continue
  }
  if (distinct.size === 3) {
    // Rare: three labels meet. Keep the triangle whole, on the vestibule.
    pieces[vestibuleLabel]!.push(...corner)
    continue
  }
  // Rotate so the lone vertex comes first, keeping the winding.
  const lone = labels.findIndex(
    (value) => labels.indexOf(value) === labels.lastIndexOf(value)
  )
  const [l, p, q] = [0, 1, 2].map((k) => corner[(lone + k) % 3]!) as [
    number,
    number,
    number,
  ]
  const lp = cut(l, p)
  const lq = cut(l, q)
  pieces[label[l]!]!.push(l, lp, lq)
  pieces[label[p]!]!.push(lp, p, q, lp, q, lq)
}
const positionOf = (i: number, axis: number) =>
  i < count
    ? position.getComponent(i, axis)
    : cutPositions[(i - count) * 3 + axis]!
const normalOf = (i: number, axis: number) =>
  i < count ? normal.getComponent(i, axis) : cutNormals[(i - count) * 3 + axis]!
pieces.forEach((corners, piece) => {
  if (!corners.length) throw new Error(`${ids[piece]} is empty`)
  const remap = new Map<number, number>()
  const part: Part = {
    id: ids[piece]!,
    positions: [],
    normals: [],
    indices: [],
  }
  for (const i of corners) {
    let local = remap.get(i)
    if (local === undefined) {
      local = remap.size
      remap.set(i, local)
      for (let axis = 0; axis < 3; axis++) {
        part.positions.push(positionOf(i, axis))
        // Normals come from the whole mesh so the cuts don't show as seams.
        part.normals.push(normalOf(i, axis) * -inward)
      }
    }
    part.indices.push(local)
  }
  parts.push(part)
})

// --- Copy the neighbours -----------------------------------------------------
for (const { id, object } of copied) {
  const geometry = geometryOf(object)
  const p = geometry.getAttribute("position") as BufferAttribute
  const n = geometry.getAttribute("normal") as BufferAttribute
  parts.push({
    id,
    positions: Array.from(p.array),
    normals: Array.from(n.array),
    indices: Array.from(geometry.index!.array),
  })
}

// --- Write the GLB -----------------------------------------------------------
// Source units are centimetres, Y up, +Z anterior, patient right at -X, which
// already match the viewer. Recentre on the labyrinth and keep the scale.
const min = [Infinity, Infinity, Infinity]
const max = [-Infinity, -Infinity, -Infinity]
for (const { positions } of parts.slice(0, ids.length))
  positions.forEach((value, k) => {
    min[k % 3] = Math.min(min[k % 3]!, value)
    max[k % 3] = Math.max(max[k % 3]!, value)
  })
const center = min.map((value, axis) => (value + max[axis]!) / 2)

const chunks: Uint8Array[] = []
const bufferViews: object[] = []
const accessors: object[] = []
let byteLength = 0
function addAccessor(
  array: Float32Array | Uint32Array,
  type: "VEC3" | "SCALAR"
) {
  const bytes = new Uint8Array(array.buffer, array.byteOffset, array.byteLength)
  bufferViews.push({
    buffer: 0,
    byteOffset: byteLength,
    byteLength: bytes.length,
  })
  chunks.push(bytes)
  byteLength += bytes.length
  const accessor: Record<string, unknown> = {
    bufferView: bufferViews.length - 1,
    componentType: array instanceof Float32Array ? 5126 : 5125,
    count: type === "VEC3" ? array.length / 3 : array.length,
    type,
  }
  if (type === "VEC3") {
    const lo = [Infinity, Infinity, Infinity]
    const hi = [-Infinity, -Infinity, -Infinity]
    array.forEach((value, k) => {
      lo[k % 3] = Math.min(lo[k % 3]!, value)
      hi[k % 3] = Math.max(hi[k % 3]!, value)
    })
    accessor.min = lo
    accessor.max = hi
  }
  accessors.push(accessor)
  return accessors.length - 1
}
const nodes = parts.map(({ id, positions, normals, indices }, mesh) => {
  const centred = new Float32Array(positions.length)
  positions.forEach((value, k) => (centred[k] = value - center[k % 3]!))
  const unit = new Float32Array(normals.length)
  for (let k = 0; k < normals.length; k += 3) {
    const length =
      Math.hypot(normals[k]!, normals[k + 1]!, normals[k + 2]!) || 1
    for (let axis = 0; axis < 3; axis++)
      unit[k + axis] = normals[k + axis]! / length
  }
  return {
    id,
    mesh,
    attributes: {
      POSITION: addAccessor(centred, "VEC3"),
      NORMAL: addAccessor(unit, "VEC3"),
    },
    indices: addAccessor(Uint32Array.from(indices), "SCALAR"),
    triangles: indices.length / 3,
  }
})
const linear = (channel: number) =>
  channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
const json = {
  asset: {
    version: "2.0",
    generator: "OrganUI prepare-vestibular-model",
    copyright:
      "Z-Anatomy (CC BY-SA 4.0), based in part on BodyParts3D, © The Database Center for Life Science (CC BY-SA 2.1 Japan). Adapted by OrganUI.",
  },
  scene: 0,
  scenes: [
    { name: "OrganUI vestibular system", nodes: nodes.map((_, i) => i) },
  ],
  nodes: nodes.map(({ id, mesh }) => ({
    name: id,
    mesh,
    extras: { structureId: id },
  })),
  meshes: nodes.map(({ id, attributes, indices }, material) => ({
    name: id,
    primitives: [{ attributes, indices, material }],
  })),
  materials: nodes.map(({ id }) => {
    const hex = colors[id]!
    const rgb = [1, 3, 5].map((k) =>
      linear(parseInt(hex.slice(k, k + 2), 16) / 255)
    )
    return {
      name: id,
      doubleSided: true,
      pbrMetallicRoughness: {
        baseColorFactor: [...rgb, 1],
        metallicFactor: 0,
        roughnessFactor: 0.65,
      },
    }
  }),
  accessors,
  bufferViews,
  buffers: [{ byteLength }],
}
const pad = (data: Uint8Array, fill: number) => {
  const padded = new Uint8Array(Math.ceil(data.length / 4) * 4).fill(fill)
  padded.set(data)
  return padded
}
const jsonChunk = pad(new TextEncoder().encode(JSON.stringify(json)), 0x20)
const binChunk = pad(Buffer.concat(chunks), 0)
const glb = new Uint8Array(12 + 8 + jsonChunk.length + 8 + binChunk.length)
const view = new DataView(glb.buffer)
view.setUint32(0, 0x46546c67, true)
view.setUint32(4, 2, true)
view.setUint32(8, glb.length, true)
view.setUint32(12, jsonChunk.length, true)
view.setUint32(16, 0x4e4f534a, true)
glb.set(jsonChunk, 20)
view.setUint32(20 + jsonChunk.length, binChunk.length, true)
view.setUint32(24 + jsonChunk.length, 0x004e4942, true)
glb.set(binChunk, 28 + jsonChunk.length)

await mkdir(output, { recursive: true })
await Bun.write(new URL("vestibular.glb", output), glb)
for (const { id, triangles } of nodes)
  console.log(`${id}: ${triangles} triangles`)
console.log(`vestibular.glb: ${glb.length} bytes, SHA-256 ${sha(glb)}`)
