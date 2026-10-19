import { expect, test } from "bun:test"
import { readFile, readdir } from "node:fs/promises"
import registry from "../registry.json"
import {
  organAnatomyNodes,
  organDefaultVisibility,
  type OrganModel,
} from "../registry/base-nova/organ-viewer/organ-viewer"

const directory = new URL("../registry/base-nova/", import.meta.url)
const organItems = registry.items.filter(
  (item) => "categories" in item && item.categories?.includes("organ")
)

// Like shadcn's charts on `chart`, each organ ships only its own file and
// depends on the shared viewer item.
test("every organ file has exactly one registry item that depends on the viewer", async () => {
  const folders = await readdir(directory)
  expect(organItems).toHaveLength(42)
  for (const item of organItems) {
    expect(folders).toContain(item.name)
    expect(item.type).toBe("registry:component")
    expect(item.files.map(({ path }) => path)).toEqual([
      `registry/base-nova/${item.name}/${item.name}.tsx`,
    ])
    expect(item.registryDependencies).toEqual(["@organui/organ-viewer"])
  }
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
    const module = await import(
      new URL(`${item.name}/${item.name}.tsx`, directory).href
    )
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
    // The CLI prints docs after install, so the licence reaches every user.
    expect(item.docs).toContain(model.attribution.license)
    expect(item.docs).toContain(model.attribution.licenseUrl)
    const nodes = organAnatomyNodes(model)
    expect(
      nodes.flatMap(({ children }) => children.map(({ id }) => id)).sort()
    ).toEqual([...ids].sort())
    expect(Object.keys(organDefaultVisibility(model))).toEqual([
      ...(model.hiddenIds ?? []),
    ])
  })
}

// Exercise the public wrappers: every export binds its own model while forwarding
// the consumer's callbacks, ref, source, controls and visibility to the renderer.
test("all organ public components preserve their model and consumer props", async () => {
  const { OrganViewer } =
    await import("../registry/base-nova/organ-viewer/organ-viewer")
  for (const item of organItems) {
    const name = item.name
      .split("-")
      .map((word) => word[0]!.toUpperCase() + word.slice(1))
      .join("")
    const module = await import(
      new URL(`${item.name}/${item.name}.tsx`, directory).href
    )
    const Component = module[name]
    expect(typeof Component).toBe("function")
    const model = Object.values(module).find(
      (value) => typeof value === "object"
    )
    const props = {
      controls: false,
      src: "/custom.glb",
      selectedId: "example",
      visibility: { example: false },
      onSelectionChange: () => {},
      ref: { current: null },
      className: "h-96",
    }
    const element = Component(props)
    expect(element.type).toBe(OrganViewer)
    expect(element.props).toEqual({ model, ...props })
    expect(Component({}).props.controls).toBeUndefined()
  }
})

test("each organ has public-component demos and a concrete example registry entry", async () => {
  const examples = new URL("../../../apps/web/examples/", import.meta.url)
  const definitions = await readFile(new URL("_organs.tsx", examples), "utf8")
  for (const item of organItems) {
    const component = item.name
      .split("-")
      .map((word) => word[0]!.toUpperCase() + word.slice(1))
      .join("")
    for (const suffix of [
      "demo",
      "without-controls",
      "controlled",
      "with-anatomy",
    ]) {
      const name = `${item.name}-${suffix}`
      expect(definitions).toContain(`"${name}":`)
      expect(definitions).toContain(`import("./${name}")`)
      const source = await readFile(new URL(`${name}.tsx`, examples), "utf8")
      expect(source).toContain(`from "@workspace/registry/${item.name}"`)
      expect(source).toContain(`<${component}`)
      expect(source).not.toContain("<OrganViewer")
      expect(source).not.toContain("{ model }")
    }
  }
})
