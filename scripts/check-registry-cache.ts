import { readFile, writeFile, rm } from "node:fs/promises"
import { resolve } from "node:path"
import assert from "node:assert/strict"
const root = resolve(import.meta.dirname, "..")
const source = resolve(root, "packages/registry/src/anatomy-tree.tsx")
const dist = resolve(root, "packages/registry/dist")
const staged = resolve(root, "apps/web/public/r")
async function turbo(args: string[]) {
  const process = Bun.spawn(
    ["bun", "x", "turbo", ...args, "--cache-dir=.turbo/registry-check"],
    { cwd: root, stdout: "pipe", stderr: "inherit" }
  )
  const output = await new Response(process.stdout).text()
  assert.equal(await process.exited, 0, output)
  return output
}
const stage = () => turbo(["run", "stage-registry", "--filter=web"])
const hashes = async () =>
  JSON.parse(await turbo(["run", "build", "--filter=web", "--dry=json"]))
    .tasks as { taskId: string; hash: string }[]
const original = await readFile(source, "utf8")
await stage()
const before = await hashes()
const artifact = await readFile(resolve(dist, "anatomy-tree.json"), "utf8")
assert.equal(
  await readFile(resolve(staged, "anatomy-tree.json"), "utf8"),
  artifact
)
await rm(dist, { recursive: true })
await rm(staged, { recursive: true })
const restoration = await stage()
assert.match(restoration, /2 cached/)
assert.equal(
  await readFile(resolve(dist, "anatomy-tree.json"), "utf8"),
  artifact
)
assert.equal(
  await readFile(resolve(staged, "anatomy-tree.json"), "utf8"),
  artifact
)
try {
  await writeFile(source, original + "\n// Registry cache invalidation probe\n")
  const after = await hashes()
  for (const id of [
    "@workspace/registry#build",
    "web#stage-registry",
    "web#build",
  ]) {
    assert.notEqual(
      before.find((t) => t.taskId === id)?.hash,
      after.find((t) => t.taskId === id)?.hash,
      `${id} did not invalidate`
    )
  }
  await stage()
  assert.match(
    await readFile(resolve(staged, "anatomy-tree.json"), "utf8"),
    /Registry cache invalidation probe/
  )
} finally {
  await writeFile(source, original)
  await stage()
}
assert.equal(
  await readFile(resolve(staged, "anatomy-tree.json"), "utf8"),
  artifact
)
console.log(
  "Registry and website output restoration, source invalidation and staged content passed."
)
