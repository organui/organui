import { expect, test } from "bun:test"
import { readFile, readdir } from "node:fs/promises"
import registry from "../registry.json"
import {
  organAnatomyNodes,
  organDefaultVisibility,
  type OrganModel,
} from "../registry/base-nova/organ-viewer/organ-viewer"
import {
  AFFECTED,
  diseaseModel,
  SPARED,
  type Disease,
} from "../registry/base-nova/disease-viewer/disease-model"
import { DiseaseViewer } from "../registry/base-nova/disease-viewer/disease-viewer"

const directory = new URL("../registry/base-nova/", import.meta.url)
// Items built on the shared viewer: the organs, tissues, the diseases drawn
// on them, and the cell.
const organItems = registry.items.filter(
  (item) =>
    "categories" in item &&
    ["organ", "tissue", "disease", "cell"].some((category) =>
      item.categories?.includes(category)
    )
)
const diseaseItems = organItems.filter(({ categories }) =>
  categories?.includes("disease")
)

// Like shadcn's charts on `chart`, each organ ships only its own file and
// depends on the shared viewer item.
test("every organ file has exactly one registry item that depends on the viewer", async () => {
  const folders = await readdir(directory)
  expect(
    organItems.filter(({ categories }) => categories?.includes("organ"))
  ).toHaveLength(42)
  expect(
    organItems.filter(({ categories }) => categories?.includes("cell"))
  ).toHaveLength(1)
  for (const item of organItems) {
    if (diseaseItems.includes(item)) continue
    expect(folders).toContain(item.name)
    expect(item.type).toBe("registry:component")
    expect(item.files.map(({ path }) => path)).toEqual([
      `registry/base-nova/${item.name}/${item.name}.tsx`,
    ])
    expect(item.registryDependencies).toEqual(["@organui/organ-viewer"])
  }
})

// Each item exports its model as `<camelName>Model`, such as spinalCordModel.
const camel = (name: string) =>
  name.replace(/-(\w)/g, (_, letter: string) => letter.toUpperCase())
async function load(name: string) {
  const module = (await import(
    new URL(`${name}/${name}.tsx`, directory).href
  )) as Record<string, unknown>
  // Every model the file exports, the item's own one first.
  const models = Object.entries(module)
    .filter(([, value]) => typeof value === "object" && value !== null)
    .sort(([a], [b]) =>
      a === `${camel(name)}Model` ? -1 : b === `${camel(name)}Model` ? 1 : 0
    )
    .map(([, value]) => value as OrganModel)
  return { module, model: models[0]!, models }
}

