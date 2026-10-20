import Link from "next/link"
import { DocsPager } from "@/components/docs-pager"
import {
  componentsIndex,
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
// page has its preview and install command; the organs share one gallery.
const links = [
  ...registryItems
    .filter((item) => !item.organ)
    .map(({ title, href }) => ({ title, href })),
  { title: "Organs", href: organsPage.href },
].sort((a, b) => a.title.localeCompare(b.title))

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight">Components</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
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
      </header>
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
      <p className="text-sm text-muted-foreground">
        The full catalog is served at{" "}
        <a className="underline" href="/r/registry.json">
          /r/registry.json
        </a>
        .
      </p>
      <DocsPager href={componentsIndex.href} />
    </div>
  )
}
