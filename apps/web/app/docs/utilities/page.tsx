import Link from "next/link"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import { UtilitiesInstallation } from "@/components/utilities-installation"
import { docsMetadata, utilitiesIndex, utilityItems } from "@/lib/registry"

export const metadata = docsMetadata(
  utilitiesIndex.title,
  utilitiesIndex.description,
  utilitiesIndex.href
)

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href={utilitiesIndex.href} title={utilitiesIndex.title}>
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          Tailwind utilities for clinical interfaces. Like shadcn&apos;s, they
          come together: one install adds every class.
        </p>
      </DocsHeader>
      <section className="flex flex-col gap-4">
        <DocsHeading id="installation">Installation</DocsHeading>
        <UtilitiesInstallation />
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="utilities">All Utilities</DocsHeading>
        <ul className="grid gap-4 sm:grid-cols-3">
          {utilityItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex h-full flex-col gap-1 rounded-xl border p-6 text-sm transition-colors outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span className="font-mono font-medium">{item.title}</span>
                <span className="leading-relaxed text-muted-foreground">
                  {item.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <DocsPager href={utilitiesIndex.href} />
    </div>
  )
}
