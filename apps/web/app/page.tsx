import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { conditions, organs, registryItems } from "@/lib/registry"
import { explorers, site } from "@/lib/site"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

import { CodeBlockCommand } from "@/components/code-block-command"
import { HomeAudience } from "@/components/home-audience"
import { HomeHero } from "@/components/home-hero"
import { HomeOrgans } from "@/components/home-organs"
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

const heart = organs.find(({ name }) => name === "heart")

const stats = [
  { value: registryItems.length, label: "Components" },
  { value: organs.length, label: "Organs in 3D" },
  { value: conditions.length, label: "Conditions" },
  { value: explorers.length, label: "Standalone explorers" },
]

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex flex-col">
        <HomeHero />
        <section aria-label="OrganUI in numbers" className="border-b">
          <dl className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col gap-1 border-dashed px-6 py-8 not-last:border-e max-md:nth-2:border-e-0 max-md:nth-[-n+2]:border-b md:py-10"
              >
                <dt className="order-last font-mono text-xs tracking-wider text-muted-foreground uppercase">
                  {label}
                </dt>
                <dd className="text-4xl font-semibold tracking-tighter tabular-nums md:text-5xl">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
        <HomeOrgans />
        <HomeAudience />
        <section
          aria-labelledby="home-components"
          className="flex flex-col gap-10 pt-20 md:pt-28"
        >
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-6 text-center">
            <p className="font-mono text-xs tracking-widest text-chart-2 uppercase">
              Clinical
            </p>
            <h2
              id="home-components"
              className="text-3xl font-semibold tracking-tighter text-balance sm:text-5xl"
            >
              Live components, not screenshots.
            </h2>
            <p className="max-w-xl text-balance text-muted-foreground">
              Click the body map, watch the ECG, tick off a dose. These are the
              components you install.
            </p>
          </div>
          <HomeShowcase />
        </section>
        <section className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-6 py-20 text-center md:py-28">
          <p className="font-mono text-xs tracking-widest text-chart-2 uppercase">
            Open source
          </p>
          <h2 className="text-3xl font-semibold tracking-tighter text-balance sm:text-5xl">
            3D anatomy explorers
          </h2>
          <p className="text-balance text-muted-foreground">
            Standalone explorers, each in its own repository.
          </p>
          <nav aria-label="3D anatomy explorers">
            <ul className="flex flex-wrap justify-center gap-2">
              {explorers.map((explorer) => (
                <li key={explorer.name}>
                  <a
                    href={explorer.href}
                    className="inline-flex h-8 items-center rounded-full border bg-background px-3 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    {explorer.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </section>
        <section
          aria-labelledby="home-start"
          className="relative isolate overflow-hidden border-t"
        >
          <div
            aria-hidden="true"
            className="home-grid pointer-events-none absolute inset-0 -z-10"
          />
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-20 text-center md:py-28">
            <h2
              id="home-start"
              className="text-4xl font-semibold tracking-tighter text-balance sm:text-6xl"
            >
              Start with a heart.
            </h2>
            {heart && (
              <div className="w-full max-w-xl text-start">
                <CodeBlockCommand
                  label="Install the heart"
                  command={heart.install}
                />
              </div>
            )}
            <Link href="/docs" className={cn(buttonVariants(), "h-10 px-5")}>
              Read the docs
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
