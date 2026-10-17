import type { Metadata } from "next"
import { explorers, site } from "@/lib/site"
import { bodyPlaces } from "@/lib/body"
import { registryItems } from "@/lib/registry"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

import { BodyNavigator } from "@/components/body-navigator"
import { SiteHeader } from "@/components/site-header"
import { GitHubIcon, XIcon } from "@/components/social-icons"

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

// Every organ component, placed on the body.
const organs = registryItems
  .filter(({ organ }) => organ)
  .map(({ name, title, href }) => ({
    name,
    title,
    href,
    explorer: explorers.find(({ slug }) => slug === name)?.href,
    ...bodyPlaces[name]!,
  }))
  .sort((a, b) => a.title.localeCompare(b.title))

const social = cn(
  buttonVariants({ variant: "ghost", size: "icon" }),
  "size-11 hover:bg-transparent hover:text-muted-foreground dark:hover:bg-transparent"
)

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            The interfaces healthcare deserves.
          </h1>
          <p className="text-muted-foreground">
            Pick an organ on the body or in the list to zoom in and open its
            component.
          </p>
        </div>
        <BodyNavigator organs={organs} />
        <footer className="flex justify-center gap-4">
          <a
            href="https://github.com/organui"
            aria-label="OrganUI on GitHub"
            className={social}
          >
            <GitHubIcon />
          </a>
          <a
            href="https://x.com/organui"
            aria-label="OrganUI on X"
            className={social}
          >
            <XIcon />
          </a>
        </footer>
      </main>
    </>
  )
}
