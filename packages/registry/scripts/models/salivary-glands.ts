// Builds apps/web/public/models/salivary-glands.glb from pinned Z-Anatomy FBX
// files. Run from packages/registry: bun scripts/models/salivary-glands.ts
import { createHash } from "node:crypto"
import { mkdir } from "node:fs/promises"
import {
  Box3,
  BufferAttribute,
  BufferGeometry,
  Color,
  Mesh,
  type Object3D,
  Vector3,
} from "three"
import { FBXLoader } from "three/addons/loaders/FBXLoader.js"
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js"
import { salivaryGlandsModel } from "../../registry/base-nova/salivary-glands/salivary-glands"

// FBXLoader only touches these globals for texture loading, which these files don't use.
Object.assign(globalThis, { window: globalThis, self: globalThis })

const commit = "6c7f9016bd5899ac8edafd31b9900c151df42ed6"
const files = {
  VisceralSystem100: {
    sha256: "22b301c93327929c9a14ee582d1848b550a950376e221a6d1078c7256bb83d0e",
    bytes: 18401708,
  },
  SkeletalSystem100: {
    sha256: "294a649765cd060a62a4095da52b9c8ef2d97769aa447e196448aa5f7d596dea",
    bytes: 41339660,
  },
}
type SourceFile = keyof typeof files

// Z-Anatomy object each structure is built from.
const sources: Record<string, [SourceFile, string]> = {
  "right-parotid-gland": ["VisceralSystem100", "Parotid_glandr"],
  "left-parotid-gland": ["VisceralSystem100", "Parotid_glandl"],
  "right-accessory-parotid-gland": [
    "VisceralSystem100",
    "(Accessory_parotid_gland)r",
  ],
  "left-accessory-parotid-gland": [
    "VisceralSystem100",
    "(Accessory_parotid_gland)l",
  ],
  "right-parotid-duct": ["VisceralSystem100", "Parotid_ductr"],
  "left-parotid-duct": ["VisceralSystem100", "Parotid_ductl"],
  "right-submandibular-gland": ["VisceralSystem100", "Submandibular_glandr"],
  "left-submandibular-gland": ["VisceralSystem100", "Submandibular_glandl"],
  "right-submandibular-duct": ["VisceralSystem100", "Submandibular_ductr"],
  "left-submandibular-duct": ["VisceralSystem100", "Submandibular_ductl"],
  "right-sublingual-gland": ["VisceralSystem100", "Sublingual_glandr"],
  "left-sublingual-gland": ["VisceralSystem100", "Sublingual_glandl"],
  mandible: ["SkeletalSystem100", "Mandible"],
  tongue: ["VisceralSystem100", "Tongue"],
  "hyoid-bone": ["SkeletalSystem100", "Hyoid_bone"],
}

const sha = (data: Uint8Array) =>
  createHash("sha256").update(data).digest("hex")
