import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { isProduction, site } from "@/lib/site"

import "./globals.css"
import { Analytics } from "@/components/analytics"
import { HostedModels } from "@/components/hosted-models"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  title: { default: site.title, template: "%s — OrganUI" },
  description: site.description,
  alternates: {
    types: { "application/rss+xml": [{ url: "/rss.xml", title: "Changelog" }] },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    site: "@organui",
    title: site.title,
    description: site.description,
    images: [
      { url: site.socialImage, alt: site.title, width: 1200, height: 630 },
    ],
  },
  robots: { index: isProduction, follow: isProduction },
}

// Matches --background in light and dark.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <HostedModels />
        <a
          href="#main"
          className="sr-only rounded-md bg-background px-3 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-60 focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
        {/* The script is served only on Vercel deployments. */}
        {process.env.VERCEL_ENV && <Analytics />}
      </body>
    </html>
  )
}
