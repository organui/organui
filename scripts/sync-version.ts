// The root package.json carries the release version too; keep it equal to
// the registry's after `changeset version` bumps it.
import { readFile, writeFile } from "node:fs/promises"

const root = new URL("../package.json", import.meta.url)
const registry = JSON.parse(
  await readFile(
    new URL("../packages/registry/package.json", import.meta.url),
    "utf8"
  )
) as { version: string }
const text = await readFile(root, "utf8")
await writeFile(
  root,
  text.replace(/"version": "[^"]+"/, `"version": "${registry.version}"`)
)
