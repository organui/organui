import type { Metadata } from "next"
import { explorers, site } from "@/lib/site"
import { bodyPlaces } from "@/lib/body"
import { registryItems } from "@/lib/registry"

import { BodyNavigator } from "@/components/body-navigator"
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

export default function Page() {
  return (
    <>
      <SiteHeader floating />
      <main>
        <h1 className="sr-only">
          OrganUI: the interfaces healthcare deserves. Pick an organ on the body
          to open its component.
        </h1>
        <BodyNavigator organs={organs} />
      </main>
    </>
  )
}
