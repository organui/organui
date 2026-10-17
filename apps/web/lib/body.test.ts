import { describe, expect, test } from "bun:test"
import catalog from "@workspace/registry/registry.json"
import { bodyLayers, bodyModel, bodyPlaces } from "./body"

const models = new URL("../public/models/", import.meta.url)

// Node names of a GLB, read from its JSON chunk.
async function nodeNames(file: URL) {
  const bytes = new Uint8Array(await Bun.file(file).arrayBuffer())
  const view = new DataView(bytes.buffer)
  const length = view.getUint32(12, true)
  const json = JSON.parse(
    new TextDecoder().decode(bytes.subarray(20, 20 + length))
  ) as { nodes: { name: string; children?: number[]; mesh?: number }[] }
  return json.nodes
}

describe("homepage body model", () => {
  const organs = catalog.items
    .filter(
      (item) => "categories" in item && item.categories?.includes("organ")
    )
    .map(({ name }) => name)

  test("places every organ component on the body", () => {
    expect(Object.keys(bodyPlaces).sort()).toEqual([...organs].sort())
    for (const { id } of bodyModel.structures) expect(organs).toContain(id)
  })

  test("the GLB holds every structure and frame target", async () => {
    const file = new URL("body.glb", models)
    expect(Bun.file(file).size).toBe(bodyModel.bytes!)
    const nodes = await nodeNames(file)
    const names = new Set(nodes.map(({ name }) => name))
    for (const { id } of bodyModel.structures) {
      const node = nodes.find(({ name }) => name === id)
      expect(node?.children?.length).toBeGreaterThan(0)
    }
    // A frame on a hidden layer must show it, or the camera glides to
    // nothing.
    const owner = (id: string) =>
      nodes.find(({ children }) =>
        children?.some((child) => nodes[child]!.name === id)
      )?.name ?? id
    for (const place of Object.values(bodyPlaces))
      for (const id of place.frame ?? []) {
        expect(names).toContain(id)
        const layer = owner(id)
        if ((bodyLayers as readonly string[]).includes(layer))
          expect(place.show ?? []).toContain(layer)
      }
  })

  test("credits the model", async () => {
    const attribution = await Bun.file(
      new URL("body.ATTRIBUTION.md", models)
    ).text()
    expect(attribution).toContain("CC BY-SA 2.1 Japan")
    expect(bodyModel.attribution.source).toEndWith(
      "apps/web/public/models/body.ATTRIBUTION.md"
    )
  })
})