const cache = new URL("../../.asset-cache/", import.meta.url)
await mkdir(cache, { recursive: true })
const roots = new Map<SourceFile, Object3D>()
for (const [name, pin] of Object.entries(files) as [
  SourceFile,
  (typeof files)[SourceFile],
][]) {
  const file = Bun.file(new URL(`${name}.fbx`, cache))
  if (!(await file.exists())) {
    console.log(`Downloading ${name}.fbx…`)
    const response = await fetch(
      `https://raw.githubusercontent.com/LluisV/Z-Anatomy/${commit}/Resources/Models/FBX/${name}.fbx`
    )
    if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`)
    await Bun.write(file, response)
  }
  const bytes = new Uint8Array(await file.arrayBuffer())
  if (bytes.length !== pin.bytes || sha(bytes) !== pin.sha256)
    throw new Error(
      `Checksum mismatch: ${name}. Review the upstream change before updating the pin.`
    )
  const root = new FBXLoader().parse(bytes.buffer, "")
  root.updateMatrixWorld(true)
  roots.set(name, root)
}

const prepared = salivaryGlandsModel.structures.map((structure) => {
  const source = sources[structure.id]
  if (!source) throw new Error(`No source for ${structure.id}`)
  const [file, name] = source
  const found: Mesh[] = []
  roots.get(file)!.traverse((object) => {
    if (object instanceof Mesh && object.name === name) found.push(object)
  })
  const [mesh] = found
  if (!mesh || found.length !== 1)
    throw new Error(`${file}: expected one ${name}, found ${found.length}`)
  // Keep positions only, apply the world transform, then weld coincident
  // vertices so normals can be smoothed.
  const raw = new BufferGeometry().setAttribute(
    "position",
    mesh.geometry.getAttribute("position").clone()
  )
  if (mesh.geometry.index) raw.setIndex(mesh.geometry.index.clone())
  raw.applyMatrix4(mesh.matrixWorld)
  const geometry = mergeVertices(raw, 1e-5)
  return { structure, file, name, geometry }
})
if (prepared.length !== Object.keys(sources).length)
  throw new Error("Unused sources")

const bounds = new Box3()
for (const { geometry } of prepared) {
  geometry.computeBoundingBox()
  bounds.union(geometry.boundingBox!)
}
// Source units are centimetres, Y up, +Z anterior and patient right at −X, as
// the viewer expects. Uniform scale only, no anatomical reshaping.
const center = bounds.getCenter(new Vector3())
const scale = 0.25

// A minimal glTF 2.0 binary writer: one node, mesh and material per structure.
const chunks: Uint8Array[] = []
let byteLength = 0
const bufferViews: object[] = []
const accessors: object[] = []
function addAccessor(
  array: Float32Array | Uint32Array,
  type: "VEC3" | "SCALAR",
  target: number
) {
  bufferViews.push({
    buffer: 0,
    byteOffset: byteLength,
    byteLength: array.byteLength,
    target,
  })
  chunks.push(new Uint8Array(array.buffer, array.byteOffset, array.byteLength))
  byteLength += array.byteLength
  const accessor: Record<string, unknown> = {
    bufferView: bufferViews.length - 1,
    componentType: array instanceof Float32Array ? 5126 : 5125,
    count: type === "VEC3" ? array.length / 3 : array.length,
    type,
  }
  if (type === "VEC3") {
    const box = new Box3().setFromArray(array)
    Object.assign(accessor, { min: box.min.toArray(), max: box.max.toArray() })
  }
  accessors.push(accessor)
  return accessors.length - 1
}

const manifest: object[] = []
const nodes = prepared.map(({ structure, file, name, geometry }, index) => {
  const position = geometry.getAttribute("position") as BufferAttribute
  const transformed = new Float32Array(position.count * 3)
  for (let i = 0; i < position.count; i++)
    new Vector3()
      .fromBufferAttribute(position, i)
      .sub(center)
      .multiplyScalar(scale)
      .toArray(transformed, i * 3)
  const shaped = new BufferGeometry()
    .setAttribute("position", new BufferAttribute(transformed, 3))
    .setIndex(geometry.index)
  shaped.computeVertexNormals()
  const indices = new Uint32Array(geometry.index!.array)
  manifest.push({
    structure: structure.id,
    source: `${file}.fbx#${name}`,
    vertices: position.count,
    triangles: indices.length / 3,
  })
  return {
    name: structure.id,
    mesh: index,
    extras: { structureId: structure.id },
    primitive: {
      attributes: {
        POSITION: addAccessor(transformed, "VEC3", 34962),
        NORMAL: addAccessor(
          new Float32Array(shaped.getAttribute("normal").array),
          "VEC3",
          34962
        ),
      },
      indices: addAccessor(indices, "SCALAR", 34963),
      material: index,
    },
  }
})

const json = {
  asset: {
    version: "2.0",
    generator: "OrganUI scripts/models/salivary-glands.ts",
    copyright: salivaryGlandsModel.attribution.credit,
  },
  scene: 0,
  scenes: [
    {
      name: "OrganUI Salivary glands — Z-Anatomy",
      nodes: nodes.map((_, i) => i),
    },
  ],
  nodes: nodes.map(({ name, mesh, extras }) => ({ name, mesh, extras })),
  meshes: nodes.map(({ name, primitive }) => ({
    name,
    primitives: [primitive],
  })),
  materials: salivaryGlandsModel.structures.map(({ id, color }) => {
    const { r, g, b } = new Color(color)
    return {
      name: id,
      pbrMetallicRoughness: {
        baseColorFactor: [r, g, b, 1],
        metallicFactor: 0,
        roughnessFactor: 0.65,
      },
      doubleSided: true,
    }
  }),
  accessors,
  bufferViews,
  buffers: [{ byteLength }],
}

const pad = (length: number) => (4 - (length % 4)) % 4
const jsonBytes = new TextEncoder().encode(JSON.stringify(json))
const jsonLength = jsonBytes.length + pad(jsonBytes.length)
const binLength = byteLength + pad(byteLength)
const glb = new Uint8Array(12 + 8 + jsonLength + 8 + binLength)
const view = new DataView(glb.buffer)
view.setUint32(0, 0x46546c67, true)
view.setUint32(4, 2, true)
view.setUint32(8, glb.length, true)
view.setUint32(12, jsonLength, true)
view.setUint32(16, 0x4e4f534a, true)
glb.fill(0x20, 20, 20 + jsonLength)
glb.set(jsonBytes, 20)
view.setUint32(20 + jsonLength, binLength, true)
view.setUint32(24 + jsonLength, 0x004e4942, true)
let offset = 28 + jsonLength
for (const chunk of chunks) {
  glb.set(chunk, offset)
  offset += chunk.length
}

const out = new URL("../../../../apps/web/public/models/", import.meta.url)
await mkdir(out, { recursive: true })
await Bun.write(new URL("salivary-glands.glb", out), glb)
console.log(`salivary-glands.glb: ${glb.length} bytes, sha256 ${sha(glb)}`)
console.table(manifest)
