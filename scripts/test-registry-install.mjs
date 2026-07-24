import { spawnSync } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
)
const temporaryRoot = mkdtempSync(
  path.join(tmpdir(), "organui-registry-test-")
)
const consumerPath = path.join(
  temporaryRoot,
  `consumer-${process.pid}-${Date.now()}`
)

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repositoryRoot,
    stdio: "inherit",
    ...options,
  })

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed`)
  }
}

try {
  mkdirSync(consumerPath)
  run("npm", ["run", "registry:build"])
  run("npx", [
    "create-next-app@latest",
    consumerPath,
    "--yes",
    "--typescript",
    "--tailwind",
    "--eslint",
    "--app",
    "--src-dir",
    "--import-alias",
    "@/*",
    "--turbopack",
    "--use-npm",
  ])
  run("npx", [
    "shadcn@latest",
    "init",
    "--cwd",
    consumerPath,
    "--preset",
    "nova",
    "--base",
    "base",
    "--yes",
  ])
  run("npx", [
    "shadcn@latest",
    "add",
    "--cwd",
    consumerPath,
    path.join(
      repositoryRoot,
      "public/r/patient-status-badge.json"
    ),
    "--yes",
  ])

  const expectedFiles = [
    "src/components/patient-status-badge.tsx",
    "src/components/ui/badge.tsx",
  ]

  for (const file of expectedFiles) {
    if (!existsSync(path.join(consumerPath, file))) {
      throw new Error(`Registry install did not create ${file}`)
    }
  }

  run("npm", ["run", "build"], { cwd: consumerPath })
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true })
}
