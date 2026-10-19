// Renders each organ at its default view and writes public/organs/<name>.webp
// plus lib/organ-thumbnails.json, which records the model each thumbnail was
// made from and its licence. A thumbnail is a rendering of its model, so it
// keeps that model's licence, and the gallery shows its credit.
//
//   bun run thumbnails                 all organs (CI: .github/workflows/thumbnails.yml)
//   bun run thumbnails --only heart    one or more, comma-separated
//
// One browser renders one organ at a time in software WebGL. Locally, prefer
// --only: all of them at once is slow on a laptop.
import { spawn } from "node:child_process"
import { createHash } from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { parseArgs } from "node:util"
import { chromium } from "@playwright/test"
import sharp from "sharp"
import type { OrganModel } from "@workspace/registry/organ-viewer"
import catalog from "@workspace/registry/registry.json"

export type ThumbnailEntry = {
  file: string
  sha256: string
  width: number
  height: number
  model: string
  license: string
  licenseUrl: string
  credit: string
  source: string
}

const { values } = parseArgs({
  options: { only: { type: "string" }, port: { type: "string" } },
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
const targets = only ?? organs

// Each organ module exports `<camelName>Model`.
async function modelOf(name: string) {
  const exports = (await import(`@workspace/registry/${name}`)) as Record<
    string,
    unknown
  >
  const key = `${name.replace(/-(\w)/g, (_, letter: string) => letter.toUpperCase())}Model`
  const model = exports[key] as OrganModel | undefined
  if (!model) throw new Error(`${name} does not export ${key}`)
  return model
}

const server = spawn("bunx", ["next", "dev", "--port", String(port)], {
  cwd: root,
  env: { ...process.env, ORGANUI_THUMBNAILS: "1" },
  stdio: ["ignore", "inherit", "inherit"],
  // Its own process group, so stopping it also stops Next's workers.
  detached: true,
})

try {
  // The first request compiles the route.
  for (let attempt = 0; ; attempt++) {
    const ready = await fetch(`${origin}/thumbnail/${targets[0]}`)
      .then((response) => response.ok)
      .catch(() => false)
    if (ready) break
    if (attempt > 120) throw new Error("The dev server did not start")
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const manifest = JSON.parse(
    await readFile(manifestUrl, "utf8").catch(() => "{}")
  ) as Record<string, ThumbnailEntry>
  await mkdir(outputDir, { recursive: true })
  const browser = await chromium.launch({
    args: ["--enable-unsafe-swiftshader"],
  })
  const page = await browser.newPage({ viewport: { width: 640, height: 480 } })
  try {
    for (const name of targets) {
      const model = await modelOf(name)
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
      const file = `${name}.webp`
      await writeFile(new URL(file, outputDir), webp)
      manifest[name] = {
        file: `/organs/${file}`,
        sha256: createHash("sha256").update(webp).digest("hex"),
        width: 640,
        height: 480,
        model: model.src,
        license: model.attribution.license,
        licenseUrl: model.attribution.licenseUrl,
        credit: model.attribution.credit,
        source: model.attribution.source,
      }
      console.log(`${name}: ${(webp.byteLength / 1024).toFixed(1)} KB`)
    }
  } finally {
    await browser.close()
  }
  const sorted = Object.fromEntries(
    Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b))
  )
  await writeFile(manifestUrl, `${JSON.stringify(sorted, null, 2)}\n`)
} finally {
  process.kill(-server.pid!)
}
