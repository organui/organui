import { expect, test } from "bun:test"
import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"
import catalog from "@workspace/registry/registry.json"
import { organModels } from "../lib/organ-models"
import { loadOrganModel } from "../lib/organ-source"
import thumbnails from "../lib/organ-thumbnails.json"

const manifest = thumbnails as Record<
  string,
  {
    file: string
    sha256: string
    model: string
    license: string
    licenseUrl: string
    credit: string
    source: string
  }
>

const organs = catalog.items
  .filter((item) => "categories" in item && item.categories.includes("organ"))
  .map(({ name }) => name)

// The gallery shows each organ's thumbnail and credits it with the licence,
// credit and source recorded here, so a changed model or credit needs
// `bun run thumbnails --only <name>`.
for (const name of organs) {
  test(`${name} has a thumbnail of its current model`, async () => {
    const entry = manifest[name]
    expect(entry).toBeDefined()
    const file = await readFile(
      new URL(`../public${entry!.file}`, import.meta.url)
    )
    expect(createHash("sha256").update(file).digest("hex")).toBe(entry!.sha256)
    const model = await loadOrganModel(name)
    expect(entry!.model).toBe(model.src)
    expect(entry!.license).toBe(model.attribution.license)
    expect(entry!.licenseUrl).toBe(model.attribution.licenseUrl)
    expect(entry!.credit).toBe(model.attribution.credit)
    expect(entry!.source).toBe(model.attribution.source)
    // The pages' loader resolves the same model, at most pointed at this
    // site's copy.
    const page = await organModels[name]!()
    expect(page.attribution).toEqual(model.attribution)
    expect(page.src).toBe(
      model.src.replace("https://organui.com/models/", "/models/")
    )
  })
}

test("the manifest lists only organs", () => {
  expect(
    Object.keys(manifest).filter((name) => !organs.includes(name))
  ).toEqual([])
})
