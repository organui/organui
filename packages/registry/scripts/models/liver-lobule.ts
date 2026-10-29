import { createHash } from "node:crypto"
import { readFile, writeFile } from "node:fs/promises"
import {
  type BufferGeometry,
  CylinderGeometry,
  Matrix4,
  Quaternion,
  SphereGeometry,
  Vector3,
} from "three"
import { liverLobuleModel } from "../../registry/base-nova/liver-lobule/liver-lobule"
import { glb, merge, sector, type Point } from "./schematic"

// An original, schematic classic liver lobule generated from code: a
// hexagonal prism with the central vein on its axis, a portal tract at each
// corner, and hepatocyte plates radiating between them, split into the three
// zones of the acinus. Nothing is measured or traced from a micrograph:
// plates are straight and fewer than in tissue, and the portal tracts are
// enlarged so the triad reads. Kupffer cells are placed with a seeded random
// number generator, so the output is deterministic.
//
//   bun scripts/models/liver-lobule.ts
//
// writes apps/web/public/models/liver-lobule.glb and updates `bytes` in
// liver-lobule.tsx.

// The lobule's axis is +y and its centre the origin. Corners, where the
// portal tracts sit, are at 0°, 60°, … around y. Units are arbitrary: the
// lobule is six across corner to corner and four high.

/** Mulberry32: a small, seeded PRNG so every build places cells alike. */
function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), seed | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = random(20261023)
const between = (a: number, b: number) => a + (b - a) * rand()

const corner = 3
const apothem = corner * Math.cos(Math.PI / 6)
const height = 4
const top = height / 2

const corners = Array.from({ length: 6 }, (_, k) => {
  const angle = (k * Math.PI) / 3
  return new Vector3(corner * Math.cos(angle), 0, corner * Math.sin(angle))
})

const veinRadius = 0.32
const plateStart = 0.42
// Around each corner: the portal tract, then the limiting plate.
const tractRadius = 0.5
const limitIn = 0.56
const limitOut = 0.76

/** The lobule's edge along an angle around y: the hexagon's flat side. */
function edge(angle: number) {
  const sixth = Math.PI / 3
  const offset = ((((angle - sixth / 2) % sixth) + sixth) % sixth) - sixth / 2
  return apothem / Math.cos(offset)
}

/**
 * How far a plate or sinusoid along `angle` reaches: to the lobule's edge, or
 * to the limiting plate where it passes a corner.
 */
function reach(angle: number) {
  const direction = new Vector3(Math.cos(angle), 0, Math.sin(angle))
  const limit = edge(angle) - 0.04
  for (let r = plateStart; r < limit; r += 0.005) {
    const point = direction.clone().multiplyScalar(r)
    if (corners.some((c) => c.distanceTo(point) < limitOut + 0.03)) return r
  }
  return limit
}

const around = (t: number, phi: number, r: number): Point => [
  r * Math.cos(phi),
  t,
  r * Math.sin(phi),
]

/** Places a geometry built along +y between two points. */
function between3(geometry: BufferGeometry, from: Vector3, to: Vector3) {
  const axis = to.clone().sub(from)
  const rotation = new Quaternion().setFromUnitVectors(
    new Vector3(0, 1, 0),
    axis.clone().normalize()
  )
  return geometry.applyMatrix4(
    new Matrix4().compose(
      from.clone().add(to).multiplyScalar(0.5),
      rotation,
      new Vector3(1, 1, 1)
    )
  )
}

/** A vertical rod at a point in the xz plane. */
function rod(at: Vector3, radius: number, y0: number, y1: number) {
  return new CylinderGeometry(radius, radius, y1 - y0, 24).translate(
    at.x,
    (y0 + y1) / 2,
    at.z
  )
}

// ---- Hepatocyte plates: 24 radial plates, each split into three zones by
// distance from the central vein. A plate narrows towards the vein, as the
// plates converge there in tissue.

const plates = 24
const plateHalfWidth = (Math.PI / plates) * 0.42
const plateAngles = Array.from(
  { length: plates },
  (_, i) => ((i + 0.5) * 2 * Math.PI) / plates
)
const plateTop = top - 0.08

function zone(from: number, to: number) {
  return merge(
    plateAngles.map((angle) => {
      const end = reach(angle)
      const length = end - plateStart
      return sector({
        map: around,
        t0: -plateTop,
        t1: plateTop,
        phi0: angle - plateHalfWidth,
        phi1: angle + plateHalfWidth,
        rIn: () => plateStart + length * from + (from > 0 ? 0.015 : 0),
        rOut: () => plateStart + length * to - (to < 1 ? 0.015 : 0),
        nu: 2,
        nv: 2,
      })
    })
  )
}

