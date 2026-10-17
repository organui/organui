// Builds the GLBs this site hosts from BodyParts3D 4.3 OBJ meshes:
//   bun scripts/models/build.ts pituitary pineal
// Each organ's scripts/models/<organ>.json maps structure IDs to source
// meshes, pinned by checksum. Structure IDs, labels and colours come from the
// organ's registry item, so the GLB and the item cannot drift apart.
import { mkdir } from "node:fs/promises"
import type { OrganModel } from "../../packages/registry/registry/base-nova/organ-viewer/organ-viewer"

import {
  COMMIT,
  CREDIT,
  MAPPING,
  MIRROR,
  SCALE,
  fetchPinned,
  parse,
  root,
  sha,
  type Source,
} from "./bodyparts3d"

type Spec = { structures: Record<string, Source[]> }

function normals(positions: Float32Array, indices: Uint32Array) {
  const result = new Float32Array(positions.length)
  for (let i = 0; i < indices.length; i += 3) {
    const [a, b, c] = [
      indices[i]! * 3,
      indices[i + 1]! * 3,
      indices[i + 2]! * 3,
    ]
    const u = [0, 1, 2].map((k) => positions[b + k]! - positions[a + k]!)
    const v = [0, 1, 2].map((k) => positions[c + k]! - positions[a + k]!)
    const n = [
      u[1]! * v[2]! - u[2]! * v[1]!,
      u[2]! * v[0]! - u[0]! * v[2]!,
      u[0]! * v[1]! - u[1]! * v[0]!,
    ]
    for (const corner of [a, b, c])
      for (let k = 0; k < 3; k++) result[corner + k]! += n[k]!
  }
  for (let i = 0; i < result.length; i += 3) {
    const length = Math.hypot(result[i]!, result[i + 1]!, result[i + 2]!) || 1
    for (let k = 0; k < 3; k++) result[i + k]! /= length
  }
  return result
}

function glb(
  meshes: { id: string; positions: Float32Array; indices: Uint32Array }[]
) {
  const chunks: Uint8Array[] = []
  const bufferViews: object[] = []
  const accessors: object[] = []
  let offset = 0
  const add = (array: Float32Array | Uint32Array, accessor: object) => {
    bufferViews.push({
      buffer: 0,
      byteOffset: offset,
      byteLength: array.byteLength,
    })
    accessors.push({ bufferView: bufferViews.length - 1, ...accessor })
    chunks.push(
      new Uint8Array(array.buffer, array.byteOffset, array.byteLength)
    )
    offset += array.byteLength
    return accessors.length - 1
  }
  const gltfMeshes = meshes.map(({ id, positions, indices }) => {
    const min = [Infinity, Infinity, Infinity]
    const max = [-Infinity, -Infinity, -Infinity]
    for (let i = 0; i < positions.length; i++) {
      min[i % 3] = Math.min(min[i % 3]!, positions[i]!)
      max[i % 3] = Math.max(max[i % 3]!, positions[i]!)
    }
    const count = positions.length / 3
    const POSITION = add(positions, {
      componentType: 5126,
      count,
      type: "VEC3",
      min,
      max,
    })
    const NORMAL = add(normals(positions, indices), {
      componentType: 5126,
      count,
      type: "VEC3",
    })
    const index = add(indices, {
      componentType: 5125,
      count: indices.length,
      type: "SCALAR",
    })
    return {
      name: id,
      primitives: [
        { attributes: { POSITION, NORMAL }, indices: index, material: 0 },
      ],
    }
  })
  const json = {
    asset: {
      version: "2.0",
      generator: "OrganUI scripts/models/build.ts",
      copyright: CREDIT,
    },
    scene: 0,
    scenes: [{ nodes: meshes.map((_, i) => i) }],
    nodes: meshes.map(({ id }, mesh) => ({ name: id, mesh })),
    meshes: gltfMeshes,
    materials: [
      {
        pbrMetallicRoughness: { metallicFactor: 0, roughnessFactor: 0.65 },
        doubleSided: true,
      },
    ],
    buffers: [{ byteLength: offset }],
    bufferViews,
    accessors,
  }
  const pad = (bytes: Uint8Array, fill: number) => {
    const padded = new Uint8Array(Math.ceil(bytes.length / 4) * 4).fill(fill)
    padded.set(bytes)
    return padded
  }
  const text = pad(new TextEncoder().encode(JSON.stringify(json)), 0x20)
  const bin = new Uint8Array(Math.ceil(offset / 4) * 4)
  let at = 0
  for (const chunk of chunks)
    bin.set(chunk, (at += chunk.length) - chunk.length)
  const out = new Uint8Array(28 + text.length + bin.length)
  const view = new DataView(out.buffer)
  view.setUint32(0, 0x46546c67, true)
  view.setUint32(4, 2, true)
  view.setUint32(8, out.length, true)
  view.setUint32(12, text.length, true)
  view.setUint32(16, 0x4e4f534a, true)
  out.set(text, 20)
  view.setUint32(20 + text.length, bin.length, true)
  view.setUint32(24 + text.length, 0x004e4942, true)
  out.set(bin, 28 + text.length)
  return out
}

