// Draws the repository's social preview to .github/social-preview.png: a
// 1280×640 card with the mark, name and tagline beside four organ renders.
// Upload it in Settings → Social preview.
//
//   bun scripts/social-preview.ts
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { chromium } from "@playwright/test"
import sharp from "sharp"

const root = new URL("../", import.meta.url)
const out = new URL("../../.github/", root)
const font = await readFile(
  new URL(
    "dist/next-devtools/server/font/geist-latin.woff2",
    import.meta.resolve("next/package.json")
  )
)
const organs = ["heart", "brain", "lungs", "kidneys"]
const images = Object.fromEntries(
  await Promise.all(
    organs.map(async (name) => [
      name,
      (await readFile(new URL(`public/organs/${name}.webp`, root))).toString(
        "base64"
      ),
    ])
  )
)
const mark =
  "M47 2C62 1 74 8 79 21C82 30 85 34 92 41C102 51 101 68 94 80C85 96 69 103 51 103C23 103 3 84 1 56C-1 32 18 6 47 2ZM55 22C43 26 25 39 23 51C19 68 30 81 46 83C61 86 74 81 76 70C79 59 66 54 65 45C63 36 72 28 67 23C64 19 60 20 55 22Z"

const themes = {
  light: {
    background: "#ffffff",
    foreground: "#171717",
    muted: "#737373",
    card: "#f5f5f5",
    border: "#e5e5e5",
  },
  dark: {
    background: "#0a0a0a",
    foreground: "#ededed",
    muted: "#a3a3a3",
    card: "#171717",
    border: "#262626",
  },
}

function page(theme: (typeof themes)[keyof typeof themes]) {
  return `<!doctype html><html><head><style>
@font-face { font-family: Geist; src: url(data:font/woff2;base64,${font.toString("base64")}) format("woff2"); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; }
body { width: 1280px; height: 640px; font-family: Geist; background: ${theme.background}; color: ${theme.foreground}; display: flex; align-items: center; padding: 72px; gap: 56px; }
.text { flex: 1; display: flex; flex-direction: column; gap: 28px; }
.brand { display: flex; align-items: center; gap: 16px; font-size: 34px; font-weight: 600; letter-spacing: -0.02em; }
h1 { font-size: 64px; line-height: 1.05; font-weight: 600; letter-spacing: -0.04em; }
p { font-size: 26px; line-height: 1.4; color: ${theme.muted}; max-width: 560px; }
.url { font-size: 22px; color: ${theme.muted}; }
.grid { display: grid; grid-template-columns: repeat(2, 220px); gap: 16px; }
.organ { height: 220px; border-radius: 28px; background: ${theme.card}; border: 1px solid ${theme.border}; display: flex; align-items: center; justify-content: center; }
.organ img { width: 92%; }
</style></head><body>
<div class="text">
  <div class="brand"><svg width="40" height="42" viewBox="0 0 100 104"><path fill="${theme.foreground}" fill-rule="evenodd" d="${mark}"/></svg>OrganUI</div>
  <h1>The interfaces healthcare deserves.</h1>
  <p>Open-source components for healthcare and life sciences, installed as source with the shadcn CLI.</p>
  <div class="url">organui.com</div>
</div>
<div class="grid">${organs.map((name) => `<div class="organ"><img src="data:image/webp;base64,${images[name]}" alt=""/></div>`).join("")}</div>
</body></html>`
}

await mkdir(out, { recursive: true })
const browser = await chromium.launch()
try {
  const tab = await browser.newPage({ viewport: { width: 1280, height: 640 } })
  await tab.setContent(page(themes.light))
  await tab.evaluate(() => document.fonts.ready)
  await writeFile(
    new URL("social-preview.png", out),
    await sharp(await tab.screenshot())
      .png({ compressionLevel: 9 })
      .toBuffer()
  )
} finally {
  await browser.close()
}
