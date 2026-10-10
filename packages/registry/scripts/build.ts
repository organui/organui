import { registrySchema, registryItemSchema } from "shadcn/schema"
import { readdir, readFile, rm } from "node:fs/promises"
const output = new URL("../dist/", import.meta.url)
// shadcn build does not clear its output, so removed items would linger.
await rm(output, { recursive: true, force: true })
const build = Bun.spawn(
  ["shadcn", "build", "registry.json", "--output", "dist"],
  {
    cwd: new URL("../", import.meta.url).pathname,
    stdio: ["ignore", "inherit", "inherit"],
  }
)
if ((await build.exited) !== 0) throw new Error("shadcn build failed")
const registry = registrySchema.parse(
  JSON.parse(await readFile(new URL("registry.json", output), "utf8"))
)
const expected = [
  "registry.json",
  ...registry.items.map((item) => `${item.name}.json`),
]
const written = await readdir(output)
if (written.sort().join() !== expected.sort().join())
  throw new Error(`Unexpected registry output: ${written.join(", ")}`)
for (const { name } of registry.items) {
  const item = registryItemSchema.parse(
    JSON.parse(await readFile(new URL(`${name}.json`, output), "utf8"))
  )
  for (const file of item.files ?? []) {
    if (!file.content) throw new Error(`${name}: ${file.path} has no content`)
    if (file.content.includes("@workspace/"))
      throw new Error(`${name}: private workspace import in ${file.path}`)
  }
}
