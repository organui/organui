// Builds public/home/heart.bin, the point cloud the home page's hero draws,
// by sampling the surface of the heart item's GLB. Run with
// `bun scripts/models/home-heart.ts` from apps/web. The GLB is the one the
// heart item loads, checked against a SHA-256 pin; where the CDN is out of
// reach, pass a local copy from organui/heart-3d at the same commit:
// `bun scripts/models/home-heart.ts ../heart-3d/public/models/heart.glb`.
//
// Format, little-endian: uint32 point count, uint8 structure count, then an
// RGB triple per structure (the item's colours, in its order), then per point
// int16 x, y, z (the model fitted to -1..1), int8 normal x, y, z and uint8
// structure index.
import { createHash } from "node:crypto"
import { heartModel } from "@workspace/registry/heart"

const sha256 =
  "b80a727d022a4ab07ccfcf15caccc228eaccb6d69ec0e72923324946ac35a946"
const points = 18000
// The cavities sit inside the walls; fewer points keeps them a faint core.
const weight: Record<string, number> = {
  "right-ventricle": 0.25,
  "left-ventricle": 0.25,
}

async function download() {
  const response = await fetch(heartModel.src)
  if (!response.ok) throw new Error(`heart.glb: HTTP ${response.status}`)
  return response.arrayBuffer()
}
const local = process.argv[2]
const glb = new Uint8Array(
  local ? await Bun.file(local).arrayBuffer() : await download()
)
if (createHash("sha256").update(glb).digest("hex") !== sha256)
  throw new Error("heart.glb changed upstream; review it and update the pin")

const view = new DataView(glb.buffer, glb.byteOffset)
const jsonLength = view.getUint32(12, true)
const gltf = JSON.parse(
  new TextDecoder().decode(glb.subarray(20, 20 + jsonLength))
) as {
  nodes: { extras: { structureId: string }; mesh: number }[]
  meshes: {
    primitives: { attributes: Record<string, number>; indices?: number }[]
  }[]
  accessors: {
    bufferView: number
    count: number
    byteOffset?: number
    componentType: number
    type: string
  }[]
  bufferViews: { byteOffset?: number; byteStride?: number }[]
}
const bin = 20 + jsonLength + 8

// Reads an accessor's values, honouring an interleaved buffer view's stride.
function read(accessor: number) {
  const {
    bufferView,
    count,
    byteOffset = 0,
    componentType,
    type,
  } = gltf.accessors[accessor]!
  const { byteOffset: viewOffset = 0, byteStride } =
    gltf.bufferViews[bufferView]!
  const size = type === "VEC3" ? 3 : 1
  const stride = byteStride ?? size * 4
  const values = new Float64Array(count * size)
  for (let i = 0; i < count; i++)
    for (let c = 0; c < size; c++) {
      const at = bin + viewOffset + byteOffset + i * stride + c * 4
      values[i * size + c] =
        componentType === 5125
          ? view.getUint32(at, true)
          : view.getFloat32(at, true)
    }
  return values
}

const structures = heartModel.structures.map(({ id }) => id)
type Triangle = { structure: number; area: number; p: number[]; n: number[] }
const triangles: Triangle[] = []
for (const node of gltf.nodes) {
  const structure = structures.indexOf(node.extras.structureId)
  if (structure < 0)
    throw new Error(`Unknown structure ${node.extras.structureId}`)
  for (const primitive of gltf.meshes[node.mesh]!.primitives) {
    const positions = read(primitive.attributes.POSITION!)
    const normals = read(primitive.attributes.NORMAL!)
    const indices =
      primitive.indices === undefined
        ? Array.from({ length: positions.length / 3 }, (_, index) => index)
        : read(primitive.indices)
    const corner = (values: Float64Array, index: number) => [
      ...values.subarray(index * 3, index * 3 + 3),
    ]
    for (let i = 0; i < indices.length; i += 3) {
      const corners = [indices[i]!, indices[i + 1]!, indices[i + 2]!]
      const p = corners.flatMap((index) => corner(positions, index))
      const n = corners.flatMap((index) => corner(normals, index))
      const [ax, ay, az, bx, by, bz, cx, cy, cz] = p as [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
      ]
      const u = [bx - ax, by - ay, bz - az] as const
      const v = [cx - ax, cy - ay, cz - az] as const
      const area =
        Math.hypot(
          u[1] * v[2] - u[2] * v[1],
          u[2] * v[0] - u[0] * v[2],
          u[0] * v[1] - u[1] * v[0]
        ) / 2
      triangles.push({
        structure,
        area: area * (weight[node.extras.structureId] ?? 1),
        p,
        n,
      })
    }
  }
}

// A seeded generator, so the output only changes when the input does.
let seed = 1
const random = () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}

const cumulative: number[] = []
let total = 0
for (const triangle of triangles) cumulative.push((total += triangle.area))

const sampled: { p: number[]; n: number[]; structure: number }[] = []
for (let i = 0; i < points; i++) {
  const target = random() * total
  let low = 0
  let high = cumulative.length - 1
  while (low < high) {
    const mid = (low + high) >> 1
    if (cumulative[mid]! < target) low = mid + 1
    else high = mid
  }
  const { p, n, structure } = triangles[low]!
  let u = random()
  let v = random()
  if (u + v > 1) [u, v] = [1 - u, 1 - v]
  const w = 1 - u - v
  const at = (values: number[], axis: number) =>
    w * values[axis]! + u * values[3 + axis]! + v * values[6 + axis]!
  const normal = [0, 1, 2].map((axis) => at(n, axis))
  const length = Math.hypot(...normal) || 1
  sampled.push({
    p: [0, 1, 2].map((axis) => at(p, axis)),
    n: normal.map((value) => value / length),
    structure,
  })
}

const min = [0, 1, 2].map((axis) =>
  Math.min(...sampled.map(({ p }) => p[axis]!))
)
const max = [0, 1, 2].map((axis) =>
  Math.max(...sampled.map(({ p }) => p[axis]!))
)
const center = min.map((value, axis) => (value + max[axis]!) / 2)
const half = Math.max(...max.map((value, axis) => value - min[axis]!)) / 2

const header = 5 + structures.length * 3
const out = new DataView(new ArrayBuffer(header + points * 10))
out.setUint32(0, points, true)
out.setUint8(4, structures.length)
heartModel.structures.forEach(({ color }, index) => {
  for (let channel = 0; channel < 3; channel++)
    out.setUint8(
      5 + index * 3 + channel,
      parseInt(color.slice(1 + channel * 2, 3 + channel * 2), 16)
    )
})
sampled.forEach(({ p, n, structure }, index) => {
  const offset = header + index * 10
  for (let axis = 0; axis < 3; axis++) {
    out.setInt16(
      offset + axis * 2,
      Math.round(((p[axis]! - center[axis]!) / half) * 32767),
      true
    )
    out.setInt8(offset + 6 + axis, Math.round(n[axis]! * 127))
  }
  out.setUint8(offset + 9, structure)
})

await Bun.write(
  new URL("../../public/home/heart.bin", import.meta.url),
  out.buffer
)
console.log(`public/home/heart.bin: ${points} points, ${out.byteLength} bytes`)
