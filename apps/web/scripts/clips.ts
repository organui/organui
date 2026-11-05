// Films items as looping MP4s for social posts, frame by frame: the page's
// clock is faked and paused, and each frame the script sets the scene
// (window.clip.step), advances the clock one frame and screenshots. Software
// WebGL can't keep up with a real-time recording, so this is what keeps the
// motion smooth, and every run comes out the same.
//
//   bun run clips --only heart                      a 1080×1080 clip
//   bun run clips --only heart,myocardial-infarction,ecg-trace
//   bun run clips --only heart --size 1920x1080     another size
//
// Organs, tissues and the cell turn once; a condition steps through its
// course; the ECG trace sweeps. Clips land in apps/web/clips (ignored by git)
// as <name>.mp4 with <name>.png, the first frame. It needs ffmpeg on PATH,
// and runs `next dev` with ORGANUI_CLIPS=1, the only way /clip pages exist.
import { spawn, spawnSync } from "node:child_process"
import { mkdir, mkdtemp, rm, copyFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { parseArgs } from "node:util"
import { chromium } from "@playwright/test"
import catalog from "@workspace/registry/registry.json"
import type { Clip } from "../app/clip/[name]/clip-stage"

const { values } = parseArgs({
  options: {
    only: { type: "string" },
    size: { type: "string" },
    port: { type: "string" },
  },
})
if (!values.only)
  throw new Error("Name the items to film: --only heart,ecg-trace")
const names = values.only.split(",").map((name) => name.trim())
const size = values.size?.split("x").map(Number)
if (size && !(size[0] && size[1])) throw new Error(`Not a size: ${values.size}`)
if (spawnSync("ffmpeg", ["-version"]).status !== 0)
  throw new Error("ffmpeg is not on PATH")

const FPS = 30
const conditions = new Set(
  catalog.items
    .filter(
      (item) => "categories" in item && item.categories.includes("condition")
    )
    .map((item) => item.name)
)
// Each kind's default size, and its pixel density: rendered at half size and
// twice the density, text and controls read at phone size. A condition is
// laid out at two thirds instead, wide enough for its timeline to run under
// the model rather than down the side. A rhythm strip is wide.
const frameOf = (name: string) => {
  const [width, height] =
    size ?? (name === "ecg-trace" ? [1920, 960] : [1080, 1080])
  return {
    width: width!,
    height: height!,
    scale: conditions.has(name) ? 1.5 : 2,
  }
}
const port = Number(values.port ?? 3211)
const origin = `http://localhost:${port}`
const root = new URL("../", import.meta.url)
const out = new URL("clips/", root)

const server = spawn("bunx", ["next", "dev", "--port", String(port)], {
  cwd: root,
  env: { ...process.env, ORGANUI_CLIPS: "1" },
  stdio: ["ignore", "inherit", "inherit"],
  // Its own process group, so stopping it also stops Next's workers.
  detached: true,
})
let failedToStart: Error | undefined
server.on("error", (error) => (failedToStart = error))

try {
  // The first request compiles the route.
  for (let attempt = 0; ; attempt++) {
    const ready = await fetch(`${origin}/clip/${names[0]}`)
      .then((response) => response.ok)
      .catch(() => false)
    if (ready) break
    if (failedToStart) throw failedToStart
    if (server.exitCode !== null)
      throw new Error(`The dev server exited with code ${server.exitCode}`)
    if (attempt > 120) throw new Error("The dev server did not start")
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  await mkdir(out, { recursive: true })
  const browser = await chromium.launch({
    args: ["--enable-unsafe-swiftshader"],
  })
  try {
    for (const name of names) {
      const { width, height, scale } = frameOf(name)
      const page = await browser.newPage({
        viewport: {
          width: Math.round(width / scale),
          height: Math.round(height / scale),
        },
        deviceScaleFactor: scale,
        colorScheme: "dark",
        reducedMotion: "no-preference",
      })
      // The fake clock runs like the real one until it is paused below.
      await page.clock.install()
      const response = await page.goto(`${origin}/clip/${name}`)
      if (!response?.ok()) throw new Error(`${name}: no clip page`)
      const stage = page.locator(`[data-clip="${name}"]`)
      await page.waitForFunction(() => window.clip !== undefined)
      // A 3D model shows a status while it loads, and an alert if it fails.
      // The status can mount a moment after the page, so wait to see it go.
      const viewer = stage.locator('[data-slot="organ-viewer"]')
      if (await viewer.count()) {
        const loading = viewer.getByRole("status").first()
        await loading.waitFor({ timeout: 10_000 }).catch(() => {})
        await loading.waitFor({ state: "detached", timeout: 120_000 })
        if (await viewer.getByRole("alert").count())
          throw new Error(
            `${name}: ${await viewer.getByRole("alert").first().innerText()}`
          )
      }
      await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 1000)
      // Let the first frames render before filming.
      await page.clock.runFor(500)

      const frames = await page.evaluate(() => window.clip!.frames)
      const dir = await mkdtemp(join(tmpdir(), `organui-clip-${name}-`))
      try {
        for (let i = 0; i < frames; i++) {
          await page.evaluate((i) => (window.clip as Clip).step(i), i)
          // Time to the end of frame i, so frames stay on the 30 fps grid.
          const due =
            Math.round(((i + 1) * 1000) / FPS) - Math.round((i * 1000) / FPS)
          await page.clock.runFor(due)
          await stage.screenshot({
            path: join(dir, `${String(i).padStart(4, "0")}.png`),
          })
          if (i % FPS === 0)
            process.stdout.write(`\r${name}: frame ${i + 1}/${frames}`)
        }
        process.stdout.write("\n")
        const mp4 = new URL(`${name}.mp4`, out).pathname
        const ffmpeg = spawnSync(
          "ffmpeg",
          [
            ...["-y", "-loglevel", "error"],
            ...["-framerate", String(FPS), "-i", join(dir, "%04d.png")],
            ...["-c:v", "libx264", "-preset", "slow", "-crf", "18"],
            // Even dimensions and 4:2:0, which X and phones expect.
            ...["-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2"],
            ...["-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4],
          ],
          { stdio: "inherit" }
        )
        if (ffmpeg.status !== 0) throw new Error(`${name}: ffmpeg failed`)
        await copyFile(
          join(dir, "0000.png"),
          new URL(`${name}.png`, out).pathname
        )
        console.log(`${name}: ${mp4}`)
      } finally {
        await rm(dir, { recursive: true, force: true })
        await page.close()
      }
    }
  } finally {
    await browser.close()
  }
} finally {
  // No pid means the server never started, and there is nothing to stop.
  if (server.pid) process.kill(-server.pid)
}
