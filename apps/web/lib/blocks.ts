import type { ComponentType } from "react"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import Dashboard01 from "@workspace/registry/blocks/dashboard-01/page"
import Explorer01 from "@workspace/registry/blocks/explorer-01/page"
import Explorer02 from "@workspace/registry/blocks/explorer-02/page"
import Explorer03 from "@workspace/registry/blocks/explorer-03/page"

// The page each block installs, rendered alone at /view/<name> for the
// previews on /blocks. A block missing here has no preview, which the browser
// suite catches.
export const blockPages: Record<string, ComponentType> = {
  "explorer-01": Explorer01,
  "explorer-02": Explorer02,
  "explorer-03": Explorer03,
  "dashboard-01": Dashboard01,
}

// Source as shipped: the staged registry JSON the site serves under /r.
export async function blockFiles(name: string) {
  const item = JSON.parse(
    await readFile(join(process.cwd(), "public/r", `${name}.json`), "utf8")
  ) as { files: { path: string; content: string }[] }
  return new Map(item.files.map(({ path, content }) => [path, content]))
}
