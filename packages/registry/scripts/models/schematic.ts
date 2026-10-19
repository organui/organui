import {
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  Float32BufferAttribute,
  Matrix4,
  SphereGeometry,
  TubeGeometry,
  Vector3,
} from "three"
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js"
import type { OrganModel } from "../../registry/base-nova/organ-viewer/organ-viewer"

// Building blocks for the original schematic models generated from code
// (hair-and-nails.ts, cell.ts): parametric solids, tubes and ellipsoids, and a
// glTF binary writer with one node, mesh and material per structure.

export type Point = [number, number, number]
export type Radius = (t: number, phi: number) => number

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}
export const mix = (a: number, b: number, t: number) => a + (b - a) * t

/** A smooth, monotone radius profile through [t, r] control points. */
export function profile(points: readonly [number, number][]) {
  const secants = points
    .slice(1)
    .map(([t, r], i) => (r - points[i]![1]) / (t - points[i]![0]))
  // Fritsch–Carlson tangents: no overshoot between control points.
  const tangents = points.map((_, i) => {
    const before = secants[i - 1]
    const after = secants[i]
    if (before === undefined) return after!
    if (after === undefined) return before
    return before * after <= 0 ? 0 : (2 * before * after) / (before + after)
  })
  return (t: number) => {
    if (t <= points[0]![0]) return points[0]![1]
    for (let i = 1; i < points.length; i++) {
      const [t1, r1] = points[i]!
      const [t0, r0] = points[i - 1]!
      if (t > t1) continue
      const h = t1 - t0
      const s = (t - t0) / h
      const s2 = s * s
      const s3 = s2 * s
      return (
        (2 * s3 - 3 * s2 + 1) * r0 +
        (s3 - 2 * s2 + s) * h * tangents[i - 1]! +
        (-2 * s3 + 3 * s2) * r1 +
        (s3 - s2) * h * tangents[i]!
      )
    }
    return points[points.length - 1]![1]
  }
}

/**
 * A solid between two radii around an axis, over a range along it and an
 * angular sector. The sector's sides are the flat cut faces that show the
 * layers. `t` runs along the axis, `phi` around it and `r` out from it.
 */
export function sector(options: {
  map: (t: number, phi: number, r: number) => Point
  t0: number | ((phi: number) => number)
  t1: number | ((phi: number) => number)
  phi0: number
  phi1: number
  rIn: Radius
  rOut: Radius
  nu: number
  nv: number
}) {
  const { map, phi0, phi1, rIn, rOut, nu, nv } = options
  const t0 =
    typeof options.t0 === "number" ? () => options.t0 as number : options.t0
  const t1 =
    typeof options.t1 === "number" ? () => options.t1 as number : options.t1
  const point = (u: number, v: number, w: number) => {
    const phi = phi0 + (phi1 - phi0) * v
    // Cosine spacing packs rows towards the ends, where shapes round off.
    const s = (1 - Math.cos(Math.PI * u)) / 2
    const t = mix(t0(phi), t1(phi), s)
    return map(t, phi, mix(rIn(t, phi), rOut(t, phi), w))
  }
  const positions: number[] = []
  const indices: number[] = []
  const grid = (
    na: number,
    nb: number,
    at: (a: number, b: number) => Point,
    flip: boolean
  ) => {
    const start = positions.length / 3
    for (let j = 0; j <= nb; j++)
      for (let i = 0; i <= na; i++) positions.push(...at(i / na, j / nb))
    for (let j = 0; j < nb; j++)
      for (let i = 0; i < na; i++) {
        const a = start + j * (na + 1) + i
        const b = a + 1
        const c = a + na + 1
        const d = c + 1
        if (flip) indices.push(a, c, b, b, c, d)
        else indices.push(a, b, c, b, d, c)
      }
  }
  grid(nu, nv, (u, v) => point(u, v, 1), false)
  grid(nu, nv, (u, v) => point(u, v, 0), true)
  if (Math.abs(phi1 - phi0) < Math.PI * 2 - 1e-6) {
    grid(nu, 2, (u, w) => point(u, 0, w), false)
    grid(nu, 2, (u, w) => point(u, 1, w), true)
  }
  grid(nv, 2, (v, w) => point(0, v, w), true)
  grid(nv, 2, (v, w) => point(1, v, w), false)
  return new BufferGeometry()
    .setAttribute("position", new Float32BufferAttribute(positions, 3))
    .setIndex(indices)
}

export function tube(
  points: Point[],
  radius: number,
  segments = 64,
  radial = 12
) {
  const curve = new CatmullRomCurve3(
    points.map((p) => new Vector3(...p)),
    false,
    "centripetal"
  )
  const caps = [0, 1].map((t) =>
    new SphereGeometry(radius, radial, 8).translate(
      ...curve.getPoint(t).toArray()
    )
  )
  return merge([
    new TubeGeometry(curve, segments, radius, radial, false),
    ...caps,
  ])
}

export function ellipsoid(center: Point, radii: Point) {
  return new SphereGeometry(1, 24, 16).applyMatrix4(
    new Matrix4().makeScale(...radii).setPosition(...center)
  )
}

/**
 * Flattens the part of a shape beyond a cut plane onto it, so a gland or
 * vessel reads as sectioned. The small offset keeps it just proud of the cut
 * face it sits on.
 */
export function section(geometry: BufferGeometry, axis: 0 | 2, limit = 0.004) {
  const position = geometry.getAttribute("position")
  for (let i = 0; i < position.count; i++) {
    const value = axis === 0 ? position.getX(i) : position.getZ(i)
    if (value > limit) {
      if (axis === 0) position.setX(i, limit)
      else position.setZ(i, limit)
    }
  }
  return geometry
}

