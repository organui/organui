// Builds apps/web/public/models/nerves.glb from Z-Anatomy's nervous system
// export. Run `bun install && bun run nerves` in models/.
import { createHash } from "node:crypto"
import { mkdir, readFile } from "node:fs/promises"
import { Document, NodeIO } from "@gltf-transform/core"
import { simplify, weld } from "@gltf-transform/functions"
import { MeshoptSimplifier } from "meshoptimizer"
import { format } from "prettier"
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Mesh,
  type Object3D,
} from "three"
import { FBXLoader } from "three/addons/loaders/FBXLoader.js"
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js"
import inputs from "./inputs.json"

// FBXLoader only touches these globals for texture loading, which this file doesn't use.
Object.assign(globalThis, { window: globalThis, self: globalThis })

const here = new URL("./", import.meta.url)
const output = new URL("../../apps/web/public/models/nerves.glb", here)
const item = new URL(
  "../../packages/registry/registry/base-nova/nerves/nerves.tsx",
  here
)
const cache = new URL("../node_modules/.cache/z-anatomy/", here)
const sha = (data: Uint8Array) =>
  createHash("sha256").update(data).digest("hex")

// Each structure owns the source objects named here, on both sides, and
// every object below them in the Z-Anatomy hierarchy unless a more specific
// structure names it.
const sources: Record<string, string[]> = {
  "olfactory-nerves": ["Olfactory_nerve_(I)"],
  "optic-nerves": ["Optic_nerve_(II)"],
  "oculomotor-nerves": ["Oculomotor_nerve_(III)"],
  "trochlear-nerves": ["Trochlear_nerve_(IV)"],
  "trigeminal-nerves": ["Trigeminal_nerve_(V)"],
  "abducens-nerves": ["Abducens_nerve_(VI)"],
  "facial-nerves": ["Facial_nerve_(VII)"],
  "vestibulocochlear-nerves": ["Vestibulocochlear_nerve_(VIII)"],
  "glossopharyngeal-nerves": ["Glossopharyngeal_nerve_(IX)"],
  "vagus-nerves": ["Vagus_nerve_(X)"],
  "accessory-nerves": ["Accessory_nerve_(XI)"],
  "hypoglossal-nerves": ["Hypoglossal_nerve_(XII)"],
  "spinal-nerve-roots": [
    "Anterior_root_of_spinal_nerve",
    "Posterior_root_of_spinal_nerve",
    "Spinal_ganglion",
  ],
  "cauda-equina": ["Cauda_equina"],
  "intercostal-nerves": ["Intercostal_nerves"],
  "sympathetic-trunks": ["Sympathetic_trunk", "Sympathetic_nerves"],
  "iliohypogastric-ilio-inguinal-nerves": [
    "Iliohypogastric_nerve",
    "Ilio-inguinal_nerve",
  ],
  "brachial-plexus": [
    "Roots_of_brachial_plexus",
    "Superior_trunk_of_brachial_plexus",
    "Middle_trunk_of_brachial_plexus",
    "Inferior_trunk_of_brachial_plexus",
    "Posterior_cord_of_brachial_plexus",
    "Subclavian_nerve",
  ],
  "dorsal-scapular-nerves": ["Dorsal_scapular_nerve"],
  "long-thoracic-nerves": ["Long_thoracic_nerve"],
  "suprascapular-nerves": ["Suprascapular_nerve"],
  "pectoral-nerves": ["Lateral_pectoral_nerve", "Medial_pectoral_nerve"],
  "subscapular-nerves": [
    "Superior_subscapular_nerve",
    "Inferior_subscapular_nerve",
  ],
  "thoracodorsal-nerves": ["Thoracodorsal_nerve"],
  "axillary-nerves": ["Axillary_nerve"],
  "musculocutaneous-nerves": ["Musculocutaneous_nerve"],
  "radial-nerves": ["Radial_nerve"],
  "median-nerves": ["Median_nerve"],
  "ulnar-nerves": ["Ulnar_nerve"],
  "medial-cutaneous-nerves": [
    "Medial_brachial_cutaneous_nerve",
    "Medial_antebrachial_cutaneous_nerve",
  ],
  "femoral-nerves": ["Femoral_nerve"],
  "lateral-femoral-cutaneous-nerves": ["Lateral_femoral_cutaneous_nerve"],
  "obturator-nerves": ["Obturator_nerve"],
  "genitofemoral-nerves": ["Genitofemoral_nerve"],
  "superior-gluteal-nerves": ["Superior_gluteal_nerve"],
  "hip-rotator-nerves": [
    "Nerve_to_piriformis_muscle",
    "Nerve_to_quadratus_femoris_muscle",
  ],
  "posterior-femoral-cutaneous-nerves": [
    "Posterior_femoral_cutaneous_nerve",
    "Anterior_root_of_posterior_femoral_cutaneous_nerve",
    "Posterior_root_of_posterior_femoral_cutaneous_nerve",
  ],
  "pudendal-nerves": ["Pudendal_nerve"],
  "sciatic-nerves": ["Sciatic_nerve"],
  "tibial-nerves": ["Tibial_nerve"],
  "common-fibular-nerves": ["Common_fibular_nerve"],
}

