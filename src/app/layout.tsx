import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://organui.com"),
  title: {
    default: "OrganUI — Healthcare UI Registry",
    template: "%s · OrganUI",
  },
  description:
    "Accessible, open UI building blocks for healthcare and life-science products.",
  alternates: { canonical: "/" },
  keywords: [
    "healthcare UI",
    "life science design system",
    "clinical UI components",
    "shadcn registry",
  ],
  openGraph: {
    type: "website",
    siteName: "OrganUI",
    title: "OrganUI — Healthcare UI Registry",
    description:
      "Accessible, open UI building blocks for healthcare and life-science products.",
  },
  twitter: { card: "summary_large_image" },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  )
}
