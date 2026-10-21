import { cache } from "react"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { installedPath } from "@/lib/registry"

type RegistryItemJson = {
  dependencies?: string[]
  registryDependencies?: string[]
  files: { path: string; type: string; target?: string; content: string }[]
}

// An item as the CLI receives it: the staged JSON the site serves under /r.
export const readRegistryItem = cache(async (name: string) => {
  const item = JSON.parse(
    await readFile(join(process.cwd(), "public/r", `${name}.json`), "utf8")
  ) as RegistryItemJson
  return {
    // Package names without their ranges, as a reader would type them.
    dependencies: (item.dependencies ?? []).map((dependency) =>
      dependency.replace(/(?<=.)@[^@]*$/, "")
    ),
    registryDependencies: item.registryDependencies ?? [],
    files: item.files.map((file) => ({
      installed: installedPath(file),
      content: file.content,
    })),
  }
})