// Structure ids and colours come from the registry item, so the GLB and the
// component cannot drift apart.
const structures = [
  ...(await readFile(item, "utf8")).matchAll(
    /id: "([a-z-]+)",\s+label: "[^"]+",\s+group: "[^"]+",\s+color: "(#[0-9a-f]{6})"/g
  ),
].map(([, id, color]) => ({ id: id!, color: color! }))
const missing = structures.filter(({ id }) => !sources[id])
const extra = Object.keys(sources).filter(
  (id) => !structures.some((structure) => structure.id === id)
)
if (missing.length || extra.length)
  throw new Error(
    `Structures and sources differ: ${[...missing.map(({ id }) => id), ...extra]}`
  )

await mkdir(cache, { recursive: true })
const file = Bun.file(new URL(`${inputs.file.name}.fbx`, cache))
if (!(await file.exists())) {
  console.log(`Downloading ${inputs.file.path}…`)
  const response = await fetch(inputs.file.url)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  await Bun.write(file, response)
}
const bytes = new Uint8Array(await file.arrayBuffer())
if (bytes.length !== inputs.file.bytes || sha(bytes) !== inputs.file.sha256)
  throw new Error(
    "Checksum mismatch. Refusing changed upstream data; review it before updating the pin."
  )
const root = new FBXLoader().parse(bytes.buffer, "")
root.updateMatrixWorld(true)
const peripheral = root.getObjectByName("Peripheral_nervous_systemg")
if (!peripheral) throw new Error("No peripheral nervous system in the source")

const owner = new Map<string, string>()
for (const [id, names] of Object.entries(sources))
  for (const name of names)
    for (const side of ["", "l", "r"]) owner.set(name + side, id)
// Nearest named ancestor wins, so a nerve's branches join it unless they are
// structures of their own.
function ownerOf(object: Object3D) {
  for (let node: Object3D | null = object; node; node = node.parent) {
    const id = owner.get(node.name)
    if (id) return id
  }
}

type Source = { object: string; vertices: number; triangles: number }
const prepared = new Map(
  structures.map((structure) => [
    structure.id,
    {
      structure,
      positions: [] as number[],
      indices: [] as number[],
      objects: [] as Source[],
    },
  ])
)
const labelPins: string[] = []
peripheral.traverse((object) => {
  if (!(object instanceof Mesh)) return
  const id = ownerOf(object)
  if (!id) {
    // Z-Anatomy marks each group with a 4-triangle label pin named "...j".
    if (object.name.endsWith("j")) return void labelPins.push(object.name)
    throw new Error(`No structure owns ${object.name}`)
  }
  const target = prepared.get(id)!
  // Keep positions only, apply the world transform, then weld coincident
  // vertices so normals can be smoothed.
  const source = new BufferGeometry().setAttribute(
    "position",
    object.geometry.getAttribute("position").clone()
  )
  if (object.geometry.index) source.setIndex(object.geometry.index.clone())
  source.applyMatrix4(object.matrixWorld)
  const geometry = mergeVertices(source, 1e-5)
  const p = geometry.getAttribute("position") as BufferAttribute
  const index = Array.from(geometry.index!.array)
  if (!p.count || !index.length) throw new Error(`Empty mesh: ${object.name}`)
  const offset = target.positions.length / 3
  for (let i = 0; i < p.count; i++) {
    const v = [p.getX(i), p.getY(i), p.getZ(i)]
    if (!v.every(Number.isFinite))
      throw new Error(`Invalid vertex: ${object.name}`)
    target.positions.push(...v)
  }
  for (const i of index) target.indices.push(offset + i)
  target.objects.push({
    object: object.name,
    vertices: p.count,
    triangles: index.length / 3,
  })
  source.dispose()
  geometry.dispose()
})
for (const { structure, objects } of prepared.values())
  if (!objects.length) throw new Error(`${structure.id} has no geometry`)

const min = [Infinity, Infinity, Infinity]
const max = [-Infinity, -Infinity, -Infinity]
for (const { positions, indices } of prepared.values())
  for (const v of indices)
    for (let i = 0; i < 3; i++) {
      min[i] = Math.min(min[i]!, positions[v * 3 + i]!)
      max[i] = Math.max(max[i]!, positions[v * 3 + i]!)
    }
