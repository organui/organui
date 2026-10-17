// BodyParts3D 4.3 meshes from a pinned GitHub mirror, shared by build.ts and
// body.ts.
import { createHash } from "node:crypto"
import { mkdir } from "node:fs/promises"

export const MIRROR = "olivercase/body_parts_3d_api"
export const COMMIT = "fd527e6f4daf732fd814314d9257df5877b844bc"
export const MAPPING = {
  url: `https://raw.githubusercontent.com/${MIRROR}/${COMMIT}/metadata/FMA2Obj.txt`,
  sha256: "a199eb9cb258266768b7690f4ac2591f67d4b146c95e14046c46091c35c09385",
}
// Millimetres to display units, with no anatomical reshaping.
export const SCALE = 0.025
export const CREDIT =
  "BodyParts3D / Anatomography, © The Database Center for Life Science. CC BY-SA 2.1 Japan. Adapted by OrganUI."

export type Source = { element: string; file: string; sha256: string }

export const root = new URL("../../", import.meta.url)
export const cache = new URL("node_modules/.cache/organ-models/", root)
export const sha = (bytes: Uint8Array) =>
  createHash("sha256").update(bytes).digest("hex")

export async function fetchPinned(name: string, url: string, sum: string) {
  const file = Bun.file(new URL(name, cache))
  let bytes: Uint8Array
  if (await file.exists()) bytes = new Uint8Array(await file.arrayBuffer())
  else {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`)
    bytes = new Uint8Array(await response.arrayBuffer())
  }
  if (sha(bytes) !== sum)
    throw new Error(`Checksum mismatch for ${name}; review upstream first`)
  await Bun.write(file, bytes)
  return new TextDecoder().decode(bytes)
}

await mkdir(cache, { recursive: true })
export const mapping = new Map<string, Set<string>>()
for (const line of (
  await fetchPinned("FMA2Obj.txt", MAPPING.url, MAPPING.sha256)
).split(/\r\n?|\n/)) {
  const [concept, , elements] = line.split("\t")
  if (!concept?.startsWith("FMA") || !elements) continue
  const set = mapping.get(concept) ?? new Set()
  for (const element of elements.split("+")) set.add(element)
  mapping.set(concept, set)
}

export function parse(text: string, source: Source) {
  const header = (name: string) =>
    text.match(new RegExp(`^# ${name} : (.+)$`, "m"))?.[1]?.trim()
  const concept = header("Concept ID")
  if (
    header("Compatibility version") !== "4.3" ||
    header("File ID") !== source.element ||
    !concept ||
    !mapping.get(concept)?.has(source.element)
  )
    throw new Error(`${source.file} does not match the official mapping`)
  const positions: number[] = []
  const indices: number[] = []
  for (const line of text.split(/\r\n?|\n/)) {
    const [kind, ...tokens] = line.trim().split(/\s+/)
    if (kind === "v") positions.push(...tokens.slice(0, 3).map(Number))
    else if (kind === "f") {
      const face = tokens.map((token) => Number(token.split("/")[0]) - 1)
      for (let i = 1; i < face.length - 1; i++)
        indices.push(face[0]!, face[i]!, face[i + 1]!)
    }
  }
  if (!positions.length || !indices.length || !positions.every(Number.isFinite))
    throw new Error(`${source.file} has no usable geometry`)
  return { concept, name: header("English name")!, positions, indices }
}
