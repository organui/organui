// Builds apps/web/public/models/joints.glb and the registry's joints.tsx from
// Z-Anatomy's Joints100 and SkeletalSystem100 FBX files.
//
//   cd scripts/models/joints && bun install && bun prepare.ts
//
// Then run prettier on the generated joints.tsx. Inputs are pinned to a
// Z-Anatomy commit and checked by size and SHA-256 before use.
import { createHash } from "node:crypto"
import { mkdir } from "node:fs/promises"
import { resolve } from "node:path"
import { Document, NodeIO } from "@gltf-transform/core"
import { KHRMeshQuantization } from "@gltf-transform/extensions"
import { quantize } from "@gltf-transform/functions"
import { MeshoptSimplifier } from "meshoptimizer"
import {
  Box3,
  BufferAttribute,
  BufferGeometry,
  Color,
  Mesh,
  Vector3,
  type Object3D,
} from "three"
import { FBXLoader } from "three/addons/loaders/FBXLoader.js"
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js"
import { catalog, type Entry, type Kind } from "./catalog"
import inputs from "./inputs.json"

// FBXLoader only touches these globals for texture loading, which these files
// don't use.
Object.assign(globalThis, { window: globalThis, self: globalThis })

const root = resolve(import.meta.dirname, "../../..")
const glbPath = resolve(root, "apps/web/public/models/joints.glb")
const manifestPath = resolve(root, "scripts/models/joints/manifest.json")
const registryPath = resolve(
  root,
  "packages/registry/registry/base-nova/joints/joints.tsx"
)

const sha = (data: Uint8Array) =>
  createHash("sha256").update(data).digest("hex")
const cache = resolve(import.meta.dirname, ".asset-cache")
await mkdir(cache, { recursive: true })
const roots = new Map<string, Object3D>()
for (const input of inputs.files) {
  const file = Bun.file(resolve(cache, `${input.name}.fbx`))
  if (!(await file.exists())) {
    console.log(`Downloading ${input.path}…`)
    const response = await fetch(input.url)
    if (!response.ok) throw new Error(`${input.name}: HTTP ${response.status}`)
    await Bun.write(file, response)
  }
  const bytes = new Uint8Array(await file.arrayBuffer())
  if (bytes.length !== input.bytes || sha(bytes) !== input.sha256)
    throw new Error(
      `Checksum mismatch: ${input.name}. Refusing changed upstream data; review it before updating the pin.`
    )
  const object = new FBXLoader().parse(bytes.buffer, "")
  object.updateMatrixWorld(true)
  roots.set(input.name, object)
}

// Joints100 objects left out on purpose. The cross sections are clipping
// helpers. The triradiate cartilage fuses in the teens and
// would cover the adult acetabulum. Each nucleus pulposus sits wholly inside
// its disc, so it is never seen.
const skipped = [
  /^Cross_Section_[XYZ]$/,
  /^Triradiate_cartilage[lr]$/,
  /^Nucleus_pulposus_/,
]

const jointMeshes = new Map<string, Mesh>()
roots.get("Joints100")!.traverse((object) => {
  if (!(object instanceof Mesh)) return
  if (jointMeshes.has(object.name))
    throw new Error(`Duplicate Joints100 object: ${object.name}`)
  jointMeshes.set(object.name, object)
})

// A bone is a mesh whose ancestors are all category groups (names ending in
// "g"). Meshes nested under a bone are muscle attachments and labels, and
// names ending in "i" or "j" are label leader lines.
const boneMeshes: { mesh: Mesh; ancestors: string[] }[] = []
roots.get("SkeletalSystem100")!.traverse((object) => {
  if (!(object instanceof Mesh) || /[ij]$/.test(object.name)) return
  const ancestors: string[] = []
  for (let parent = object.parent; parent?.parent; parent = parent.parent) {
    if (parent instanceof Mesh || !parent.name.endsWith("g")) return
    ancestors.push(parent.name)
  }
  boneMeshes.push({ mesh: object, ancestors })
})

// Full-resolution geometry is about a million triangles. Every mesh is
// simplified with meshoptimizer, which only removes vertices along the existing
// surface, to a budget proportional to its size: TRIANGLES_PER_CM of
// bounding-box diagonal, at least MIN_TRIANGLES, never more than the source,
// and never past MAX_ERROR of the mesh's own extent. Context bones get a
// coarser budget than the joints themselves.
const budgets: Record<"joint" | "bone", [number, number, number]> = {
  joint: [60, 80, 0.005],
  bone: [20, 400, 0.01],
}
await MeshoptSimplifier.ready

