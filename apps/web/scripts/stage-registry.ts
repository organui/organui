import { cp, rm } from "node:fs/promises"
// Resolve through the workspace dependency rather than a sibling path.
const source = new URL(
  "./",
  import.meta.resolve("@workspace/registry/dist/registry.json")
)
const target = new URL("../public/r/", import.meta.url)
await rm(target, { recursive: true, force: true })
await cp(source, target, { recursive: true })