// ---- Sinusoids: a channel in each gap between plates, at five levels,
// converging on the central vein.

const levels = [-1.5, -0.75, 0, 0.75, 1.5]
const gapAngles = Array.from(
  { length: plates },
  (_, i) => (i * 2 * Math.PI) / plates
)
const sinusoidRuns = gapAngles.flatMap((angle) =>
  levels.map((y) => {
    const direction = new Vector3(Math.cos(angle), 0, Math.sin(angle))
    return {
      direction,
      y,
      from: veinRadius - 0.04,
      to: reach(angle),
    }
  })
)

const builders: Record<string, () => BufferGeometry> = {
  "central-vein": () => rod(new Vector3(), veinRadius, -top - 0.25, top + 0.25),
  "centrilobular-hepatocytes": () => zone(0, 1 / 3),
  "midzonal-hepatocytes": () => zone(1 / 3, 2 / 3),
  "periportal-hepatocytes": () => zone(2 / 3, 1),
  "limiting-plate": () =>
    merge(
      corners.map((c) => {
        // The arc of the ring that lies inside this lobule, facing its centre.
        const inward = Math.atan2(-c.z, -c.x)
        return sector({
          map: (t, phi, r) => [
            c.x + r * Math.cos(phi),
            t,
            c.z + r * Math.sin(phi),
          ],
          t0: -plateTop,
          t1: plateTop,
          phi0: inward - Math.PI / 3,
          phi1: inward + Math.PI / 3,
          rIn: () => limitIn,
          rOut: () => limitOut,
          nu: 2,
          nv: 24,
        })
      })
    ),
  sinusoids: () =>
    merge(
      sinusoidRuns.map(({ direction, y, from, to }) =>
        between3(
          new CylinderGeometry(0.045, 0.045, to - from, 8, 1, true),
          direction.clone().multiplyScalar(from).setY(y),
          direction.clone().multiplyScalar(to).setY(y)
        )
      )
    ),
  "kupffer-cells": () =>
    merge(
      sinusoidRuns.flatMap(({ direction, y, from, to }) =>
        Array.from({ length: 2 }, () => {
          const r = between(from + 0.3, to - 0.1)
          const at = direction.clone().multiplyScalar(r).setY(y)
          // Sitting on the wall of the sinusoid, flattened along it.
          const side = between(0, Math.PI * 2)
          const normal = new Vector3(-direction.z, 0, direction.x)
            .multiplyScalar(Math.cos(side))
            .setY(Math.sin(side))
          return new SphereGeometry(1, 10, 8).applyMatrix4(
            new Matrix4()
              .makeBasis(
                direction,
                normal,
                direction.clone().cross(normal).normalize()
              )
              .scale(new Vector3(0.11, 0.05, 0.06))
              .setPosition(at.addScaledVector(normal, 0.05))
          )
        })
      )
    ),
  // The connective tissue stops short of the top so the triad's cut ends
  // show above it.
  "portal-tract-stroma": () =>
    merge(corners.map((c) => rod(c, tractRadius, -top, top - 0.35))),
  "portal-venules": () =>
    merge(corners.map((c) => rod(c, 0.2, -top - 0.1, top + 0.1))),
  "hepatic-arterioles": () =>
    merge(
      corners.map((c) => {
        const tangent = new Vector3(-c.z, 0, c.x).normalize()
        return rod(c.clone().addScaledVector(tangent, 0.32), 0.07, -top, top)
      })
    ),
  "bile-ducts": () =>
    merge(
      corners.map((c) => {
        const tangent = new Vector3(c.z, 0, -c.x).normalize()
        return rod(c.clone().addScaledVector(tangent, 0.3), 0.1, -top, top)
      })
    ),
}

const output = glb(liverLobuleModel, builders, "organui liver lobule 1.0.0")
await writeFile(
  new URL(
    "../../../../apps/web/public/models/liver-lobule.glb",
    import.meta.url
  ),
  output
)
const file = new URL(
  "../../registry/base-nova/liver-lobule/liver-lobule.tsx",
  import.meta.url
)
const source = await readFile(file, "utf8")
await writeFile(file, source.replace(/bytes: \d+,/, `bytes: ${output.length},`))
const sha = createHash("sha256").update(output).digest("hex")
console.log(`liver-lobule.glb: ${output.length} bytes, SHA-256 ${sha}`)
