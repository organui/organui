import { expect, test } from "bun:test"
import { existsSync } from "node:fs"
import catalog from "@workspace/registry/registry.json"
import { organModels } from "../lib/organ-models"
import { loadOrganModel } from "../lib/organ-source"
import thumbnails from "../lib/organ-thumbnails.json"

const rendered = thumbnails as Record<string, string>

// The organs and diseases galleries, each with its pictures' folder.
const pictured = catalog.items.flatMap((item) => {
  const categories: readonly string[] =
    "categories" in item ? item.categories : []
  if (categories.includes("organ"))
    return [{ name: item.name, folder: "organs" }]
  if (categories.includes("disease"))
    return [{ name: item.name, folder: "diseases" }]
  return []
})

// A gallery shows each image with the credit of its current model, so an
// image rendered from an older model would show it under the wrong credit:
// rerun `bun run thumbnails --only <name>`.
for (const { name, folder } of pictured) {
  test(`${name} has a thumbnail of its current model`, async () => {
    expect(
      existsSync(new URL(`../public/${folder}/${name}.webp`, import.meta.url))
    ).toBe(true)
    const model = await loadOrganModel(name)
    expect(rendered[name]).toBe(model.src)
    // The gallery reads credits through the pages' loader, which resolves
    // the same model, at most pointed at this site's copy.
    const page = await organModels[name]!()
    expect(page.attribution).toEqual(model.attribution)
    expect(page.src).toBe(
      model.src.replace("https://organui.com/models/", "/models/")
    )
  })
}

test("only organs and diseases have thumbnails", () => {
  const names = pictured.map(({ name }) => name)
  expect(Object.keys(rendered).filter((name) => !names.includes(name))).toEqual(
    []
  )
})