// A disease is data on the shared disease viewer: one scale per organ or
// tissue it is drawn on, which it depends on and reuses the model of, and
// stages that change which structures it affects.
for (const item of diseaseItems) {
  test(`${item.name} maps its disease onto its bases' models`, async () => {
    expect(item.type).toBe("registry:component")
    expect(item.files.map(({ path }) => path)).toEqual([
      `registry/base-nova/${item.name}/${item.name}.tsx`,
    ])
    expect(item.registryDependencies).toContain("@organui/disease-viewer")
    const bases = item.registryDependencies
      .filter((name) => name !== "@organui/disease-viewer")
      .map((name) => name.replace("@organui/", ""))
    const { module } = await load(item.name)
    const disease = module[camel(item.name)] as Disease
    expect(disease.code).toMatch(/^[A-Z]\d{2}(\.\d{1,3})?$/)
    // Each scale is one base, in the order the item lists them.
    expect([...disease.scales.map(({ id }) => id)].sort()).toEqual(
      [...bases].sort()
    )
    for (const [index, scale] of disease.scales.entries()) {
      const baseItem = registry.items.find(({ name }) => name === scale.id)
      // Drawn on an organ, or on a tissue for what happens at that scale.
      const [kind] = baseItem!.categories
      expect(["organ", "tissue"]).toContain(kind!)
      // The disease sits in the body system of its default scale; another
      // scale may be another system's organ, such as the eye in Graves'.
      if (index === 0)
        expect(
          item.categories.filter((category) => category !== "disease")
        ).toEqual(baseItem!.categories.filter((category) => category !== kind))
      expect(scale.model).toBe((await load(scale.id)).model)
    }
    // Every finding names a structure of its scale's model.
    const stages = disease.stages ?? []
    expect(new Set(stages.map(({ id }) => id)).size).toBe(stages.length)
    for (const [scaleId, findings] of [
      ...disease.scales.map(({ id, findings }) => [id, findings] as const),
      ...stages.flatMap(({ findings = {} }) => Object.entries(findings)),
    ]) {
      const scale = disease.scales.find(({ id }) => id === scaleId)
      expect(scale).toBeDefined()
      const ids = scale!.model.structures.map(({ id }) => id)
      for (const id of Object.keys(findings)) expect(ids).toContain(id)
    }
    for (const scale of disease.scales)
      for (const stage of stages.length ? stages : [undefined]) {
        const model = diseaseModel(disease, scale.id, stage?.id)
        const base = scale.model
        // The same GLB, views and credit; only the structures' text and
        // colours change, so every mesh id still matches the file.
        const { structures, name, defaultView, ...shared } = model
        const {
          structures: baseStructures,
          name: baseName,
          defaultView: baseView,
          ...same
        } = base
        expect(shared).toEqual(same)
        // A scale can open on another of the model's own views.
        expect(defaultView).toBe(scale.defaultView ?? baseView)
        expect(base.views.map(({ name }) => name)).toContain(defaultView)
        expect(name).toBe(disease.name)
        expect(name).not.toBe(baseName)
        expect(structures.map(({ id }) => id).sort()).toEqual(
          baseStructures.map(({ id }) => id).sort()
        )
        // The anatomy tree lists groups in structure order: affected first.
        const groups = new Set(structures.map(({ group }) => group))
        expect([...groups]).toEqual(["Affected", "Spared"])
        for (const structure of structures) {
          expect(structure.description?.length).toBeGreaterThan(0)
          // Affected parts share the amber and spared ones the muted tone.
          expect(structure.color).toBe(
            structure.group === "Affected" ? AFFECTED : SPARED
          )
        }
      }
    // The model export is the default scale at the default stage, which the
    // site's loaders and the gallery picture use.
    expect(module[`${camel(item.name)}Model`]).toEqual(diseaseModel(disease))
    const Component = module[
      camel(item.name).replace(/^\w/, (letter) => letter.toUpperCase())
    ] as (props: object) => { type: unknown; props: object }
    const element = Component({ panel: false })
    expect(element.type).toBe(DiseaseViewer)
    expect(element.props).toEqual({ disease, panel: false })
  })
}

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
    const { model } = await load(item.name)
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
    if (diseaseItems.includes(item)) continue
    const name = item.name
      .split("-")
      .map((word) => word[0]!.toUpperCase() + word.slice(1))
      .join("")
    const { module, model } = await load(item.name)
    const Component = module[name] as (props: object) => {
      type: unknown
      props: Record<string, unknown>
    }
    expect(typeof Component).toBe("function")
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
  // Organs register their demos in _organs.tsx, diseases in _diseases.tsx,
  // the cell in _examples.tsx.
  const definitions = [
    await readFile(new URL("_organs.tsx", examples), "utf8"),
    await readFile(new URL("_diseases.tsx", examples), "utf8"),
    await readFile(new URL("_examples.tsx", examples), "utf8"),
  ].join("\n")
  for (const item of organItems) {
    const component = item.name
      .split("-")
      .map((word) => word[0]!.toUpperCase() + word.slice(1))
      .join("")
    const suffixes = diseaseItems.includes(item)
      ? ["demo", "without-panel", "controlled"]
      : ["demo", "without-controls", "controlled", "with-anatomy"]
    for (const suffix of suffixes) {
      const name = `${item.name}-${suffix}`
      expect(definitions).toContain(`"${name}":`)
      expect(definitions).toContain(`import("./${name}")`)
      const source = await readFile(new URL(`${name}.tsx`, examples), "utf8")
      expect(source).toContain(`from "@workspace/registry/${item.name}"`)
      expect(source).toContain(`<${component}`)
      expect(source).not.toContain("<OrganViewer")
      expect(source).not.toContain("<DiseaseViewer")
      expect(source).not.toContain("{ model }")
    }
  }
})
