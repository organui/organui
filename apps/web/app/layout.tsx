import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import "@workspace/ui/globals.css"
import "./homepage.css"

const manrope = localFont({
  src: "./fonts/manrope.woff2",
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
})
const dmSans = localFont({
  src: "./fonts/dm-sans.woff2",
  variable: "--font-dm-sans",
  display: "swap",
  weight: "100 1000",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://organui.com"),
  title: "OrganUI — Open-source interfaces for health and life science",
  description:
    "Starting with interactive 3D anatomy, built for the web. Discover OrganUI’s Heart, Liver, and Lungs explorers and help shape what comes next.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "OrganUI",
    locale: "en_US",
    title: "OrganUI — A closer look at anatomy",
    description:
      "Open-source interfaces for health and life science. Starting with interactive 3D anatomy, built for the web.",
  },
  twitter: { card: "summary_large_image" },
}
export const viewport: Viewport = { themeColor: "#faf9f6" }
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
