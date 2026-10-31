import type { Metadata } from "next"
import { explorers, site } from "@/lib/site"

import { HomeHero } from "@/components/home-hero"
import { HomeShowcase } from "@/components/home-showcase"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: { absolute: site.title },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: "/",
  },
}

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex flex-col">
        <HomeHero />
        <HomeShowcase />
        <section className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-6 py-16 text-center text-sm md:py-20">
          <h2 className="text-base font-semibold tracking-tight">
            3D anatomy explorers
          </h2>
          <p className="text-balance text-muted-foreground">
            Standalone explorers, each in its own repository.
          </p>
          <nav aria-label="3D anatomy explorers">
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 leading-loose">
              {explorers.map((explorer) => (
                <li key={explorer.name}>
                  <a
                    href={explorer.href}
                    className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    {explorer.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
