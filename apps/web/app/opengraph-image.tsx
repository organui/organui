import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { site } from "@/lib/site"

export const alt = "OrganUI — The interfaces healthcare deserves."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const [regular, medium] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Geist-Regular.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Geist-Medium.ttf")),
  ])
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "#ffffff",
        color: "#171717",
        fontFamily: "Geist",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <svg width="84" height="88" viewBox="0 0 100 104">
          <path
            fill="#171717"
            fillRule="evenodd"
            d="M47 2C62 1 74 8 79 21C82 30 85 34 92 41C102 51 101 68 94 80C85 96 69 103 51 103C23 103 3 84 1 56C-1 32 18 6 47 2ZM55 22C43 26 25 39 23 51C19 68 30 81 46 83C61 86 74 81 76 70C79 59 66 54 65 45C63 36 72 28 67 23C64 19 60 20 55 22Z"
          />
        </svg>
        <span style={{ fontSize: 64, fontWeight: 500, letterSpacing: -2 }}>
          organui
        </span>
      </div>
      <div style={{ marginTop: 40, fontSize: 38, letterSpacing: -1 }}>
        The interfaces healthcare deserves.
      </div>
      <div style={{ marginTop: 32, fontSize: 22, color: "#737373" }}>
        {new URL(site.url).hostname}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: medium, weight: 500, style: "normal" },
      ],
    }
  )
}
