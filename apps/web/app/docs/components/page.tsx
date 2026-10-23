import Link from "next/link"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import {
  componentsIndex,
  diseasesPage,
  docsMetadata,
  organsPage,
  registryItems,
} from "@/lib/registry"

export const metadata = docsMetadata(
  componentsIndex.title,
  "Editable healthcare interface components distributed through a shadcn registry.",
  componentsIndex.href
)

// An A–Z list of links, like shadcn/ui's components index. Each component's
// page has its preview and install command; the organs and the diseases each
// share one gallery.
const links = [
  ...registryItems
    .filter((item) => !item.organ && !item.disease)
    .map(({ title, href }) => ({ title, href })),
  { title: organsPage.title, href: organsPage.href },
  { title: diseasesPage.title, href: diseasesPage.href },
].sort((a, b) => a.title.localeCompare(b.title))

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href={componentsIndex.href} title="Components">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          Each component installs as source with the shadcn CLI. Set up a
          project first in{" "}
          <Link href="/docs/installation" className="underline">
            Installation
          </Link>
          ; for whole layouts, see the{" "}
          <Link href="/blocks" className="underline">
            blocks
          </Link>
          .
        </p>
      </DocsHeader>
      <section className="flex flex-col gap-4">
        <DocsHeading id="all-components">All Components</DocsHeading>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6">
          {links.map(({ title, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-lg font-medium underline-offset-4 hover:underline md:text-base"
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <p className="border-t pt-6 text-sm text-muted-foreground">
        Can&apos;t find what you need? The whole catalog is served at{" "}
        <a className="underline" href="/r/registry.json">
          /r/registry.json
        </a>
        , and the{" "}
        <Link href="/blocks" className="underline">
          blocks
        </Link>{" "}
        combine components into full layouts.
      </p>
      <DocsPager href={componentsIndex.href} />
    </div>
  )
}
