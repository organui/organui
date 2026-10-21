// Publishes the GitHub release for the registry's version, once, with its
// notes from the changelog. The Changesets workflow runs it on master after
// a version pull request merges; nothing is published to npm.
//
//   bun run release
import { readFile } from "node:fs/promises"

const { version } = JSON.parse(
  await readFile(
    new URL("../packages/registry/package.json", import.meta.url),
    "utf8"
  )
) as { version: string }
const tag = `v${version}`

const exists = Bun.spawnSync(["gh", "release", "view", tag], {
  stdout: "ignore",
  stderr: "ignore",
})
if (exists.exitCode === 0) {
  console.log(`${tag} is already released.`)
  process.exit(0)
}

// The changelog's section for this version: from its heading to the next.
const changelog = await readFile(
  new URL("../packages/registry/CHANGELOG.md", import.meta.url),
  "utf8"
)
const sections = changelog.split(/^## /m)
const section = sections.find((part) => part.startsWith(`${version}\n`))
if (!section) throw new Error(`No ${version} section in the changelog`)
const notes = section.slice(version.length).trim()

const release = Bun.spawnSync(
  [
    "gh",
    "release",
    "create",
    tag,
    "--title",
    tag,
    "--target",
    process.env.GITHUB_SHA ?? "master",
    "--notes-file",
    "-",
  ],
  {
    stdin: new TextEncoder().encode(notes),
    stdout: "inherit",
    stderr: "inherit",
  }
)
if (release.exitCode !== 0) throw new Error(`Couldn't create ${tag}`)
