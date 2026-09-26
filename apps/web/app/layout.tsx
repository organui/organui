import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { isProduction, site } from "@/lib/site"

import "./globals.css"
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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
