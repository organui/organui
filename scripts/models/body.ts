// Builds apps/web/public/models/body.glb, the homepage's whole-body model,
// from BodyParts3D 4.3 OBJ meshes:
//
//   cd scripts/models && bun install && cd ../.. && bun scripts/models/body.ts
//
// body.json lists the parts, each with its source meshes pinned by checksum,
// the structure it belongs to and the most triangles it keeps. Structures
// are the homepage's apps/web/lib/body.ts, one per registry item, so each
// becomes a GLB node holding its parts as child meshes.
import { Document, NodeIO } from "@gltf-transform/core"
import { KHRMeshQuantization } from "@gltf-transform/extensions"
import {
  prune,
  quantize,
  simplifyPrimitive,
  weld,
} from "@gltf-transform/functions"
import { MeshoptSimplifier } from "meshoptimizer"
import { mkdir } from "node:fs/promises"
import { bodyModel } from "../../apps/web/lib/body"
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

type Part = {
  id: string
  structure: string
  triangles: number
  sources: Source[]
}
const { parts }: { parts: Part[] } = await Bun.file(
  new URL("body.json", import.meta.url)
).json()

const structures = bodyModel.structures.map(({ id }) => id)
for (const part of parts)
  if (!structures.includes(part.structure))
    throw new Error(`${part.id} belongs to unknown structure ${part.structure}`)
for (const id of structures)
  if (!parts.some((part) => part.structure === id))
    throw new Error(`${id} has no parts in body.json`)

const min = [Infinity, Infinity, Infinity]
const max = [-Infinity, -Infinity, -Infinity]
const prepared = []
for (const part of parts) {
  const positions: number[] = []
  const indices: number[] = []
  const sources = []
  for (const source of part.sources) {
    const url = `https://media.githubusercontent.com/media/${MIRROR}/${COMMIT}/meshes/${encodeURIComponent(source.file)}`
    const mesh = parse(
      await fetchPinned(source.file, url, source.sha256),
      source
    )
    const base = positions.length / 3
    for (const value of mesh.positions) positions.push(value)
    for (const index of mesh.indices) indices.push(base + index)
    sources.push({ ...source, concept: mesh.concept, name: mesh.name })
  }
  for (let i = 0; i < positions.length; i++) {
    min[i % 3] = Math.min(min[i % 3]!, positions[i]!)
    max[i % 3] = Math.max(max[i % 3]!, positions[i]!)
  }
  prepared.push({ ...part, positions, indices, sources })
}

const doc = new Document()
doc.getRoot().getAsset().copyright = CREDIT
doc.getRoot().getAsset().generator = "OrganUI scripts/models/body.ts"
const buffer = doc.createBuffer()
const scene = doc.createScene("Body")
const material = doc
  .createMaterial("tissue")
  .setRoughnessFactor(0.6)
  .setMetallicFactor(0)
  .setDoubleSided(true)
const groups = new Map(
  structures.map((id) => {
    const node = doc.createNode(id)
    scene.addChild(node)
    return [id, node]
  })
)
// BodyParts3D is +x left, +y posterior, +z superior; the viewer is +x left,
// +y superior, +z anterior.
const center = min.map((value, i) => (value + max[i]!) / 2)
for (const part of prepared) {
  const out = new Float32Array(part.positions.length)
  for (let i = 0; i < out.length; i += 3) {
    out[i] = (part.positions[i]! - center[0]!) * SCALE
    out[i + 1] = (part.positions[i + 2]! - center[2]!) * SCALE
    out[i + 2] = -(part.positions[i + 1]! - center[1]!) * SCALE
  }
  const primitive = doc
    .createPrimitive()
    .setAttribute(
      "POSITION",
      doc.createAccessor().setType("VEC3").setArray(out).setBuffer(buffer)
    )
    .setIndices(
      doc
        .createAccessor()
        .setType("SCALAR")
        .setArray(new Uint32Array(part.indices))
        .setBuffer(buffer)
    )
    .setMaterial(material)
  groups
    .get(part.structure)!
    .addChild(
      doc
        .createNode(part.id)
        .setMesh(doc.createMesh(part.id).addPrimitive(primitive))
    )
}

await MeshoptSimplifier.ready
await doc.transform(weld())
let before = 0
let after = 0
for (const part of prepared) {
  const primitive = doc
    .getRoot()
    .listMeshes()
    .find((mesh) => mesh.getName() === part.id)!
    .listPrimitives()[0]!
  const triangles = primitive.getIndices()!.getCount() / 3
  before += triangles
  // A whole-body overview only needs silhouettes, so error is unbounded and
  // the triangle cap decides.
  if (triangles > part.triangles)
    simplifyPrimitive(primitive, {
      simplifier: MeshoptSimplifier,
      ratio: part.triangles / triangles,
      error: 1,
    })
  const kept = primitive.getIndices()!.getCount() / 3
  after += kept
  console.log(`${part.id}: ${triangles} -> ${kept} triangles`)
}
await doc.transform(prune())
// Smooth, area-weighted normals on the welded vertices.
for (const mesh of doc.getRoot().listMeshes()) {
  const primitive = mesh.listPrimitives()[0]!
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
// KHR_mesh_quantization needs no decoder in three.js and halves the file.
await doc.transform(quantize({ quantizePosition: 14, quantizeNormal: 10 }))

const glb = await new NodeIO()
  .registerExtensions([KHRMeshQuantization])
  .writeBinary(doc)
const models = new URL("apps/web/public/models/", root)
await mkdir(models, { recursive: true })
await Bun.write(new URL("body.glb", models), glb)

const rows = prepared.flatMap(({ id, structure, sources }) =>
  sources.map(
    (s) =>
      `| ${structure} | ${id} | ${s.concept} | ${s.name} | ${s.element} | \`${s.sha256}\` |`
  )
)
await Bun.write(
  new URL("body.ATTRIBUTION.md", models),
  `# Body model attribution

\`body.glb\`, the homepage's whole-body model, is adapted from BodyParts3D,
© The Database Center for Life Science, licensed under
[CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en).
The adapted model is shared under the same licence. This licence covers the
model only; the OrganUI code is MIT.

Credit: ${CREDIT}

- Dataset: BodyParts3D 4.3 OBJ meshes (official licence statement:
  https://lifesciencedb.jp/bp3d/info/index.html#License)
- Retrieved from the GitHub mirror https://github.com/${MIRROR} at commit
  \`${COMMIT}\`, checked against the official \`FMA2Obj.txt\` mapping
  (sha256 \`${MAPPING.sha256}\`)
- Changes: meshes merged per part, recentred, scaled uniformly by ${SCALE}
  per millimetre and reoriented to +y superior, +z anterior; simplified with
  meshoptimizer from ${before} to ${after} triangles; normals recomputed;
  vertices quantized (KHR_mesh_quantization). No anatomy was added.
- Built by \`bun scripts/models/body.ts\` from \`scripts/models/body.json\`.
- Output: ${glb.byteLength} bytes, sha256 \`${sha(glb)}\`

| Structure | Part | FMA concept | Source name | Element | sha256 |
| --- | --- | --- | --- | --- | --- |
${rows.join("\n")}
`
)
Bun.spawnSync(
  ["bunx", "prettier", "--write", "apps/web/public/models/body.ATTRIBUTION.md"],
  { cwd: root.pathname }
)
console.log(
  `body.glb: ${glb.byteLength} bytes, ${before} -> ${after} triangles, ${parts.length} parts`
)
