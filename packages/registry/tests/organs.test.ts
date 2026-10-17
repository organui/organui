import { expect, test } from "bun:test"
import { readdir } from "node:fs/promises"
import registry from "../registry.json"
import {
  organAnatomyNodes,
  organDefaultVisibility,
  type OrganModel,
} from "../registry/base-nova/organ-viewer/organ-viewer"

const directory = new URL(
  "../registry/base-nova/organ-viewer/",
  import.meta.url
)
const organItems = registry.items.filter(
  (item) => "categories" in item && item.categories?.includes("organ")
)

test("every organ file has exactly one registry item with the shared viewer", async () => {
  const files = (await readdir(directory))
    .filter((file) => file !== "organ-viewer.tsx")
    .sort()
  expect(organItems.map(({ name }) => `${name}.tsx`).sort()).toEqual(files)
  for (const item of organItems)
    expect(item.files.map(({ path }) => path)).toEqual([
      "registry/base-nova/organ-viewer/organ-viewer.tsx",
      `registry/base-nova/organ-viewer/${item.name}.tsx`,
    ])
})

// A model built in this repository must be committed, match the size the
// item declares and name one node after each structure.
async function expectLocalModel(file: string, model: OrganModel) {
  const glb = await Bun.file(
    new URL(`../../../apps/web/public/models/${file}`, import.meta.url)
  ).arrayBuffer()
  expect(glb.byteLength).toBe(model.bytes!)
  const view = new DataView(glb)
  expect(view.getUint32(0, true)).toBe(0x46546c67)
  const json = JSON.parse(
    new TextDecoder().decode(new Uint8Array(glb, 20, view.getUint32(12, true)))
  ) as { nodes: { name: string }[] }
  expect(json.nodes.map(({ name }) => name).sort()).toEqual(
    model.structures.map(({ id }) => id).sort()
  )
}

for (const item of organItems) {
  test(`${item.name} describes a consistent, attributed model`, async () => {
    const module = await import(new URL(`${item.name}.tsx`, directory).href)
    const model = Object.values(module).find(
      (value) => typeof value === "object"
    ) as OrganModel
    const ids = model.structures.map(({ id }) => id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const { color, label, group } of model.structures) {
      expect(color).toMatch(/^#[0-9a-f]{6}$/i)
      expect(label.length && group.length).toBeGreaterThan(0)
    }
    expect(model.views.map(({ name }) => name)).toContain(model.defaultView)
    for (const view of model.views) {
      expect(Math.hypot(...view.direction)).toBeGreaterThan(0)
      for (const id of view.structureIds ?? []) expect(ids).toContain(id)
    }
    for (const id of model.hiddenIds ?? []) expect(ids).toContain(id)
    // Models stay in their explorer repositories, pinned to a full commit,
    // or are built here and served by the website (see models/).
    const local = model.src.match(
      /^https:\/\/organui\.com\/models\/([a-z-]+\.glb)$/
    )
    if (local) await expectLocalModel(local[1]!, model)
    else
      expect(model.src).toMatch(
        /^https:\/\/cdn\.jsdelivr\.net\/gh\/organui\/[a-z-]+-3d@[0-9a-f]{40}\/public\/models\/[a-z-]+\.glb$/
      )
    expect(model.attribution.source).toStartWith("https://github.com/organui/")
    expect(model.attribution.licenseUrl).toStartWith("https://")
    expect(item.description).toContain(model.attribution.license)
    const nodes = organAnatomyNodes(model)
    expect(
      nodes.flatMap(({ children }) => children.map(({ id }) => id)).sort()
    ).toEqual([...ids].sort())
    expect(Object.keys(organDefaultVisibility(model))).toEqual([
      ...(model.hiddenIds ?? []),
    ])
  })
}
