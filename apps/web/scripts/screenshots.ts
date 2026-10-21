// Captures, in light and dark, the pictures that phones show in place of
// live previews:
// - each block's page, to public/blocks/<name>-<theme>.webp, for /blocks;
// - the home page's components, to public/home/showcase-<theme>.webp.
//
//   bun run screenshots                    every block and the home page
//   bun run screenshots --only explorer-01,home
//
// It runs `next dev`, and one browser renders one block at a time.
import { spawn } from "node:child_process"
import { mkdir, writeFile } from "node:fs/promises"
import { parseArgs } from "node:util"
import { chromium, type Browser, type Page } from "@playwright/test"
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
const publicDir = new URL("public/", root)

// Charts are blocks too, but /charts shows them live.
const blockItems = catalog.items.filter(
  (item) =>
    item.type === "registry:block" && !item.categories?.includes("charts")
)
const blocks = blockItems.map(({ name }) => name)
// The height /blocks frames each block at, so the picture matches.
const heights = new Map(
  blockItems.map((item) => [
    item.name,
    Number.parseInt(
      ("meta" in item ? item.meta?.iframeHeight : undefined) ?? "900"
    ),
  ])
)
const only = values.only?.split(",").map((name) => name.trim())
const unknown =
  only?.filter((name) => name !== "home" && !blocks.includes(name)) ?? []
if (unknown.length) throw new Error(`Not a block: ${unknown.join(", ")}`)
const targets = only ?? [...blocks, "home"]

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
    const ready = await fetch(`${origin}/view/${blocks[0]}`)
      .then((response) => response.ok)
      .catch(() => false)
    if (ready) break
    if (failedToStart) throw failedToStart
    if (server.exitCode !== null)
      throw new Error(`The dev server exited with code ${server.exitCode}`)
    if (attempt > 120) throw new Error("The dev server did not start")
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const browser = await chromium.launch({
    args: ["--enable-unsafe-swiftshader"],
  })
  try {
    for (const name of targets)
      for (const theme of ["light", "dark"] as const) {
        const webp = await (name === "home"
          ? captureHome(browser, theme)
          : captureBlock(browser, name, theme))
        const file =
          name === "home"
            ? new URL(`home/showcase-${theme}.webp`, publicDir)
            : new URL(`blocks/${name}-${theme}.webp`, publicDir)
        await mkdir(new URL(".", file), { recursive: true })
        await writeFile(file, webp)
        console.log(
          `${name} ${theme}: ${(webp.byteLength / 1024).toFixed(1)} KB`
        )
      }
  } finally {
    await browser.close()
  }
} finally {
  // No pid means the server never started, and there is nothing to stop.
  if (server.pid) process.kill(-server.pid)
}

type Theme = "light" | "dark"

// Leaves out the dev server's indicator, then lets the first frames settle.
async function settle(page: Page) {
  await page.evaluate(() => document.querySelector("nextjs-portal")?.remove())
  await page.waitForTimeout(1000)
}

async function captureBlock(browser: Browser, name: string, theme: Theme) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: heights.get(name) ?? 900 },
    colorScheme: theme,
  })
  try {
    await page.goto(`${origin}/view/${name}`)
    await page.locator("main").first().waitFor()
    await page.waitForLoadState("networkidle")
    // Loading shows a status; a failed load shows an alert instead.
    await page
      .getByRole("status")
      .filter({ hasText: /loading/i })
      .waitFor({ state: "detached", timeout: 120_000 })
    // A viewer that failed to load shows an alert. Other alerts, such as a
    // medicine interaction, are part of the page.
    const failed = page
      .getByRole("region", { name: /^Interactive .* model$/ })
      .getByRole("alert")
    if (await failed.count())
      throw new Error(`${name}: ${await failed.first().innerText()}`)
    await settle(page)
    return await sharp(await page.screenshot())
      .webp({ quality: 80, effort: 6 })
      .toBuffer()
  } finally {
    await page.close()
  }
}

// The cards as a wide screen lays them out, cut at 1400px, at twice the
// pixels so phones can show it sharply.
async function captureHome(browser: Browser, theme: Theme) {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: theme,
  })
  try {
    await page.goto(origin)
    const showcase = page.locator("section[aria-label=Components]")
    const cards = showcase.locator("[data-showcase-cards]")
    await cards.waitFor()
    await page.waitForLoadState("networkidle")
    // Without the fades and the button over the cards.
    await showcase.evaluate((section) => {
      section.style.maxHeight = "none"
      for (const child of section.children)
        if (!child.querySelector("[data-showcase-cards]"))
          (child as HTMLElement).style.display = "none"
    })
    await settle(page)
    const box = await cards.boundingBox()
    if (!box) throw new Error("home: the cards aren't visible")
    const image = await page.screenshot({
      fullPage: true,
      clip: { ...box, height: Math.min(box.height, 1400) },
    })
    return await sharp(image).webp({ quality: 80, effort: 6 }).toBuffer()
  } finally {
    await page.close()
  }
}
