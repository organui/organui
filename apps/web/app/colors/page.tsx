import type { ReactNode } from "react"
import Link from "next/link"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import registry from "@workspace/registry/registry.json"
import { ColorSwatch } from "@/components/color-swatch"
import { DermatomeSwatches } from "@/components/dermatome-swatches"
import { PageHeader } from "@/components/page-header"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { organModels } from "@/lib/organ-models"
import { docsMetadata, organs } from "@/lib/registry"

export const metadata = docsMetadata(
  "Colours",
  "The colours OrganUI components draw with: severity, dermatome regions and every organ's structures. Click one to copy it.",
  "/colors"
)

const severity = registry.items.find(({ name }) => name === "utilities")
const levels = ["normal", "info", "warning", "critical"] as const

function Palette({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description?: ReactNode
  children: ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="flex scroll-mt-24 flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <h2 id={`${id}-title`} className="text-lg font-semibold tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-10">
        {children}
      </div>
    </section>
  )
}

export default async function Page() {
  const vars = severity && "cssVars" in severity ? severity.cssVars : undefined
  const models = await Promise.all(
    organs.flatMap((organ) => {
      const load = organModels[organ.name]
      return load ? [load().then((model) => ({ organ, model }))] : []
    })
  )
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main id="main" className="flex flex-1 flex-col">
        <PageHeader
          title="Colours"
          description="The colours OrganUI components draw with: severity, dermatome regions and every organ's structures. Click one to copy it."
        >
          <Link
            href="/create"
            className={cn(buttonVariants({ size: "sm" }), "h-[35px] px-4")}
          >
            Create
          </Link>
          <Link
            href="/docs/utilities/severity"
            className={cn(
              buttonVariants({ size: "sm", variant: "secondary" }),
              "h-[35px] px-4"
            )}
          >
            Severity colours
          </Link>
        </PageHeader>
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-12 px-4 pb-16 lg:px-8">
          {vars && (
            <>
              <Palette
                id="severity-light"
                title="Severity, light"
                description="From the severity colours utility. Use them as text-, bg- and border-severity-*."
              >
                {levels.map((level) => (
                  <ColorSwatch
                    key={level}
                    name={level}
                    value={vars.light[`severity-${level}`]}
                  />
                ))}
              </Palette>
              <Palette id="severity-dark" title="Severity, dark">
                {levels.map((level) => (
                  <ColorSwatch
                    key={level}
                    name={level}
                    value={vars.dark[`severity-${level}`]}
                  />
                ))}
              </Palette>
            </>
          )}
          <Palette
            id="dermatomes"
            title="Dermatome regions"
            description="The dermatome map's default fills: one hue per region, alternating lightness by level."
          >
            <DermatomeSwatches />
          </Palette>
          {models.map(({ organ, model }) => (
            <Palette
              key={organ.name}
              id={organ.name}
              title={organ.title}
              description={
                <Link href={organ.href} className="underline">
                  {model.structures.length} structures
                </Link>
              }
            >
              {model.structures.map((structure) => (
                <ColorSwatch
                  key={structure.id}
                  name={structure.label}
                  value={structure.color}
                />
              ))}
            </Palette>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