let sourceTriangles = 0
type Piece = { positions: Float32Array; indices: Uint32Array; source: string }
function prepare(mesh: Mesh, budget: [number, number, number]): Piece {
  // Keep positions only, in world space, then weld coincident vertices so the
  // mesh can be simplified and normals smoothed.
  const source = new BufferGeometry().setAttribute(
    "position",
    mesh.geometry.getAttribute("position").clone()
  )
  if (mesh.geometry.index) source.setIndex(mesh.geometry.index.clone())
  source.applyMatrix4(mesh.matrixWorld)
  const welded = mergeVertices(source, 1e-4)
  const positions = new Float32Array(welded.getAttribute("position").array)
  const indices = new Uint32Array(welded.index!.array)
  if (!positions.every(Number.isFinite))
    throw new Error(`Invalid vertex: ${mesh.name}`)
  const [perCm, minimum, maxError] = budget
  welded.computeBoundingBox()
  const diagonal = welded.boundingBox!.getSize(new Vector3()).length()
  const triangles = indices.length / 3
  sourceTriangles += triangles
  const target = Math.min(
    triangles,
    Math.max(minimum, Math.round(diagonal * perCm))
  )
  let simplified = indices
  if (target < triangles)
    [simplified] = MeshoptSimplifier.simplify(
      indices,
      positions,
      3,
      target * 3,
      maxError
    )
  // Drop the vertices simplification left unused.
  const remap = new Map<number, number>()
  const kept: number[] = []
  const compact = simplified.map((v) => {
    let next = remap.get(v)
    if (next === undefined) {
      next = remap.size
      remap.set(v, next)
      kept.push(positions[v * 3], positions[v * 3 + 1], positions[v * 3 + 2])
    }
    return next
  })
  source.dispose()
  welded.dispose()
  return {
    positions: new Float32Array(kept),
    indices: compact,
    source: mesh.name,
  }
}

const claimed = new Set<string>()
const pieces = new Map<string, Piece[]>()
for (const entry of catalog) {
  const found: Piece[] = []
  for (const base of entry.sources ?? []) {
    // A paired object has an "l" and an "r" copy; a few have one unsuffixed.
    const names = [base, `${base}l`, `${base}r`].filter((n) =>
      jointMeshes.has(n)
    )
    if (!names.length) throw new Error(`${entry.id}: no object named ${base}`)
    for (const name of names) {
      if (claimed.has(name)) throw new Error(`Duplicate ownership: ${name}`)
      claimed.add(name)
      found.push(prepare(jointMeshes.get(name)!, budgets.joint))
    }
  }
  for (const { mesh, ancestors } of boneMeshes)
    if (entry.bones?.some((group) => ancestors.includes(group))) {
      claimed.add(`SkeletalSystem100/${mesh.name}`)
      found.push(prepare(mesh, budgets.bone))
    }
  if (!found.length) throw new Error(`${entry.id}: no geometry`)
  pieces.set(entry.id, found)
}
const unclaimed = [...jointMeshes.keys()].filter(
  (name) => !claimed.has(name) && !skipped.some((pattern) => pattern.test(name))
)
if (unclaimed.length)
  throw new Error(`Unassigned Joints100 objects: ${unclaimed.join(", ")}`)

// Source units are centimetres, Y up, +Z anterior and the patient's left at
// +X, so the axes already match the viewer. Coordinates are recentred and
// uniformly scaled, with no anatomical reshaping.
const bounds = new Box3()
for (const list of pieces.values())
  for (const { positions } of list)
    for (let i = 0; i < positions.length; i += 3)
      bounds.expandByPoint(
        new Vector3(positions[i], positions[i + 1], positions[i + 2])
      )
const center = bounds.getCenter(new Vector3())
const SCALE = 0.025

const palette: Record<Kind, string[]> = {
  ligament: ["#3f78a8", "#5689b5"],
  capsule: ["#8fb0c8", "#a2bfd3"],
  fibrocartilage: ["#2f8f8c", "#45a19c"],
  membrane: ["#7fa37c", "#93b48e"],
  fat: ["#dfbd6c"],
  bone: ["#ece6d8", "#e3dccb"],
}
const colors = new Map<string, string>()
const seen = new Map<string, number>()
for (const entry of catalog) {
  const key = `${entry.group}/${entry.kind}`
  const n = seen.get(key) ?? 0
  seen.set(key, n + 1)
  const shades = palette[entry.kind]
  colors.set(entry.id, shades[n % shades.length]!)
}

const doc = new Document()
doc.getRoot().getAsset().copyright =
  "Z-Anatomy (CC BY-SA 4.0), based in part on BodyParts3D, © The Database Center for Life Science (CC BY-SA 2.1 Japan). Adapted by OrganUI."
