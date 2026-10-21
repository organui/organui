// Captures each block's page in light and dark to
// public/blocks/<name>-<theme>.webp, which /blocks shows on phones in place
// of the live preview.
//
//   bun run block-screenshots                every block
//   bun run block-screenshots --only explorer-01
//
// It runs `next dev`, and one browser renders one block at a time.
import { spawn } from "node:child_process"
import { mkdir, writeFile } from "node:fs/promises"
import { parseArgs } from "node:util"
import { chromium } from "@playwright/test"
import sharp from "sharp"
import catalog from "@workspace/registry/registry.json"

const { values } = parseArgs({
  options: {
    only: { type: "string" },
    port: { type: "string" },
  },
})
const port = Number(values.port ?? 3211)
const origin = `http://localhost:${port}`
const root = new URL("../", import.meta.url)
const outputDir = new URL("public/blocks/", root)

const blocks = catalog.items
  .filter((item) => item.type === "registry:block")
  .map(({ name }) => name)
const only = values.only?.split(",").map((name) => name.trim())
const unknown = only?.filter((name) => !blocks.includes(name)) ?? []
if (unknown.length) throw new Error(`Not a block: ${unknown.join(", ")}`)
const targets = only ?? blocks

const server = spawn("bunx", ["next", "dev", "--port", String(port)], {
  cwd: root,
  stdio: ["ignore", "inherit", "inherit"],
  // Its own process group, so stopping it also stops Next's workers.
  detached: true,
})
let failedToStart: Error | undefined
server.on("error", (error) => (failedToStart = error))

try {
  // The first request compiles the route.
  for (let attempt = 0; ; attempt++) {
    const ready = await fetch(`${origin}/view/${targets[0]}`)
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
  try {
    for (const name of targets)
      for (const theme of ["light", "dark"] as const) {
        const page = await browser.newPage({
          viewport: { width: 1440, height: 900 },
          colorScheme: theme,
        })
        await page.goto(`${origin}/view/${name}`)
        await page.locator("canvas").first().waitFor({ state: "attached" })
        // Loading shows a status; a failed load shows an alert instead.
        await page
          .getByRole("status")
          .filter({ hasText: /loading/i })
          .waitFor({ state: "detached", timeout: 120_000 })
        // Next.js adds its own, empty route announcer alert.
        const failed = page.getByRole("alert").filter({ hasText: /\S/ })
        if (await failed.count())
          throw new Error(`${name}: ${await failed.first().innerText()}`)
        // Leave out the dev server's indicator.
        await page.evaluate(() =>
          document.querySelector("nextjs-portal")?.remove()
        )
        // Let the first frames settle after framing the model.
        await page.waitForTimeout(1000)
        const webp = await sharp(await page.screenshot())
          .webp({ quality: 80, effort: 6 })
          .toBuffer()
        await writeFile(new URL(`${name}-${theme}.webp`, outputDir), webp)
        console.log(
          `${name} ${theme}: ${(webp.byteLength / 1024).toFixed(1)} KB`
        )
        await page.close()
      }
  } finally {
    await browser.close()
  }
} finally {
  // No pid means the server never started, and there is nothing to stop.
  if (server.pid) process.kill(-server.pid)
}
