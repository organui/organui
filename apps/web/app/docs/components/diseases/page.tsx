import Image from "next/image"
import Link from "next/link"
import bodySystems from "@workspace/registry/body-systems.json"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import {
  diseases,
  diseasesPage,
  docsMetadata,
  registryItems,
} from "@/lib/registry"

export const metadata = docsMetadata(
  diseasesPage.title,
  diseasesPage.description,
  diseasesPage.href
)

// Each disease carries one body system as a registry category (a registry
// test checks it), so a new disease lands in its section without a site
// change. Systems without a disease yet are left out.
const sections = bodySystems
  .map((system) => ({
    ...system,
    items: diseases.filter((item) => item.system === system.id),
  }))
  .filter(({ items }) => items.length > 0)

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href={diseasesPage.href} title="Diseases">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          Each disease is drawn on the{" "}
          <Link href="/docs/components/organs" className="underline">
            organ
          </Link>{" "}
          or tissue it affects. The affected structures keep their colours, and
          each structure describes what the disease does there.
        </p>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Each picture is a rendering of its model and is shared under that
          model&apos;s licence; see{" "}
          <Link href="/docs/licences" className="underline">
            Licences
          </Link>
          . Educational models, not for diagnosis or clinical decisions.
        </p>
      </DocsHeader>
      {sections.map((section) => (
        <section key={section.id} className="flex flex-col gap-4">
          <DocsHeading id={section.id}>{section.title}</DocsHeading>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
            {section.items.map((item) => {
              const bases = item.bases.flatMap(
                (base) =>
                  registryItems.find(({ name }) => name === base)?.title ?? []
              )
              return (
                <li key={item.name} className="flex flex-col gap-0.5">
                  <Link
                    href={item.href}
                    className="group flex flex-col gap-2 rounded-xl focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <Image
                      src={`/diseases/${item.name}.webp`}
                      width={640}
                      height={480}
                      alt=""
                      sizes="(min-width: 1280px) 14rem, (min-width: 640px) 30vw, 50vw"
                      className="aspect-[4/3] w-full rounded-xl bg-muted/40 object-contain transition-transform group-hover:scale-[1.03]"
                    />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                  {bases.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      On the{" "}
                      {bases
                        .map((title) => title.toLowerCase())
                        .join(" and the ")}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
      <DocsPager href={diseasesPage.href} />
    </div>
  )
}