for (const organ of process.argv.slice(2)) {
  const spec: Spec = await Bun.file(
    new URL(`${organ}.json`, import.meta.url)
  ).json()
  const module = await import(
    `../../packages/registry/registry/base-nova/organ-viewer/${organ}.tsx`
  )
  const model = Object.values(module).find(
    (value) => typeof value === "object"
  ) as OrganModel
  const ids = model.structures.map(({ id }) => id)
  if (ids.join() !== Object.keys(spec.structures).join())
    throw new Error(`${organ}.json must list the item's structures in order`)
  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  const prepared = []
  for (const id of ids) {
    const positions: number[] = []
    const indices: number[] = []
    const sources = []
    for (const source of spec.structures[id]!) {
      const url = `https://media.githubusercontent.com/media/${MIRROR}/${COMMIT}/meshes/${encodeURIComponent(source.file)}`
      const mesh = parse(
        await fetchPinned(source.file, url, source.sha256),
        source
      )
      const base = positions.length / 3
      positions.push(...mesh.positions)
      for (const index of mesh.indices) indices.push(base + index)
      sources.push({ ...source, concept: mesh.concept, name: mesh.name })
    }
    for (let i = 0; i < positions.length; i++) {
      min[i % 3] = Math.min(min[i % 3]!, positions[i]!)
      max[i % 3] = Math.max(max[i % 3]!, positions[i]!)
    }
    prepared.push({ id, positions, indices, sources })
  }
  // BodyParts3D is +x left, +y posterior, +z superior; the viewer is +x
  // left, +y superior, +z anterior.
  const center = min.map((value, i) => (value + max[i]!) / 2)
  const meshes = prepared.map(({ id, positions, indices }) => {
    const out = new Float32Array(positions.length)
    for (let i = 0; i < positions.length; i += 3) {
      out[i] = (positions[i]! - center[0]!) * SCALE
      out[i + 1] = (positions[i + 2]! - center[2]!) * SCALE
      out[i + 2] = -(positions[i + 1]! - center[1]!) * SCALE
    }
    return { id, positions: out, indices: new Uint32Array(indices) }
  })
  const bytes = glb(meshes)
  const models = new URL("apps/web/public/models/", root)
  await mkdir(models, { recursive: true })
  await Bun.write(new URL(`${organ}.glb`, models), bytes)
  const rows = prepared.flatMap(({ id, sources }) =>
    sources.map(
      (s) =>
        `| ${id} | ${s.concept} | ${s.name} | ${s.element} | \`${s.sha256}\` |`
    )
  )
  await Bun.write(
    new URL(`${organ}.ATTRIBUTION.md`, models),
    `# ${model.name} model attribution

\`${organ}.glb\` is adapted from BodyParts3D, © The Database Center for Life
Science, licensed under
[CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en).
The adapted model is shared under the same licence. This licence covers the
model only; the OrganUI code is MIT.

Credit: ${CREDIT}

- Dataset: BodyParts3D 4.3 OBJ meshes (official licence statement:
  https://lifesciencedb.jp/bp3d/info/index.html#License)
- Retrieved from the GitHub mirror https://github.com/${MIRROR} at commit
  \`${COMMIT}\`, checked against the official \`FMA2Obj.txt\` mapping
  (sha256 \`${MAPPING.sha256}\`)
- Changes: meshes merged per structure, recentred, scaled uniformly by
  ${SCALE} per millimetre and reoriented to +y superior, +z anterior; normals
  recomputed. No geometry was reshaped.
- Built by \`bun scripts/models/build.ts ${organ}\`.
- Output: ${bytes.byteLength} bytes, sha256 \`${sha(bytes)}\`

| Structure | FMA concept | Source name | Element | sha256 |
| --- | --- | --- | --- | --- |
${rows.join("\n")}
`
  )
  Bun.spawnSync(
    [
      "bunx",
      "prettier",
      "--write",
      `apps/web/public/models/${organ}.ATTRIBUTION.md`,
    ],
    {
      cwd: root.pathname,
    }
  )
  console.log(
    `${organ}.glb: ${bytes.byteLength} bytes, ${ids.length} structures`
  )
}
