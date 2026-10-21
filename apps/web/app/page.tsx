import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { organs, organsPage, registryItems } from "@/lib/registry"
import { explorers, site } from "@/lib/site"
import { Badge } from "@workspace/ui/components/badge"
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

// A row of organs to show what the components look like.
const showcase = [
  "heart",
  "brain",
  "lungs",
  "kidneys",
  "liver",
  "stomach",
  "eye",
  "skeleton",
].flatMap((name) => organs.filter((organ) => organ.name === name))

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
          <p className="max-w-2xl text-base text-balance text-muted-foreground sm:text-lg">
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
                buttonVariants({ size: "sm", variant: "ghost" }),
                "h-[35px] px-4"
              )}
            >
              Browse Components
            </Link>
          </div>
        </section>
        <section
          aria-label="Organs"
          className="mx-auto w-full max-w-6xl px-4 sm:px-6"
        >
          <ul className="grid grid-cols-2 gap-3 rounded-2xl border bg-muted/30 p-3 sm:grid-cols-4 sm:gap-4 sm:p-4">
            {showcase.map((organ) => (
              <li key={organ.name}>
                <Link
                  href={organ.href}
                  className="group flex flex-col gap-2 rounded-xl bg-background p-2 ring-1 ring-foreground/5 transition-shadow outline-none hover:shadow-sm focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <Image
                    src={`/organs/${organ.name}.webp`}
                    width={640}
                    height={480}
                    alt=""
                    sizes="(min-width: 1152px) 17rem, (min-width: 640px) 25vw, 50vw"
                    className="aspect-[4/3] w-full rounded-lg object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                  <span className="px-1 pb-1 text-sm font-medium">
                    {organ.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
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
