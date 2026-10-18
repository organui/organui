import { createHash } from "node:crypto"
import { readFile, writeFile } from "node:fs/promises"
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
import { hairModel } from "../../registry/base-nova/hair/hair"
import { nailsModel } from "../../registry/base-nova/nails/nails"

// Original, schematic hair follicle and fingertip models generated from code.
// Nothing is measured or traced from a scan: proportions are chosen for
// legibility (the hair shaft and nail layers are exaggerated) and every shape
// is a parametric solid, tube or ellipsoid. Output is deterministic.
//
//   bun scripts/models/hair-and-nails.ts
//
// writes apps/web/public/models/{hair,nails}.glb and updates `bytes` in the
// organ files.

type Point = [number, number, number]
type Radius = (t: number, phi: number) => number

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}
const mix = (a: number, b: number, t: number) => a + (b - a) * t

/** A smooth, monotone radius profile through [t, r] control points. */
function profile(points: readonly [number, number][]) {
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
function sector(options: {
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

function tube(points: Point[], radius: number, segments = 64, radial = 12) {
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

function ellipsoid(center: Point, radii: Point) {
  return new SphereGeometry(1, 24, 16).applyMatrix4(
    new Matrix4().makeScale(...radii).setPosition(...center)
  )
}

/**
 * Flattens the part of a shape beyond a cut plane onto it, so a gland or
 * vessel reads as sectioned. The small offset keeps it just proud of the cut
 * face it sits on.
 */
function section(geometry: BufferGeometry, axis: 0 | 2, limit = 0.004) {
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

function merge(parts: BufferGeometry[]) {
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
function finish(geometry: BufferGeometry) {
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

// ---- Hair: a plug of scalp around one follicle, a quarter cut away. The axis
// is y, the skin surface y = 0, and the removed quarter faces +x +z.

const hair = (() => {
  const map = (t: number, phi: number, r: number): Point => [
    r * Math.cos(phi),
    t,
    r * Math.sin(phi),
  ]
  const around = { map, phi0: Math.PI / 2, phi1: Math.PI * 2 }
  const plug = 2.2
  const shaftTop = 1.7
  // Outer surface of the follicle epithelium: a neck, swelling to the bulb.
  const bulbCentre = -2.85
  const bulb = (t: number) => {
    const s = (t - bulbCentre) / 0.55
    return Math.abs(s) >= 1 ? 0 : 0.6 * Math.sqrt(1 - s * s)
  }
  const follicle = (t: number) =>
    t >= bulbCentre ? Math.max(0.42, bulb(t)) : bulb(t)
  const sheath = (t: number) => Math.max(follicle(t), 0.1) + 0.07
  const papilla = (t: number) => {
    const s = (t + 2.95) / 0.4
    const knob = Math.abs(s) >= 1 ? 0 : 0.28 * Math.sqrt(1 - s * s)
    return t < -3.2 ? Math.max(0.1, knob) : knob
  }
  const constant = (r: number) => () => r
  const bottom = -3.95

  const builders: Record<string, () => BufferGeometry> = {
    medulla: () =>
      sector({
        ...around,
        t0: -2.2,
        t1: shaftTop,
        rIn: constant(0),
        rOut: constant(0.06),
        nu: 8,
        nv: 24,
      }),
    cortex: () =>
      sector({
        ...around,
        t0: -2.4,
        t1: shaftTop,
        rIn: (t) => (t < -2.2 ? 0 : 0.06),
        rOut: constant(0.16),
        nu: 24,
        nv: 32,
      }),
    cuticle: () =>
      sector({
        ...around,
        t0: -2.4,
        t1: shaftTop,
        rIn: constant(0.16),
        rOut: constant(0.19),
        nu: 8,
        nv: 32,
      }),
    "inner-root-sheath": () =>
      sector({
        ...around,
        t0: -2.4,
        t1: -1.0,
        rIn: constant(0.19),
        rOut: (t) => mix(0.27, 0.195, smoothstep(-1.3, -1.0, t)),
        nu: 24,
        nv: 32,
      }),
    "outer-root-sheath": () =>
      sector({
        ...around,
        t0: -2.75,
        t1: -0.3,
        rIn: (t) => mix(0.27, follicle(t) - 0.05, smoothstep(-2.3, -2.6, t)),
        rOut: follicle,
        nu: 48,
        nv: 36,
      }),
    "connective-tissue-sheath": () =>
      sector({
        ...around,
        t0: -3.45,
        t1: -0.45,
        rIn: (t) => Math.max(follicle(t), 0.1),
        rOut: sheath,
        nu: 64,
        nv: 36,
      }),
    "hair-matrix": () =>
      sector({
        ...around,
        t0: -3.38,
        t1: -2.4,
        rIn: papilla,
        rOut: (t) => follicle(t) - 0.05 * smoothstep(-2.85, -2.7, t),
        nu: 48,
        nv: 36,
      }),
    "dermal-papilla": () =>
      sector({
        ...around,
        t0: -3.5,
        t1: -2.55,
        rIn: constant(0),
        rOut: papilla,
        nu: 40,
        nv: 32,
      }),
    "papilla-vessels": () =>
      section(
        tube(
          [
            [0.05, bottom + 0.02, 0],
            [0.05, -3.4, 0],
            [0.04, -3.05, 0],
            [0.07, -2.68, 0],
            [0.14, -2.78, 0],
            [0.15, -3.1, 0],
            [0.12, -3.4, 0],
            [0.14, bottom + 0.02, 0],
          ],
          0.028,
          96,
          10
        ),
        2
      ),
    "sebaceous-gland": () =>
      section(
        merge([
          ellipsoid([0, -0.74, 0.64], [0.16, 0.17, 0.17]),
          ellipsoid([0, -0.62, 0.86], [0.14, 0.14, 0.15]),
          ellipsoid([0, -0.86, 0.8], [0.13, 0.12, 0.13]),
          tube(
            [
              [0, -0.68, 0.6],
              [0, -0.64, 0.4],
              [0, -0.62, 0.22],
            ],
            0.05,
            16,
            10
          ),
        ]),
        0
      ),
    "arrector-pili": () =>
      section(
        tube(
          [
            [0, -1.45, 0.4],
            [0, -1.32, 0.7],
            [0, -0.95, 1.15],
            [0, -0.32, 1.6],
          ],
          0.055,
          48,
          10
        ),
        0
      ),
    epidermis: () =>
      sector({
        ...around,
        t0: -0.3,
        t1: 0,
        rIn: (t) => 0.27 + 0.12 * smoothstep(-0.3, 0, t),
        rOut: constant(plug),
        nu: 6,
        nv: 48,
      }),
    dermis: () =>
      sector({
        ...around,
        t0: -2.7,
        t1: -0.3,
        rIn: (t) => mix(sheath(t), 0.42, smoothstep(-0.5, -0.42, t)),
        rOut: constant(plug),
        nu: 40,
        nv: 48,
      }),
    hypodermis: () =>
      sector({
        ...around,
        t0: bottom,
        t1: -2.7,
        rIn: (t) => sheath(t) * smoothstep(-3.55, -3.45, t),
        rOut: constant(plug),
        nu: 36,
        nv: 48,
      }),
  }
  return builders
})()

// ---- Nail: the end of a finger, halved along its midline. The finger points
// along +x, the nail faces +y and the cut face looks along +z.

const nails = (() => {
  const map = (t: number, phi: number, r: number): Point => [
    t,
    r * Math.cos(phi),
    r * Math.sin(phi),
  ]
  const start = -2.8
  const tip = 0.15
  // The back of the fingertip stays flat under the nail; the pad rounds off
  // much sooner.
  const rounded = (from: number) => (t: number) => {
    if (t <= from) return 0.95
    const s = (t - from) / (tip - from)
    return 0.95 * Math.sqrt(Math.max(0, 1 - s * s))
  }
  const dorsal = rounded(-0.45)
  const palmar = rounded(-1.1)
  const skinRadius = (t: number, phi = 0) =>
    mix(palmar(t), dorsal(t), smoothstep(-2.2, -0.9, phi))
  const skinDepth = 0.07
  // Angular edges: the nail spans phi -1.05..0, its lateral fold -1.35..-1.0.
  const nail = -1.05
  const fold = -1.35
  const lunulaEnd = (phi: number) => -1.32 - 0.15 * (phi / nail) ** 2
  const freeEdge = (phi: number) => 0.2 - 0.12 * (phi / nail) ** 2
  const distal = profile([
    [-2.25, 0.4],
    [-1.95, 0.36],
    [-1.25, 0.22],
    [-0.8, 0.27],
    [-0.6, 0.3],
    [-0.47, 0.22],
    [-0.4, 0],
  ])
  const middle = profile([
    [start, 0.42],
    [-2.6, 0.44],
    [-2.45, 0.38],
    [-2.36, 0.25],
    [-2.31, 0],
  ])
  // The bones sit nearer the nail than the pad, on their own axis.
  const boneMap = (t: number, phi: number, r: number): Point => [
    t,
    0.12 + r * Math.cos(phi),
    r * Math.sin(phi),
  ]
  // Depth of the bed under the nail apparatus, from the fold to the tip.
  const floor = (t: number) =>
    t < -1.32
      ? 0.7
      : t < -0.25
        ? 0.76
        : Math.min(0.76, skinRadius(t) - skinDepth)
  const pulpOuter = (t: number, phi: number) => {
    const surface = Math.max(0, skinRadius(t, phi) - skinDepth)
    const underNail = t > -2.05 && t < -0.05
    const underFold = t > -2.05 && t < -0.25
    if (phi > nail && underNail) return floor(t)
    if (phi > fold && underFold) return 0.76
    return surface
  }
  const half = { map, phi1: 0 }
  const constant = (r: number) => () => r
  const plateOuter = (t: number) => mix(0.87, 0.9, smoothstep(-2.0, -1.7, t))

  const builders: Record<string, () => BufferGeometry> = {
    "nail-plate": () =>
      sector({
        ...half,
        phi0: nail,
        t0: -2.0,
        t1: freeEdge,
        rIn: constant(0.83),
        rOut: plateOuter,
        nu: 64,
        nv: 24,
      }),
    lunula: () =>
      sector({
        ...half,
        phi0: nail,
        t0: -1.6,
        t1: lunulaEnd,
        rIn: constant(0.7),
        rOut: constant(0.83),
        nu: 12,
        nv: 24,
      }),
    "nail-matrix": () =>
      sector({
        ...half,
        phi0: nail,
        t0: -2.05,
        t1: -1.6,
        rIn: constant(0.7),
        rOut: constant(0.83),
        nu: 12,
        nv: 24,
      }),
    "nail-bed": () =>
      sector({
        ...half,
        phi0: nail,
        t0: lunulaEnd,
        t1: -0.25,
        rIn: constant(0.76),
        rOut: constant(0.83),
        nu: 24,
        nv: 24,
      }),
    "proximal-nail-fold": () =>
      sector({
        ...half,
        phi0: nail,
        t0: -2.05,
        t1: -1.6,
        rIn: (t) => plateOuter(t),
        rOut: profile([
          [-2.05, 0.96],
          [-1.85, 1.0],
          [-1.66, 0.97],
          [-1.6, plateOuter(-1.6) + 0.005],
        ]),
        nu: 24,
        nv: 24,
      }),
    eponychium: () =>
      sector({
        ...half,
        phi0: nail,
        t0: -1.68,
        t1: -1.45,
        rIn: constant(0.9),
        rOut: (t) => 0.9 + 0.035 * (1 - smoothstep(-1.68, -1.45, t)),
        nu: 12,
        nv: 24,
      }),
    "lateral-nail-fold": () =>
      sector({
        ...half,
        phi0: fold,
        phi1: -1.0,
        t0: -2.05,
        t1: -0.25,
        rIn: constant(0.76),
        rOut: (t, phi) => Math.min(0.98, skinRadius(t, phi) + 0.03),
        nu: 48,
        nv: 12,
      }),
    hyponychium: () =>
      sector({
        ...half,
        phi0: nail,
        t0: -0.25,
        t1: -0.05,
        rIn: (t) => floor(t),
        rOut: constant(0.83),
        nu: 16,
        nv: 24,
      }),
    "distal-phalanx": () =>
      section(
        sector({
          map: boneMap,
          phi0: -Math.PI,
          phi1: Math.PI,
          t0: -2.25,
          t1: -0.4,
          rIn: constant(0),
          rOut: distal,
          nu: 96,
          nv: 48,
        }),
        2
      ),
    "middle-phalanx": () =>
      section(
        sector({
          map: boneMap,
          phi0: -Math.PI,
          phi1: Math.PI,
          t0: start,
          t1: -2.31,
          rIn: constant(0),
          rOut: middle,
          nu: 48,
          nv: 48,
        }),
        2
      ),
    "extensor-tendon": () =>
      section(
        tube(
          [
            [start, 0.7, 0],
            [-2.5, 0.68, 0],
            [-2.3, 0.62, 0],
            [-2.12, 0.55, 0],
          ],
          0.06,
          32,
          12
        ),
        2
      ),
    "flexor-tendon": () =>
      section(
        tube(
          [
            [start, -0.6, 0],
            [-2.5, -0.58, 0],
            [-2.2, -0.45, 0],
            [-1.9, -0.32, 0],
          ],
          0.08,
          32,
          12
        ),
        2
      ),
    "fingertip-pulp": () =>
      sector({
        ...half,
        phi0: -Math.PI,
        t0: start,
        t1: tip,
        rIn: constant(0),
        rOut: pulpOuter,
        nu: 160,
        nv: 64,
      }),
    skin: () =>
      merge([
        sector({
          ...half,
          phi0: -Math.PI,
          phi1: fold,
          t0: start,
          t1: tip,
          rIn: (t, phi) => Math.max(0, skinRadius(t, phi) - skinDepth),
          rOut: skinRadius,
          nu: 96,
          nv: 40,
        }),
        sector({
          ...half,
          phi0: fold,
          t0: start,
          t1: -2.05,
          rIn: (t, phi) => Math.max(0, skinRadius(t, phi) - skinDepth),
          rOut: skinRadius,
          nu: 8,
          nv: 24,
        }),
        sector({
          ...half,
          phi0: fold,
          // Under the free edge the skin starts where the hyponychium ends.
          t0: (phi) => mix(-0.25, -0.05, smoothstep(-1.08, -1.02, phi)),
          t1: tip,
          rIn: (t, phi) => Math.max(0, skinRadius(t, phi) - skinDepth),
          rOut: skinRadius,
          nu: 32,
          nv: 24,
        }),
      ]),
  }
  return builders
})()

// ---- glTF binary writer: one node, mesh and material per structure.

function glb(
  model: OrganModel,
  builders: Record<string, () => BufferGeometry>
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
      generator: "organui hair-and-nails 1.0.0",
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

const models = new URL("../../../../apps/web/public/models/", import.meta.url)
const organs = new URL("../../registry/base-nova/", import.meta.url)
for (const [name, model, builders] of [
  ["hair", hairModel, hair],
  ["nails", nailsModel, nails],
] as const) {
  const output = glb(model, builders)
  await writeFile(new URL(`${name}.glb`, models), output)
  const file = new URL(`${name}/${name}.tsx`, organs)
  const source = await readFile(file, "utf8")
  await writeFile(
    file,
    source.replace(/bytes: \d+,/, `bytes: ${output.length},`)
  )
  const sha = createHash("sha256").update(output).digest("hex")
  console.log(`${name}.glb: ${output.length} bytes, SHA-256 ${sha}`)
}
