import { expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import registry from "../registry.json"

// Base UI API that Radix's components don't take: render props, Select's
// items, Dialog's focus targets and Base UI imports.
const baseOnly =
  /render=\{|\bitems=\{|initialFocus=|finalFocus=|@base-ui\/react/

const files = registry.items.flatMap((item) =>
  item.files.map(({ path }) => path)
)
const read = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8")
const radixCopy = (path: string) =>
  path.replace("registry/base-nova/", "registry/radix-nova/")
const hasRadixCopy = (path: string) =>
  Bun.file(new URL(`../${radixCopy(path)}`, import.meta.url)).exists()

// Exported names and imported modules, which a copy must keep in step.
function surface(source: string) {
  return {
    exports: [
      ...source.matchAll(/^export (?:async )?(?:function|const|type) (\w+)/gm),
    ]
      .map((match) => match[1]!)
      .sort(),
    imports: [...source.matchAll(/^import [^"]*"([^"]+)"/gm)]
      .map((match) => match[1]!)
      .filter((module) => !module.startsWith("@base-ui/react"))
      .sort(),
  }
}

test("files that use Base UI's own API have a Radix copy", async () => {
  for (const path of files) {
    if (baseOnly.test(await read(path)))
      expect(await hasRadixCopy(path), path).toBe(true)
  }
})

test("Radix copies use only API Radix's components take", async () => {
  for (const path of files)
    if (await hasRadixCopy(path))
      expect(baseOnly.test(await read(radixCopy(path))), path).toBe(false)
})

test("Radix copies keep the exports and imports of their Base UI file", async () => {
  for (const path of files)
    if (await hasRadixCopy(path))
      expect(surface(await read(radixCopy(path))), path).toEqual(
        surface(await read(path))
      )
})

test("every Radix copy belongs to a registry file", async () => {
  const glob = new Bun.Glob("registry/radix-nova/**/*.{ts,tsx}")
  const known = new Set(files.map(radixCopy))
  for await (const path of glob.scan(new URL("..", import.meta.url).pathname))
    expect(known.has(path), path).toBe(true)
})
