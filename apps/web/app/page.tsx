import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { organs, organsPage, registryItems } from "@/lib/registry"
import { explorers, site } from "@/lib/site"
import { Badge } from "@workspace/ui/components/badge"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

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
        <section className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-6 py-12 text-center md:py-20 lg:py-24 xl:gap-4">
          <Badge
            variant="secondary"
            render={<Link href={organsPage.href} />}
            className="bg-muted"
          >
            {organs.length} organs in 3D, ready to install
            <ArrowRightIcon data-icon="inline-end" />
          </Badge>
          <h1 className="max-w-3xl text-4xl leading-tight font-semibold tracking-tight text-balance text-primary lg:leading-[1.1] xl:text-5xl xl:tracking-tighter">
            The interfaces healthcare deserves
          </h1>
          <p className="max-w-2xl text-base text-balance text-foreground sm:text-lg">
            {registryItems.length} open-source components for healthcare and
            life sciences: 3D anatomy, clinical charts, molecules and medical
            images. Install them as source with the shadcn CLI.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <Link
              href="/docs"
              className={cn(buttonVariants({ size: "sm" }), "h-[35px] px-4")}
            >
              Get Started
            </Link>
            <Link
              href="/docs/components"
              className={cn(
                buttonVariants({ size: "sm", variant: "secondary" }),
                "h-[35px] px-4 shadow-none"
              )}
            >
              Browse Components
            </Link>
          </div>
        </section>
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