export function merge(parts: BufferGeometry[]) {
  const prepared = parts.map((part) => {
    const geometry = part.index ? part : part.toNonIndexed()
    for (const name of Object.keys(geometry.attributes))
      if (name !== "position") geometry.deleteAttribute(name)
    return geometry
  })
  const merged = mergeGeometries(prepared)
  if (!merged) throw new Error("Could not merge geometry")
  return merged
}

/** Drops zero-area triangles and computes normals. */
export function finish(geometry: BufferGeometry) {
  const position = geometry.getAttribute("position")
  const index = geometry.index!.array
  const kept: number[] = []
  const a = new Vector3()
  const b = new Vector3()
  const c = new Vector3()
  for (let i = 0; i < index.length; i += 3) {
    a.fromBufferAttribute(position, index[i]!)
    b.fromBufferAttribute(position, index[i + 1]!)
    c.fromBufferAttribute(position, index[i + 2]!)
    if (b.sub(a).cross(c.sub(a)).lengthSq() > 1e-14)
      kept.push(index[i]!, index[i + 1]!, index[i + 2]!)
  }
  geometry.setIndex(kept)
  geometry.computeVertexNormals()
  const normal = geometry.getAttribute("normal")
  for (let i = 0; i < normal.count; i++)
    if (
      !Number.isFinite(normal.getX(i)) ||
      a.fromBufferAttribute(normal, i).lengthSq() < 0.5
    )
      normal.setXYZ(i, 0, 1, 0)
  return geometry
}

// ---- glTF binary writer: one node, mesh and material per structure.

export function glb(
  model: OrganModel,
  builders: Record<string, () => BufferGeometry>,
  generator: string
) {
  const chunks: Uint8Array[] = []
  let byteLength = 0
  const bufferViews: object[] = []
  const accessors: object[] = []
  const add = (
    data: Float32Array | Uint16Array | Uint32Array,
    accessor: object
  ) => {
    const bytes = new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
    const padded = new Uint8Array(Math.ceil(bytes.length / 4) * 4)
    padded.set(bytes)
    bufferViews.push({
      buffer: 0,
      byteOffset: byteLength,
      byteLength: bytes.length,
    })
    chunks.push(padded)
    byteLength += padded.length
    accessors.push({ bufferView: bufferViews.length - 1, ...accessor })
    return accessors.length - 1
  }
  const nodes: object[] = []
  const meshes: object[] = []
  const materials: object[] = []
  for (const structure of model.structures) {
    const build = builders[structure.id]
    if (!build) throw new Error(`No geometry for ${structure.id}`)
    const geometry = finish(build())
    const position = new Float32Array(geometry.getAttribute("position").array)
    const normal = new Float32Array(geometry.getAttribute("normal").array)
    const count = position.length / 3
    const index =
      count < 65536
        ? new Uint16Array(geometry.index!.array)
        : new Uint32Array(geometry.index!.array)
    const min = [Infinity, Infinity, Infinity]
    const max = [-Infinity, -Infinity, -Infinity]
    for (let i = 0; i < position.length; i++) {
      min[i % 3] = Math.min(min[i % 3]!, position[i]!)
      max[i % 3] = Math.max(max[i % 3]!, position[i]!)
    }
    const attributes = {
      POSITION: add(position, {
        componentType: 5126,
        count,
        type: "VEC3",
        min,
        max,
      }),
      NORMAL: add(normal, { componentType: 5126, count, type: "VEC3" }),
    }
    const indices = add(index, {
      componentType: index instanceof Uint16Array ? 5123 : 5125,
      count: index.length,
      type: "SCALAR",
    })
    const color = new Color(structure.color)
    materials.push({
      name: structure.id,
      pbrMetallicRoughness: {
        baseColorFactor: [color.r, color.g, color.b, 1],
        metallicFactor: 0,
        roughnessFactor: 0.65,
      },
      doubleSided: true,
    })
    meshes.push({
      name: structure.id,
      primitives: [{ attributes, indices, material: materials.length - 1 }],
    })
    nodes.push({
      name: structure.id,
      mesh: meshes.length - 1,
      extras: { structureId: structure.id },
    })
  }
  const json = {
    asset: {
      version: "2.0",
      generator,
      copyright: model.attribution.credit,
    },
    scene: 0,
    scenes: [
      {
        name: `OrganUI ${model.name} schematic`,
        nodes: nodes.map((_, i) => i),
      },
    ],
    nodes,
    meshes,
    materials,
    buffers: [{ byteLength }],
    bufferViews,
    accessors,
  }
  const text = new TextEncoder().encode(JSON.stringify(json))
  const jsonChunk = new Uint8Array(Math.ceil(text.length / 4) * 4).fill(0x20)
  jsonChunk.set(text)
  const output = new Uint8Array(12 + 8 + jsonChunk.length + 8 + byteLength)
  const view = new DataView(output.buffer)
  view.setUint32(0, 0x46546c67, true)
  view.setUint32(4, 2, true)
  view.setUint32(8, output.length, true)
  view.setUint32(12, jsonChunk.length, true)
  view.setUint32(16, 0x4e4f534a, true)
  output.set(jsonChunk, 20)
  let offset = 20 + jsonChunk.length
  view.setUint32(offset, byteLength, true)
  view.setUint32(offset + 4, 0x004e4942, true)
  offset += 8
  for (const chunk of chunks) {
    output.set(chunk, offset)
    offset += chunk.length
  }
  return output
}