const scene = doc.createScene("OrganUI Joints — Z-Anatomy")
const buffer = doc.createBuffer()
const manifest: Record<string, { triangles: number; sources: string[] }> = {}
let totalTriangles = 0
for (const entry of catalog) {
  const list = pieces.get(entry.id)!
  const count = list.reduce((sum, p) => sum + p.positions.length / 3, 0)
  const positions = new Float32Array(count * 3)
  const indices: number[] = []
  let offset = 0
  for (const piece of list) {
    for (let i = 0; i < piece.positions.length; i++)
      positions[offset * 3 + i] =
        (piece.positions[i]! - center.getComponent(i % 3)) * SCALE
    for (const v of piece.indices) indices.push(v + offset)
    offset += piece.positions.length / 3
  }
  const geometry = new BufferGeometry()
    .setAttribute("position", new BufferAttribute(positions, 3))
    .setIndex(indices)
  geometry.computeVertexNormals()
  const color = new Color(colors.get(entry.id)!)
  const material = doc
    .createMaterial(entry.id)
    .setBaseColorFactor([color.r, color.g, color.b, 1])
    .setRoughnessFactor(entry.kind === "bone" ? 0.8 : 0.55)
    .setMetallicFactor(0)
    .setDoubleSided(true)
  const primitive = doc
    .createPrimitive()
    .setAttribute(
      "POSITION",
      doc.createAccessor().setType("VEC3").setArray(positions).setBuffer(buffer)
    )
    .setAttribute(
      "NORMAL",
      doc
        .createAccessor()
        .setType("VEC3")
        .setArray(new Float32Array(geometry.getAttribute("normal").array))
        .setBuffer(buffer)
    )
    .setIndices(
      doc
        .createAccessor()
        .setType("SCALAR")
        .setArray(
          count > 65535 ? new Uint32Array(indices) : new Uint16Array(indices)
        )
        .setBuffer(buffer)
    )
    .setMaterial(material)
  scene.addChild(
    doc
      .createNode(entry.id)
      .setMesh(doc.createMesh(entry.id).addPrimitive(primitive))
      .setExtras({ structureId: entry.id })
  )
  manifest[entry.id] = {
    triangles: indices.length / 3,
    sources: list.map(({ source }) => source),
  }
  totalTriangles += indices.length / 3
  geometry.dispose()
}
// KHR_mesh_quantization stores positions as 16-bit and normals as 8-bit
// integers. three.js's GLTFLoader reads it without a decoder.
await doc.transform(quantize({ quantizePosition: 14, quantizeNormal: 8 }))
const glb = await new NodeIO()
  .registerExtensions([KHRMeshQuantization])
  .writeBinary(doc)
await mkdir(resolve(glbPath, ".."), { recursive: true })
await Bun.write(glbPath, glb)
await Bun.write(
  manifestPath,
  JSON.stringify(
    {
      inputs: inputs.files.map(({ name, path, sha256, bytes }) => ({
        name,
        path,
        sha256,
        bytes,
      })),
      commit: inputs.commit,
      glb: {
        bytes: glb.byteLength,
        sha256: sha(glb),
        triangles: totalTriangles,
        sourceTriangles,
      },
      structures: manifest,
    },
    null,
    2
  ) + "\n"
)

// Named views frame the structures of these groups.
const regions: [string, [number, number, number], string[]][] = [
  ["Head and neck", [-1, 0.1, 0.4], ["Jaw and skull base", "Larynx"]],
  ["Spine", [-0.45, 0, -1], ["Vertebral column"]],
  ["Shoulders", [0, 0.35, 1], ["Shoulder girdle", "Shoulder"]],
  ["Pelvis and hips", [0, 0.1, 1], ["Pelvis", "Hip"]],
  ["Knees", [0, 0, 1], ["Knee"]],
  ["Feet", [0, 0.9, 1], ["Foot"]],
]
const ids = (groups: string[]) =>
  catalog.filter((e) => groups.includes(e.group)).map((e) => e.id)
const structure = (entry: Entry) => ({
  id: entry.id,
  label: entry.label,
  group: entry.group,
  color: colors.get(entry.id),
  description: entry.description,
})
const model = {
  name: "Joints",
  src: "https://organui.com/models/joints.glb",
  bytes: glb.byteLength,
  defaultView: "Anterior",
  views: [
    { name: "Anterior", direction: [0, 0, 1] },
    { name: "Posterior", direction: [0, 0, -1] },
    { name: "Right lateral", direction: [-1, 0, 0] },
    ...regions.map(([name, direction, groups]) => ({
      name,
      direction,
      structureIds: ids(groups),
    })),
  ],
  structures: catalog.map(structure),
  attribution: {
    credit:
      "Z-Anatomy, based in part on BodyParts3D, © The Database Center for Life Science, licensed under CC Attribution-Share Alike 4.0",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    source:
      "https://github.com/organui/organui/blob/master/apps/web/public/models/joints.ATTRIBUTION.md",
  },
}
await Bun.write(
  registryPath,
  `import {
  OrganViewer,
  type OrganModel,
  type OrganViewerProps,
} from "@/components/organ-viewer"

// Generated by scripts/models/joints/prepare.ts from Z-Anatomy. The GLB is
// served from organui.com under its own licence; see attribution.source.
export const jointsModel: OrganModel = ${JSON.stringify(model, null, 2)}

export type JointsProps = Omit<OrganViewerProps, "model">

export function Joints(props: JointsProps) {
  return <OrganViewer model={jointsModel} {...props} />
}
`
)
console.log(
  `${catalog.length} structures, ${totalTriangles} triangles, ${(glb.byteLength / 1e6).toFixed(2)} MB`
)
