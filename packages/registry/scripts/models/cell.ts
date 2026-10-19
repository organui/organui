import { createHash } from "node:crypto"
import { readFile, writeFile } from "node:fs/promises"
import {
  type BufferGeometry,
  CapsuleGeometry,
  CylinderGeometry,
  IcosahedronGeometry,
  Matrix4,
  Quaternion,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from "three"
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js"
import { cellModel } from "../../registry/base-nova/cell/cell"
import { glb, merge, sector, tube, type Point } from "./schematic"

// An original, schematic animal cell generated from code, with a quarter cut
// away to show the organelles. Nothing is measured or traced from a micrograph:
// organelles are enlarged and spaced for legibility, and every shape is a
// parametric shell, tube, capsule or sphere. Placement uses a seeded random
// number generator, so the output is deterministic.
//
//   bun scripts/models/cell.ts
//
// writes apps/web/public/models/cell.glb and updates `bytes` in cell.tsx.

// The cell's centre is the origin, +y up, and the removed quarter is x > 0,
// z > 0, facing the default view. Units are arbitrary: the cell is about six
// across.

/** Mulberry32: a small, seeded PRNG so every build places organelles alike. */
function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), seed | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = random(20261017)
const between = (a: number, b: number) => a + (b - a) * rand()
const unit = () => {
  const y = between(-1, 1)
  const phi = between(0, Math.PI * 2)
  const s = Math.sqrt(1 - y * y)
  return new Vector3(s * Math.cos(phi), y, s * Math.sin(phi))
}

const spherical = (
  centre: Vector3,
  r: number,
  theta: number,
  phi: number
): Point => [
  centre.x + r * Math.sin(theta) * Math.cos(phi),
  centre.y + r * Math.cos(theta),
  centre.z + r * Math.sin(theta) * Math.sin(phi),
]
const direction = (theta: number, phi: number) =>
  new Vector3(...spherical(new Vector3(), 1, theta, phi))
const angles = (p: Vector3) => {
  const length = p.length() || 1
  return {
    theta: Math.acos(Math.min(1, Math.max(-1, p.y / length))),
    phi: Math.atan2(p.z, p.x),
  }
}

/** How far a point lies inside the removed quarter; negative outside it. */
const intoCut = (p: Vector3) => Math.min(p.x, p.z)

/**
 * Flattens whatever lies in the removed quarter onto the nearer cut face, so
 * organelles crossing it read as sectioned. The small offset keeps the
 * section just proud of the face it sits on.
 */
function clip(geometry: BufferGeometry, limit = 0.004) {
  const position = geometry.getAttribute("position")
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i)
    const z = position.getZ(i)
    if (x <= limit || z <= limit) continue
    if (x < z) position.setX(i, limit)
    else position.setZ(i, limit)
  }
  return geometry
}

/** Places a geometry built along +y at `centre`, its axis along `axis`. */
function orient(geometry: BufferGeometry, centre: Vector3, axis: Vector3) {
  const rotation = new Quaternion().setFromUnitVectors(
    new Vector3(0, 1, 0),
    axis.clone().normalize()
  )
  return geometry.applyMatrix4(
    new Matrix4().compose(centre, rotation, new Vector3(1, 1, 1))
  )
}

const origin = new Vector3()

// ---- Shells: the plasma membrane and nuclear envelope, a quarter cut away.

const cellRadius = (theta: number, phi: number) =>
  3 *
  (1 + 0.03 * Math.sin(3 * phi + 0.6) * Math.sin(theta) ** 2) *
  (1 - 0.08 * Math.cos(theta) ** 2)
const membrane = 0.08

const nucleus = new Vector3(0, 0.1, 0)
const nucleusRadius = (theta: number, phi: number) =>
  1.1 * (1 + 0.03 * Math.sin(2 * phi) * Math.sin(theta))
const envelope = 0.09

const quarterCut = { phi0: Math.PI / 2, phi1: Math.PI * 2 }

/** Inside the cytoplasm, with `margin` to the membrane. */
function inCell(p: Vector3, margin: number) {
  const { theta, phi } = angles(p)
  return p.length() + margin < cellRadius(theta, phi) - membrane - 0.06
}

