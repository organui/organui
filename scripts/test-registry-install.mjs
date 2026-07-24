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
  const registryItems = [
    "patient-status-badge",
    "lab-result-card",
    "lab-results-panel",
    "vital-sign-card",
    "medication-status",
    "specimen-status",
    "clinical-alert",
    "study-phase-badge",
    "patient-summary-header",
  ]

  for (const item of registryItems) {
    run("npx", [
      "shadcn@latest",
      "add",
      "--cwd",
      consumerPath,
      path.join(repositoryRoot, `public/r/${item}.json`),
      "--yes",
    ])
  }

  const expectedFiles = [
    "src/components/patient-status-badge.tsx",
    "src/components/lab-result-card.tsx",
    "src/components/lab-results-panel.tsx",
    "src/components/vital-sign-card.tsx",
    "src/components/medication-status.tsx",
    "src/components/specimen-status.tsx",
    "src/components/clinical-alert.tsx",
    "src/components/study-phase-badge.tsx",
    "src/components/patient-summary-header.tsx",
    "src/components/ui/badge.tsx",
    "src/components/ui/card.tsx",
    "src/components/ui/empty.tsx",
    "src/components/ui/table.tsx",
    "src/components/ui/alert.tsx",
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
