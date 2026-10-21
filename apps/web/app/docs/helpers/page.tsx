import Link from "next/link"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import { docsMetadata, helperItems, helpersIndex } from "@/lib/registry"

export const metadata = docsMetadata(
  helpersIndex.title,
  helpersIndex.description,
  helpersIndex.href
)

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href={helpersIndex.href} title={helpersIndex.title}>
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          Clinical calculations in TypeScript. Each installs in your lib folder
          with no dependencies; components use some of them, and you can call
          any from your own code.
        </p>
      </DocsHeader>
      <section className="flex flex-col gap-4">
        <DocsHeading id="helpers">All Helpers</DocsHeading>
        <ul className="grid gap-4 sm:grid-cols-2">
          {helperItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex h-full flex-col gap-1 rounded-xl border p-6 text-sm transition-colors outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span className="font-medium">{item.title}</span>
                <span className="leading-relaxed text-muted-foreground">
                  {item.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <DocsPager href={helpersIndex.href} />
    </div>
  )
}