// ---- Fixed organelles around the nucleus.

const nucleolus = new Vector3(-0.12, 0.42, 0.3)

// Rough ER: four sheets wrapped around the nucleus on the far left, starting
// at the cut face so their sections show.
const roughSheets = [0, 1, 2, 3].map((k) => ({
  radius: 1.34 + 0.17 * k,
  theta0: 0.55 + 0.06 * k,
  theta1: 2.35 - 0.06 * k,
  phi1: Math.PI * (1.22 - 0.04 * k),
  wave: (theta: number, phi: number) =>
    0.045 * Math.sin(5 * phi + 3 * theta + k),
}))
const inRoughEr = (p: Vector3) => {
  const offset = p.clone().sub(nucleus)
  const { theta, phi } = angles(offset)
  const around = phi < 0 ? phi + Math.PI * 2 : phi
  return (
    offset.length() > 1.2 &&
    offset.length() < 1.98 &&
    around > Math.PI / 2 - 0.1 &&
    around < Math.PI * 1.25 &&
    theta > 0.45 &&
    theta < 2.45
  )
}

// Golgi: five curved cisternae, convex face towards the nucleus.
const golgiAxis = direction(1.3, Math.PI * 1.8)
const golgiApex = 1.7
const golgiCurve = 1.5
const golgiCentre = nucleus
  .clone()
  .addScaledVector(golgiAxis, golgiApex + golgiCurve)
const golgiBasis = (() => {
  const a = golgiAxis.clone().negate()
  const b = new Vector3(0, 1, 0).cross(a).normalize()
  const c = a.clone().cross(b).normalize()
  return { a, b, c }
})()

const golgiCisternae = [0, 1, 2, 3, 4].map((i) => ({
  radius: golgiCurve - 0.13 * i,
  width: 0.78 - 0.07 * Math.abs(i - 1.5),
}))
const golgiPoint = (r: number, t: number, phi: number) =>
  golgiCentre
    .clone()
    .addScaledVector(golgiBasis.a, r * Math.cos(t))
    .addScaledVector(golgiBasis.b, r * Math.sin(t) * Math.cos(phi))
    .addScaledVector(golgiBasis.c, r * Math.sin(t) * Math.sin(phi))

const centrosome = nucleus
  .clone()
  .addScaledVector(direction(0.85, Math.PI * 1.62), 1.6)