const center = min.map((v, i) => (v + max[i]!) / 2)
// Source units are centimetres, Y up, +Z anterior and the patient's left at
// +X, which match the display axes. Uniform scale only, no reshaping.
const scale = 0.04

const doc = new Document()
doc.getRoot().getAsset().copyright =
  "Z-Anatomy (CC BY-SA 4.0), based in part on BodyParts3D, © The Database Center for Life Science (CC BY-SA 2.1 Japan). Adapted by OrganUI."
const scene = doc.createScene("OrganUI Nerves — Z-Anatomy")
const buffer = doc.createBuffer()
for (const { structure, positions, indices } of prepared.values()) {
  const transformed = new Float32Array(positions.length)
  for (let i = 0; i < positions.length; i++)
    transformed[i] = (positions[i]! - center[i % 3]!) * scale
  const color = new Color(structure.color)
  const material = doc
    .createMaterial(structure.id)
    .setBaseColorFactor([color.r, color.g, color.b, 1])
    .setRoughnessFactor(0.65)
    .setMetallicFactor(0)
    .setDoubleSided(true)
  const primitive = doc
    .createPrimitive()
    .setAttribute(
      "POSITION",
      doc
        .createAccessor()
        .setType("VEC3")
        .setArray(transformed)
        .setBuffer(buffer)
    )
    .setIndices(
      doc
        .createAccessor()
        .setType("SCALAR")
        .setArray(new Uint32Array(indices))
        .setBuffer(buffer)
    )
    .setMaterial(material)
  scene.addChild(
    doc
      .createNode(structure.id)
      .setMesh(doc.createMesh(structure.id).addPrimitive(primitive))
      .setExtras({ structureId: structure.id })
  )
}
const sourceTriangles = [...prepared.values()].reduce(
  (n, { indices }) => n + indices.length / 3,
  0
)
await MeshoptSimplifier.ready
// The source tubes are far denser than a whole-body view needs. The error
// bound keeps each nerve's course; open ends stay locked so branches meet.
const simplification = { ratio: 0.15, error: 0.003, lockBorder: true }
await doc.transform(
  weld(),
  simplify({ simplifier: MeshoptSimplifier, ...simplification })
)
// Normals are computed after simplification so they match the final surface.
for (const node of doc.getRoot().listNodes()) {
  const primitive = node.getMesh()!.listPrimitives()[0]!
  const geometry = new BufferGeometry()
    .setAttribute(
      "position",
      new BufferAttribute(primitive.getAttribute("POSITION")!.getArray()!, 3)
    )
    .setIndex(new BufferAttribute(primitive.getIndices()!.getArray()!, 1))
  geometry.computeVertexNormals()
  primitive.setAttribute(
    "NORMAL",
    doc
      .createAccessor()
      .setType("VEC3")
      .setArray(new Float32Array(geometry.getAttribute("normal").array))
      .setBuffer(buffer)
  )
  geometry.dispose()
}
const runtimeTriangles = Object.fromEntries(
  doc
    .getRoot()
    .listNodes()
    .map((node) => [
      node.getName(),
      node.getMesh()!.listPrimitives()[0]!.getIndices()!.getCount() / 3,
    ])
)
const runtime = await new NodeIO().writeBinary(doc)
await mkdir(new URL("./", output), { recursive: true })
await Bun.write(output, runtime)

const manifest = {
  dataset: "Z-Anatomy",
  license: "CC-BY-SA-4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  basedOn: {
    dataset: "BodyParts3D / Anatomography",
    license: "CC-BY-SA-2.1-JP",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en",
  },
  credit: doc.getRoot().getAsset().copyright,
  retrieved: "2026-10-17",
  source: {
    repository: inputs.repository,
    commit: inputs.commit,
    file: inputs.file,
  },
  transform: {
    sourceBoundsCm: { min, max },
    centerCm: center,
    scale,
    axes: "[x, y, z]",
  },
  simplification: { ...simplification, sourceTriangles },
  runtime: {
    file: "nerves.glb",
    bytes: runtime.byteLength,
    sha256: sha(runtime),
  },
  omittedLabelPins: labelPins.length,
  structures: [...prepared.values()].map(({ structure, objects }) => ({
    id: structure.id,
    runtimeTriangles: runtimeTriangles[structure.id],
    objects,
  })),
}
await Bun.write(
  new URL("manifest.json", here),
  await format(JSON.stringify(manifest), { parser: "json" })
)
console.log(
  `Prepared ${structures.length} structures from ${manifest.structures.reduce((n, s) => n + s.objects.length, 0)} source objects, ${sourceTriangles} → ${Object.values(runtimeTriangles).reduce((a, b) => a + b, 0)} triangles, ${runtime.byteLength} bytes. SHA-256 ${manifest.runtime.sha256}`
)
