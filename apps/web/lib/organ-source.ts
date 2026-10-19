import type { OrganModel } from "@workspace/registry/organ-viewer"

// An organ's model as its registry item ships it, before organ-models.ts
// points hosted models at this site. For the thumbnail script and its test,
// which run in Bun; pages load models through organ-models.ts, which lists
// each import so bundles split per organ.
export async function loadOrganModel(name: string) {
  // Each organ module exports `<camelName>Model`, such as spinalCordModel.
  const key = `${name.replace(/-(\w)/g, (_, letter: string) => letter.toUpperCase())}Model`
  const exports = (await import(`@workspace/registry/${name}`)) as Record<
    string,
    OrganModel | undefined
  >
  const model = exports[key]
  if (!model) throw new Error(`${name} does not export ${key}`)
  return model
}