// Smooth ER: a tubular network below the rough ER.
const smoothNodes = (() => {
  const nodes: Vector3[] = []
  while (nodes.length < 13) {
    const p = nucleus
      .clone()
      .addScaledVector(
        direction(between(2.25, 2.75), between(Math.PI * 0.6, Math.PI * 1.1)),
        between(1.45, 2.35)
      )
    if (inCell(p, 0.12) && nodes.every((n) => n.distanceTo(p) > 0.38))
      nodes.push(p)
  }
  return nodes
})()
const smoothEdges = (() => {
  const edges = new Set<string>()
  smoothNodes.forEach((node, i) => {
    smoothNodes
      .map((other, j) => ({ j, d: node.distanceTo(other) }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)
      .forEach(({ j }) => edges.add([Math.min(i, j), Math.max(i, j)].join()))
  })
  return [...edges].map(
    (edge) => edge.split(",").map(Number) as [number, number]
  )
})()

// ---- Free-floating organelles, placed without overlapping anything.

type Body = { centre: Vector3; radius: number }
const bodies: Body[] = [
  { centre: nucleus, radius: 1.22 },
  ...golgiCisternae.flatMap(({ radius, width }) =>
    [0, 0.35, 0.7, 1].flatMap((s) =>
      Array.from({ length: s ? 10 : 1 }, (_, i) => ({
        centre: golgiPoint(
          radius,
          (s * width) / radius,
          (i / 10) * Math.PI * 2
        ),
        radius: 0.1,
      }))
    )
  ),
  { centre: centrosome, radius: 0.3 },
  ...smoothEdges.flatMap(([i, j]) =>
    [0, 0.25, 0.5, 0.75, 1].map((s) => ({
      centre: smoothNodes[i]!.clone().lerp(smoothNodes[j]!, s),
      radius: 0.12,
    }))
  ),
]

/**
 * Finds a free spot for a body of `radius` from `sample`. `cut` is how far the
 * centre may sit inside the removed quarter, as a share of the radius: bodies
 * that cross it are sectioned by `clip`.
 */
function place(radius: number, sample: () => Vector3, cut: number) {
  for (let attempt = 0; attempt < 2000; attempt++) {
    const centre = sample()
    if (
      inCell(centre, radius) &&
      intoCut(centre) < radius * cut &&
      !inRoughEr(centre) &&
      bodies.every(
        (body) => body.centre.distanceTo(centre) > body.radius + radius + 0.04
      )
    ) {
      const body = { centre, radius }
      bodies.push(body)
      return centre
    }
  }
  throw new Error(`No room for a body of radius ${radius}`)
}
const anywhere = () => unit().multiplyScalar(Math.cbrt(rand()) * 2.8)

const secretory = Array.from({ length: 12 }, (_, i) => {
  const radius = between(0.085, 0.12)
  const nearGolgi = i < 8
  const centre = place(
    radius,
    nearGolgi
      ? () =>
          nucleus
            .clone()
            .addScaledVector(golgiAxis, golgiApex + between(0.7, 1.05))
            .addScaledVector(golgiBasis.b, between(-0.6, 0.6))
            .addScaledVector(golgiBasis.c, between(-0.6, 0.6))
      : () => {
          const { theta, phi } = angles(unit())
          return direction(theta, phi).multiplyScalar(
            cellRadius(theta, phi) - membrane - 0.3
          )
        },
    0
  )
  return { centre, radius }
})

const mitochondria = Array.from({ length: 11 }, () => {
  const radius = between(0.16, 0.2)
  const length = between(0.45, 0.75)
  const centre = place(length / 2 + radius, anywhere, 0.35)
  return { centre, radius, length, axis: unit() }
})
const lysosomes = Array.from({ length: 6 }, () => {
  const radius = between(0.17, 0.24)
  return { centre: place(radius, anywhere, 0.4), radius }
})
const peroxisomes = Array.from({ length: 6 }, () => {
  const radius = between(0.11, 0.14)
  return { centre: place(radius, anywhere, 0.4), radius }
})
const ribosomes = Array.from({ length: 260 }, () =>
  place(0.035, anywhere, -1.2)
)

// ---- Geometry for each structure.

const blob = (centre: Vector3, radius: number, stretch = 1) =>
  new SphereGeometry(radius, 20, 14)
    .scale(1, stretch, 1)
    .rotateZ(rand() * Math.PI)
    .rotateX(rand() * Math.PI)
    .translate(centre.x, centre.y, centre.z)

/** A 20-face bead: ribosomes are too small on screen to need more. */
const bead = (radius: number) => {
  const geometry = new IcosahedronGeometry(radius, 0)
  geometry.deleteAttribute("normal")
  geometry.deleteAttribute("uv")
  return mergeVertices(geometry)
}

const builders: Record<string, () => BufferGeometry> = {
  "plasma-membrane": () =>
    sector({
      ...quarterCut,
      map: (t, phi, r) => spherical(origin, r, t, phi),
      t0: 0,
      t1: Math.PI,
      rIn: (t, phi) => cellRadius(t, phi) - membrane,
      rOut: cellRadius,
      nu: 48,
      nv: 72,
    }),
  microvilli: () => {
    const tips: Vector3[] = []
    const parts: BufferGeometry[] = []
    for (let attempt = 0; attempt < 4000 && tips.length < 70; attempt++) {
      const theta = Math.acos(between(Math.cos(0.75), 1))
      const phi = between(0, Math.PI * 2)
      const radius = cellRadius(theta, phi)
      const base = direction(theta, phi).multiplyScalar(radius - 0.04)
      if (intoCut(base) > -0.14 || tips.some((t) => t.distanceTo(base) < 0.24))
        continue
      tips.push(base)
      const length = between(0.26, 0.38)
      parts.push(
        orient(
          new CapsuleGeometry(0.05, length, 3, 8),
          base.clone().addScaledVector(direction(theta, phi), length / 2),
          direction(theta, phi)
        )
      )
    }
    return merge(parts)
  },
  "nuclear-envelope": () => {
    const parts: BufferGeometry[] = [
      sector({
        ...quarterCut,
        map: (t, phi, r) => spherical(nucleus, r, t, phi),
        t0: 0,
        t1: Math.PI,
        rIn: (t, phi) => nucleusRadius(t, phi) - envelope,
        rOut: nucleusRadius,
        nu: 36,
        nv: 54,
      }),
    ]
    // Nuclear pores, as rings on the outer membrane.
    const pores: Vector3[] = []
    for (let attempt = 0; attempt < 4000 && pores.length < 60; attempt++) {
      const normal = unit()
      const { theta, phi } = angles(normal)
      const p = nucleus
        .clone()
        .addScaledVector(normal, nucleusRadius(theta, phi) + 0.004)
      if (intoCut(p) > -0.1 || pores.some((q) => q.distanceTo(p) < 0.22))
        continue
      pores.push(p)
      parts.push(
        orient(
          new TorusGeometry(0.055, 0.018, 4, 10).rotateX(Math.PI / 2),
          p,
          normal
        )
      )
    }
    return merge(parts)
  },
  nucleolus: () => {
    const geometry = new SphereGeometry(1, 40, 28)
    const position = geometry.getAttribute("position")
    for (let i = 0; i < position.count; i++) {
      const v = new Vector3().fromBufferAttribute(position, i)
      const bump =
        1 + 0.07 * Math.sin(5 * v.x) * Math.sin(4 * v.y + 1) * Math.sin(6 * v.z)
      v.multiply(new Vector3(0.42, 0.37, 0.4))
        .multiplyScalar(bump)
        .add(nucleolus)
      position.setXYZ(i, v.x, v.y, v.z)
    }
    return geometry
  },
  chromatin: () => {
    const parts: BufferGeometry[] = []
    const fits = (p: Vector3) =>
      p.distanceTo(nucleus) < 0.9 &&
      p.distanceTo(nucleolus) > 0.5 &&
      intoCut(p) < 0.06
    while (parts.length < 16) {
      const start = nucleus
        .clone()
        .add(unit().multiplyScalar(Math.cbrt(rand()) * 0.85))
      if (!fits(start)) continue
      const points = [start]
      let heading = unit()
      while (points.length < 18) {
        let next: Vector3 | undefined
        for (let attempt = 0; attempt < 24 && !next; attempt++) {
          const turn = heading.clone().addScaledVector(unit(), 1.1).normalize()
          const candidate = points.at(-1)!.clone().addScaledVector(turn, 0.17)
          if (fits(candidate)) {
            next = candidate
            heading = turn
          }
        }
        if (!next) break
        points.push(next)
      }
      if (points.length < 6) continue
      parts.push(
        tube(
          points.map((p) => p.toArray()),
          0.032,
          points.length * 3,
          6
        )
      )
    }
    return merge(parts)
  },
  "rough-er": () => {
    const parts: BufferGeometry[] = []
    for (const sheet of roughSheets) {
      const half = 0.028
      const surface = (theta: number, phi: number) =>
        sheet.radius + sheet.wave(theta, phi)
      parts.push(
        sector({
          map: (t, phi, r) => spherical(nucleus, r, t, phi),
          t0: sheet.theta0,
          t1: sheet.theta1,
          phi0: Math.PI / 2,
          phi1: sheet.phi1,
          rIn: (t, phi) => surface(t, phi) - half,
          rOut: (t, phi) => surface(t, phi) + half,
          nu: 28,
          nv: 44,
        })
      )
      // Bound ribosomes stud the cytoplasmic face of each sheet.
      for (let i = 0; i < 120; i++) {
        const theta = between(sheet.theta0 + 0.04, sheet.theta1 - 0.04)
        const phi = between(Math.PI / 2 + 0.03, sheet.phi1 - 0.03)
        const p = new Vector3(
          ...spherical(nucleus, surface(theta, phi) + half + 0.022, theta, phi)
        )
        parts.push(bead(0.03).translate(p.x, p.y, p.z))
      }
    }
    return merge(parts)
  },
  "smooth-er": () =>
    merge(
      smoothEdges.map(([i, j]) => {
        const a = smoothNodes[i]!
        const b = smoothNodes[j]!
        const middle = a.clone().lerp(b, 0.5).add(unit().multiplyScalar(0.08))
        return tube([a.toArray(), middle.toArray(), b.toArray()], 0.055, 12, 8)
      })
    ),
  "golgi-apparatus": () =>
    merge(
      golgiCisternae.map(({ radius, width }) =>
        sector({
          map: (t, phi, r) => golgiPoint(r, t, phi).toArray(),
          t0: 0,
          t1: width / radius,
          phi0: 0,
          phi1: Math.PI * 2,
          rIn: () => radius - 0.03,
          rOut: () => radius + 0.03,
          nu: 12,
          nv: 36,
        })
      )
    ),
  vesicles: () =>
    merge(secretory.map(({ centre, radius }) => blob(centre, radius))),
  lysosomes: () =>
    merge(lysosomes.map(({ centre, radius }) => blob(centre, radius, 0.9))),
  mitochondria: () =>
    merge(
      mitochondria.map(({ centre, radius, length, axis }) =>
        orient(new CapsuleGeometry(radius, length, 8, 16), centre, axis)
      )
    ),
  peroxisomes: () =>
    merge(peroxisomes.map(({ centre, radius }) => blob(centre, radius, 1.15))),
  ribosomes: () =>
    merge(ribosomes.map((p) => bead(0.035).translate(p.x, p.y, p.z))),
  centrosome: () => {
    // Two centrioles at right angles, each a ring of nine microtubule rods.
    const first = new Vector3(0.3, 1, 0.2).normalize()
    const second = new Vector3(1, 0, 0).cross(first).normalize()
    return merge(
      [
        { centre: centrosome, axis: first },
        {
          centre: centrosome
            .clone()
            .addScaledVector(second, 0.17)
            .addScaledVector(first, 0.12),
          axis: second,
        },
      ].flatMap(({ centre, axis }) =>
        Array.from({ length: 9 }, (_, i) => {
          const angle = (i / 9) * Math.PI * 2
          return orient(
            new CylinderGeometry(0.024, 0.024, 0.3, 8).translate(
              0.075 * Math.cos(angle),
              0,
              0.075 * Math.sin(angle)
            ),
            centre,
            axis
          )
        })
      )
    )
  },
  microtubules: () => {
    const parts: BufferGeometry[] = []
    for (let attempt = 0; attempt < 600 && parts.length < 18; attempt++) {
      const towards = unit()
      const { theta, phi } = angles(towards)
      const end = towards.multiplyScalar(
        cellRadius(theta, phi) - membrane - 0.12
      )
      const middle = centrosome
        .clone()
        .lerp(end, 0.5)
        .add(unit().multiplyScalar(0.3))
      const points = [centrosome.clone(), middle, end]
      const samples = Array.from({ length: 21 }, (_, i) => {
        const s = i / 20
        return s < 0.5
          ? points[0]!.clone().lerp(points[1]!, s * 2)
          : points[1]!.clone().lerp(points[2]!, s * 2 - 1)
      })
      if (
        samples.some(
          (p, i) =>
            (i > 2 && p.distanceTo(nucleus) < 1.25) ||
            intoCut(p) > -0.04 ||
            !inCell(p, 0)
        )
      )
        continue
      parts.push(
        tube(
          points.map((p) => p.toArray()),
          0.02,
          24,
          5
        )
      )
    }
    return merge(parts)
  },
}
for (const [id, build] of Object.entries(builders))
  builders[id] = () => clip(build())

const output = glb(cellModel, builders, "organui cell 1.0.0")
await writeFile(
  new URL("../../../../apps/web/public/models/cell.glb", import.meta.url),
  output
)
const file = new URL("../../registry/base-nova/cell/cell.tsx", import.meta.url)
const source = await readFile(file, "utf8")
await writeFile(file, source.replace(/bytes: \d+,/, `bytes: ${output.length},`))
const sha = createHash("sha256").update(output).digest("hex")
console.log(`cell.glb: ${output.length} bytes, SHA-256 ${sha}`)
