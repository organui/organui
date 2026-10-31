import type { Metadata } from "next"
import Link from "next/link"
import { explorers, site } from "@/lib/site"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

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
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main
        id="main"
        className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-4 sm:gap-12 sm:py-10 md:gap-16"
      >
        <section className="flex max-w-3xl flex-col items-center gap-6 text-center sm:gap-8">
          <h1 className="text-[2rem] leading-[1.1] font-semibold tracking-tighter text-balance text-primary sm:text-4xl md:text-5xl">
            Healthcare &amp; life science UI for humans and agents
          </h1>
          <div className="flex items-center justify-center gap-2">
            <Link
              href="/docs"
              className={cn(buttonVariants({ size: "sm" }), "h-[35px] px-4")}
            >
              Get Started
            </Link>
            <Link
              href="/docs/components"
              className={cn(
                buttonVariants({ size: "sm", variant: "ghost" }),
                "h-[35px] px-4"
              )}
            >
              Browse Components
            </Link>
          </div>
        </section>
        <section className="flex max-w-3xl flex-col items-center gap-2 text-center text-sm sm:gap-3">
          <h2 className="text-base font-semibold tracking-tight">
            3D anatomy explorers
          </h2>
          <p className="text-balance text-muted-foreground">
            Standalone explorers, each in its own repository.
          </p>
          <nav aria-label="3D anatomy explorers">
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-0.5 leading-7 sm:gap-y-1 sm:leading-loose">
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
    </div>
  )
}
