import { expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { basename } from "node:path"
import registry from "../registry.json"

const blocks = registry.items.filter((item) => item.type === "registry:block")
const components = registry.items.filter(
  (item) => item.type !== "registry:block"
)

// Where the CLI installs a file, as the import path other files use.
function importPath(file: { path: string; type: string; target?: string }) {
  const name = basename(file.path).replace(/\.tsx$/, "")
  return file.type === "registry:ui"
    ? `@/components/ui/${name}`
    : `@/components/${name}`
}

test("there are blocks and their names do not clash with components", () => {
  expect(blocks.length).toBeGreaterThan(0)
  const names = new Set(components.map(({ name }) => name))
  for (const { name } of blocks) expect(names.has(name)).toBe(false)
})

for (const block of blocks) {
  test(`${block.name} ships one page and every file it imports`, async () => {
    const pages = block.files.filter((file) => file.type === "registry:page")
    expect(pages).toHaveLength(1)
    expect("target" in pages[0]! && pages[0].target).toMatch(
      /^app\/[a-z-]+\/page\.tsx$/
    )
    const shipped = new Set(
      block.files
        .filter((file) => file.type !== "registry:page")
        .map(importPath)
    )
    const used = new Set<string>()
    for (const file of block.files) {
      const source = await readFile(
        new URL(`../${file.path}`, import.meta.url),
        "utf8"
      )
      for (const [, path] of source.matchAll(/from "(@\/components\/[^"]+)"/g))
        used.add(path!)
      // Organ files import the viewer beside them, and both install into the
      // components folder. Other relative imports would break on install.
      for (const [, name] of source.matchAll(/from "\.\/([^"]+)"/g)) {
        expect(file.type).toBe("registry:component")
        used.add(`@/components/${name}`)
      }
      expect(source).not.toMatch(/from "\.\.\//)
    }
    for (const path of used) {
      const shadcn = path.replace("@/components/ui/", "")
      if (shipped.has(path)) continue
      // Anything else must be an official shadcn component the item lists.
      expect(path).toStartWith("@/components/ui/")
      expect(block.registryDependencies).toContain(shadcn)
    }
    // Every shipped file is used, by the page or another shipped file.
    for (const path of shipped) expect(used).toContain(path)
  })

  test(`${block.name} carries the dependencies of the items it reuses`, () => {
    for (const file of block.files) {
      const owner = components.find((item) =>
        item.files.some(({ path }) => path === file.path)
      )
      if (!owner) continue
      for (const dependency of owner.dependencies ?? [])
        expect(block.dependencies).toContain(dependency)
      for (const dependency of owner.registryDependencies ?? [])
        expect(block.registryDependencies).toContain(dependency)
    }
  })
}

// shadcn prints an item's docs after installing it.
test("every item links its documentation after install", () => {
  for (const item of registry.items) {
    const page =
      item.type === "registry:block"
        ? `${item.title}: https://organui.com/blocks#${item.name}`
        : `${item.title} docs: https://organui.com/docs/${item.name}`
    expect(item.docs).toStartWith(page)
  }
})
