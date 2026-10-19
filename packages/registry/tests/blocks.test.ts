import { expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { basename } from "node:path"
import packageJson from "../package.json"
import registry from "../registry.json"

const blocks = registry.items.filter((item) => item.type === "registry:block")
const components = registry.items.filter(
  (item) => item.type !== "registry:block"
)
const names = new Set(registry.items.map(({ name }) => name))

// Where the CLI installs a file, as the import path other files use.
function importPath(file: { path: string; type: string; target?: string }) {
  const name = basename(file.path).replace(/\.tsx$/, "")
  return file.type === "registry:ui"
    ? `@/components/ui/${name}`
    : `@/components/${name}`
}

// The item whose own file installs at an import path, such as organ-viewer for
// @/components/organ-viewer.
const owners = new Map(
  components.flatMap((item) =>
    item.files.map((file) => [importPath(file), item.name] as const)
  )
)

test("there are blocks and their names do not clash with components", () => {
  expect(blocks.length).toBeGreaterThan(0)
  const componentNames = new Set(components.map(({ name }) => name))
  for (const { name } of blocks) expect(componentNames.has(name)).toBe(false)
})

// Clinical widgets composed from shadcn primitives install beside them in
// components/ui; three.js scenes, the organs among them, install in components.
test("item types follow whether the item is a three.js scene", async () => {
  for (const item of components) {
    const sources = await Promise.all(
      item.files.map((file) =>
        readFile(new URL(`../${file.path}`, import.meta.url), "utf8")
      )
    )
    const scene = sources.some(
      (source) =>
        source.includes('from "three"') ||
        source.includes('from "@/components/organ-viewer"')
    )
    expect([item.name, item.type]).toEqual([
      item.name,
      scene ? "registry:component" : "registry:ui",
    ])
    for (const file of item.files) expect(file.type).toBe(item.type)
  }
})

// As in shadcn, an item ships only its own files and reaches every other item
// through registryDependencies.
test("no two items ship the same file", () => {
  const paths = registry.items.flatMap(({ files }) =>
    files.map(({ path }) => path)
  )
  expect(new Set(paths).size).toBe(paths.length)
})

for (const item of registry.items) {
  test(`${item.name} ships its own files and lists everything it imports`, async () => {
    const folder =
      item.type === "registry:block"
        ? `registry/base-nova/blocks/${item.name}/`
        : `registry/base-nova/${item.name}/`
    const shipped = new Set<string>()
    for (const file of item.files) {
      expect(file.path).toStartWith(folder)
      if (file.type !== "registry:page") shipped.add(importPath(file))
    }
    const used = new Set<string>()
    for (const file of item.files) {
      const source = await readFile(
        new URL(`../${file.path}`, import.meta.url),
        "utf8"
      )
      for (const [, path] of source.matchAll(/from "(@\/components\/[^"]+)"/g))
        used.add(path!)
      expect(source).not.toMatch(/from "\.\.?\//)
    }
    const dependencies = item.registryDependencies ?? []
    for (const path of used) {
      if (shipped.has(path)) continue
      const owner = owners.get(path)
      if (owner) expect(dependencies).toContain(`@organui/${owner}`)
      // Anything else must be an official shadcn component the item lists.
      else {
        expect(path).toStartWith("@/components/ui/")
        expect(dependencies).toContain(path.replace("@/components/ui/", ""))
      }
    }
    for (const dependency of dependencies) {
      if (!dependency.startsWith("@organui/")) continue
      const name = dependency.replace("@organui/", "")
      expect(names.has(name)).toBe(true)
      expect(used).toContain(
        [...owners].find(([, owner]) => owner === name)![0]
      )
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

// Consumers install the ranges items declare, so each range has to accept the
// version these tests run against. A bump here without the items fails.
test("item dependency ranges accept the versions the registry is tested with", () => {
  const tested: Record<string, string> = packageJson.dependencies
  for (const item of registry.items)
    for (const dependency of item.dependencies ?? []) {
      const at = dependency.lastIndexOf("@")
      const name = dependency.slice(0, at)
      expect(tested[name]).toBeDefined()
      const version = tested[name]!.replace(/^\^/, "")
      expect(
        Bun.semver.satisfies(version, dependency.slice(at + 1)),
        `${item.name}: ${dependency} rejects ${name}@${version}`
      ).toBe(true)
    }
})

for (const block of blocks) {
  test(`${block.name} installs one page and uses every file it ships`, async () => {
    const pages = block.files.filter((file) => file.type === "registry:page")
    expect(pages).toHaveLength(1)
    expect("target" in pages[0]! && pages[0].target).toMatch(
      /^app\/[a-z-]+\/page\.tsx$/
    )
    const sources = await Promise.all(
      block.files.map((file) =>
        readFile(new URL(`../${file.path}`, import.meta.url), "utf8")
      )
    )
    for (const file of block.files)
      if (file.type !== "registry:page")
        expect(
          sources.some((source) => source.includes(`"${importPath(file)}"`))
        ).toBe(true)
  })
}
