import { ImageResponse } from "next/og"

export const alt = "OrganUI — healthcare and life-science UI components"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ background: "#f7f7f5", color: "#171717", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", padding: "72px", width: "100%" }}>
        <div style={{ display: "flex", fontSize: 28 }}>OrganUI</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 980 }}>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 650, lineHeight: 1.08 }}>Healthcare UI, source-first.</div>
          <div style={{ color: "#525252", display: "flex", fontSize: 28 }}>Accessible shadcn components for health and life-science products.</div>
        </div>
      </div>
    ),
    size
  )
}
