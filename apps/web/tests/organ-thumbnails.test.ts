import { expect, test } from "bun:test"
import { createHash } from "node:crypto"
import { readFile } from "node:fs/promises"
import type { OrganModel } from "@workspace/registry/organ-viewer"
import catalog from "@workspace/registry/registry.json"
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
  }
>

const organs = catalog.items
  .filter((item) => "categories" in item && item.categories.includes("organ"))
  .map(({ name }) => name)

// The gallery shows each organ's thumbnail and credits it under the licence
// recorded here, so a changed model needs `bun run thumbnails --only <name>`.
for (const name of organs) {
  test(`${name} has a thumbnail of its current model`, async () => {
    const entry = manifest[name]
    expect(entry).toBeDefined()
    const file = await readFile(
      new URL(`../public${entry!.file}`, import.meta.url)
    )
    expect(createHash("sha256").update(file).digest("hex")).toBe(entry!.sha256)
    const exports = (await import(`@workspace/registry/${name}`)) as Record<
      string,
      OrganModel
    >
    const model = Object.values(exports).find(
      (value) => typeof value === "object" && value !== null && "src" in value
    )!
    expect(entry!.model).toBe(model.src)
    expect(entry!.license).toBe(model.attribution.license)
    expect(entry!.licenseUrl).toBe(model.attribution.licenseUrl)
    expect(entry!.credit).toBe(model.attribution.credit)
  })
}

test("the manifest lists only organs", () => {
  expect(
    Object.keys(manifest).filter((name) => !organs.includes(name))
  ).toEqual([])
})
