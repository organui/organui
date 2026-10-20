import { expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import { Glob } from "bun"
import { iconLibraries } from "../../ui/src/components/icon-placeholder.js"

// shadcn add replaces each IconPlaceholder with the icon named for the
// installing project's iconLibrary, so every name must exist in its library.
const exports = {
  lucide: await import("lucide-react"),
  tabler: await import("@tabler/icons-react"),
  hugeicons: await import("@hugeicons/core-free-icons"),
  phosphor: await import("@phosphor-icons/react"),
  remixicon: await import("@remixicon/react"),
} as Record<(typeof iconLibraries)[number], Record<string, unknown>>

const placeholders: { file: string; names: Record<string, string> }[] = []
for await (const file of new Glob("registry/**/*.tsx").scan(
  new URL("..", import.meta.url).pathname
)) {
  const source = await readFile(new URL(`../${file}`, import.meta.url), "utf8")
  for (const [element] of source.matchAll(/<IconPlaceholder\b[\s\S]*?\/>/g))
    placeholders.push({
      file,
      names: Object.fromEntries(
        [...element.matchAll(/(\w+)="([^"]+)"/g)].map(([, key, value]) => [
          key,
          value,
        ])
      ),
    })
  if (source.includes("<IconPlaceholder"))
    expect(source).toContain(
      'import { IconPlaceholder } from "@/icons/icon-placeholder"'
    )
}

test("items draw their icons through IconPlaceholder", () => {
  expect(placeholders.length).toBeGreaterThan(20)
})

for (const library of iconLibraries)
  test(`every placeholder names a ${library} icon that exists`, () => {
    for (const { file, names } of placeholders) {
      const name = names[library]
      expect(name, `${file} has no ${library} icon`).toBeString()
      expect(exports[library], `${file}: ${name}`).toHaveProperty(name!)
    }
  })
