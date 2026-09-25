import { registrySchema, registryItemSchema } from "shadcn/schema"
import { mkdir, readFile, writeFile, rm } from "node:fs/promises"
const registry = registrySchema.parse(
  JSON.parse(
    await readFile(new URL("../registry.json", import.meta.url), "utf8")
  )
)
const output = new URL("../dist/", import.meta.url)
await rm(output, { recursive: true, force: true })
await mkdir(output, { recursive: true })
const items = await Promise.all(
  registry.items.map(async (item) => {
    const files = await Promise.all(
      (item.files ?? []).map(async (file) => {
        const content = await readFile(
          new URL(`../${file.path}`, import.meta.url),
          "utf8"
        )
        if (content.includes("@workspace/"))
          throw new Error("Private workspace import in public source")
        return { ...file, content }
      })
    )
    const built = registryItemSchema.parse({ ...item, files })
    await writeFile(
      new URL(`${item.name}.json`, output),
      JSON.stringify(built, null, 2) + "\n"
    )
    return built
  })
)
await writeFile(
  new URL("registry.json", output),
  JSON.stringify({ ...registry, items }, null, 2) + "\n"
)
