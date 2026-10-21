import { ImageResponse } from "next/og"
import { site } from "@/lib/site"

export const socialImageSize = { width: 1200, height: 630 }

// The site's social card: the mark and name, then a page's title and
// summary. Satori draws it in Geist, its built-in font.
export function socialImage({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: 80,
        background: "#ffffff",
        color: "#171717",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <svg width="46" height="48" viewBox="0 0 100 104">
          <path
            fill="#171717"
            fillRule="evenodd"
            d="M47 2C62 1 74 8 79 21C82 30 85 34 92 41C102 51 101 68 94 80C85 96 69 103 51 103C23 103 3 84 1 56C-1 32 18 6 47 2ZM55 22C43 26 25 39 23 51C19 68 30 81 46 83C61 86 74 81 76 70C79 59 66 54 65 45C63 36 72 28 67 23C64 19 60 20 55 22Z"
          />
        </svg>
        <span style={{ fontSize: 36, letterSpacing: -1 }}>organui</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: title.length > 40 ? 64 : 80,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: 34,
              lineHeight: 1.35,
              color: "#737373",
              maxWidth: 1000,
            }}
          >
            {description}
          </div>
        )}
      </div>
      <div style={{ fontSize: 24, color: "#737373" }}>
        {new URL(site.url).hostname}
      </div>
    </div>,
    socialImageSize
  )
}
