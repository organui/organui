import Link from "next/link"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import {
  docsMetadata,
  utilitiesIndex,
  utilityItems,
  type UtilityItem,
} from "@/lib/registry"

export const metadata = docsMetadata(
  utilitiesIndex.title,
  utilitiesIndex.description,
  utilitiesIndex.href
)

const groups = [
  {
    id: "helpers",
    title: "Helpers",
    description:
      "TypeScript that installs in lib, with no dependencies. Components use some of them, and you can call any from your own code.",
    kind: "helper",
  },
  {
    id: "css",
    title: "CSS",
    description:
      "Tailwind utilities and theme colours that the CLI adds to your global CSS file.",
    kind: "css",
  },
] as const satisfies {
  id: string
  title: string
  description: string
  kind: UtilityItem["kind"]
}[]

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href={utilitiesIndex.href} title={utilitiesIndex.title}>
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          Clinical helpers and CSS utilities. Each installs on its own with the
          shadcn CLI, like a component.
        </p>
      </DocsHeader>
      {groups.map((group) => (
        <section key={group.id} className="flex flex-col gap-4">
          <DocsHeading id={group.id}>{group.title}</DocsHeading>
          <p>{group.description}</p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {utilityItems
              .filter((item) => item.kind === group.kind)
              .map((item) => (
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
      ))}
      <DocsPager href={utilitiesIndex.href} />
    </div>
  )
}
