import { dirname, resolve } from "node:path"
import { readFile } from "node:fs/promises"

const root = resolve(import.meta.dirname, "..")
const { packageManager } = JSON.parse(
  await readFile(resolve(root, "package.json"), "utf8")
)
if (`bun@${Bun.version}` !== packageManager) {
  throw new Error(`Expected ${packageManager}, received bun@${Bun.version}`)
}
console.log(`Building OrganUI with Bun ${Bun.version}`)
// Turbo invokes child package scripts with `bun`. Keep the pinned executable
// ahead of the build image's preinstalled Bun throughout that process tree.
const child = Bun.spawn(["bun", "run", "build", "--filter=web"], {
  cwd: root,
  env: {
    ...process.env,
    PATH: `${dirname(process.execPath)}:${process.env.PATH}`,
  },
  stdout: "inherit",
  stderr: "inherit",
})
process.exit(await child.exited)
