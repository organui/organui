import { cp, rm } from "node:fs/promises"
const target = new URL("../public/r/", import.meta.url)
await rm(target, { recursive: true, force: true })
await cp(new URL("../../../packages/registry/dist/", import.meta.url), target, {
  recursive: true,
})
