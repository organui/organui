// Renders each organ at its default view to public/organs/<name>.webp for the
// organs gallery, as shadcn/ui's scripts/capture-registry.mts captures block
// screenshots. lib/organ-thumbnails.json records the model each image was
// rendered from, so a test fails when a model changes and its image doesn't.
//
//   bun run thumbnails                 organs without an image
//   bun run thumbnails --only heart    these organs, comma-separated
//   bun run thumbnails --force         every organ
//
// It runs `next dev` with ORGANUI_THUMBNAILS=1, the only way the uncredited
// /thumbnail pages exist, and one browser renders one organ at a time.
import { spawn } from "node:child_process"
import { existsSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { parseArgs } from "node:util"
import { chromium } from "@playwright/test"
import sharp from "sharp"
import catalog from "@workspace/registry/registry.json"
import { loadOrganModel } from "../lib/organ-source"

const { values } = parseArgs({
  options: {
    only: { type: "string" },
    force: { type: "boolean" },
    port: { type: "string" },
  },
})
const port = Number(values.port ?? 3210)
const origin = `http://localhost:${port}`
const root = new URL("../", import.meta.url)
const manifestUrl = new URL("lib/organ-thumbnails.json", root)
const outputDir = new URL("public/organs/", root)

const organs = catalog.items
  .filter((item) => "categories" in item && item.categories.includes("organ"))
  .map(({ name }) => name)
const only = values.only?.split(",").map((name) => name.trim())
const unknown = only?.filter((name) => !organs.includes(name)) ?? []
if (unknown.length) throw new Error(`Not an organ: ${unknown.join(", ")}`)
const targets =
  only ??
  organs.filter(
    (name) => values.force || !existsSync(new URL(`${name}.webp`, outputDir))
  )
if (targets.length === 0) {
  console.log("Every organ has a thumbnail; use --only or --force to redo one.")
  process.exit(0)
}

const manifest = JSON.parse(
  await readFile(manifestUrl, "utf8").catch(() => "{}")
) as Record<string, string>

const server = spawn("bunx", ["next", "dev", "--port", String(port)], {
  cwd: root,
  env: { ...process.env, ORGANUI_THUMBNAILS: "1" },
  stdio: ["ignore", "inherit", "inherit"],
  // Its own process group, so stopping it also stops Next's workers.
  detached: true,
})
let failedToStart: Error | undefined
server.on("error", (error) => (failedToStart = error))

try {
  // The first request compiles the route.
  for (let attempt = 0; ; attempt++) {
    const ready = await fetch(`${origin}/thumbnail/${targets[0]}`)
      .then((response) => response.ok)
      .catch(() => false)
    if (ready) break
    if (failedToStart) throw failedToStart
    if (server.exitCode !== null)
      throw new Error(`The dev server exited with code ${server.exitCode}`)
    if (attempt > 120) throw new Error("The dev server did not start")
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  await mkdir(outputDir, { recursive: true })
  const browser = await chromium.launch({
    args: ["--enable-unsafe-swiftshader"],
  })
  const page = await browser.newPage({ viewport: { width: 640, height: 480 } })
  try {
    for (const name of targets) {
      const model = await loadOrganModel(name)
      await page.goto(`${origin}/thumbnail/${name}`)
      const frame = page.locator(`[data-thumbnail="${name}"]`)
      await frame.locator("canvas").waitFor({ state: "attached" })
      // Loading shows a status; a failed load shows an alert instead.
      await frame
        .getByRole("status")
        .waitFor({ state: "detached", timeout: 120_000 })
      if (await frame.getByRole("alert").count())
        throw new Error(
          `${name}: ${await frame.getByRole("alert").innerText()}`
        )
      // Let the first frames settle after framing the model.
      await page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() =>
              requestAnimationFrame(() => setTimeout(resolve, 500))
            )
          )
      )
      const png = await frame.screenshot({ omitBackground: true })
      const webp = await sharp(png)
        .webp({ quality: 75, alphaQuality: 90, effort: 6 })
        .toBuffer()
      await writeFile(new URL(`${name}.webp`, outputDir), webp)
      // Saved after every organ, so a failure partway keeps the record
      // true for each image already written.
      manifest[name] = model.src
      const sorted = Object.fromEntries(
        Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b))
      )
      await writeFile(manifestUrl, `${JSON.stringify(sorted, null, 2)}\n`)
      console.log(`${name}: ${(webp.byteLength / 1024).toFixed(1)} KB`)
    }
  } finally {
    await browser.close()
  }
} finally {
  // No pid means the server never started, and there is nothing to stop.
  if (server.pid) process.kill(-server.pid)
}
