import { ComponentPreview } from "@/components/component-preview"
import { ComponentInstallation } from "@/components/component-installation"
import { CodeSnippet } from "@/components/code-snippet"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import { PropsTable } from "@/components/props-table"
import { ComponentExamples } from "@/components/component-examples"
import { componentExamples } from "@/lib/component-examples"
import Link from "next/link"
import { docsMetadata, shadcn } from "@/lib/registry"
import { site } from "@/lib/site"

export const metadata = docsMetadata(
  "Dermatome map",
  "A front and back body map of the skin each spinal nerve supplies, from C2 to S4-5, with the ISNCSCI key sensory points.",
  "/docs/components/dermatome-map"
)

const usage = `"use client"
import { useState } from "react"
import { DermatomeMap, type DermatomeId } from "@/components/ui/dermatome-map"

export function SensoryExam() {
  const [selectedId, select] = useState<DermatomeId | null>(null)
  return <DermatomeMap selectedId={selectedId} onSelectionChange={select} />
}`

const results = `// Color levels by a sensory score, for example light touch.
const colors = { C6: "var(--destructive)", C7: "oklch(0.8 0.12 85)" }

<DermatomeMap
  selectedId={selectedId}
  onSelectionChange={select}
  colors={colors}
  views={["front"]}
/>`

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href="/docs/components/dermatome-map" title="Dermatome map">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          The skin each spinal nerve supplies, front and back. Pick a level from
          the list or a region on the body to see its area and the key point
          where it is tested.
        </p>
      </DocsHeader>
      <ComponentPreview name="dermatome-map-demo" />
      <section className="flex flex-col gap-4">
        <DocsHeading id="installation">Installation</DocsHeading>
        <p>
          In a project set up as in{" "}
          <Link href="/docs/installation" className="underline">
            Installation
          </Link>
          , run:
        </p>
        <ComponentInstallation
          name="dermatome-map"
          command={`bunx ${shadcn} add ${site.url}/r/dermatome-map.json`}
        />
        <p>
          Or by name: <code>bunx {shadcn} add @organui/dermatome-map</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          The source installs into your configured UI directory, along with
          shadcn&apos;s <code>button</code> if you do not have it yet. The
          figures are inline SVG, so there are no images or 3D packages to load.
        </p>
        <a className="underline" href="/r/dermatome-map.json">
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="usage">Usage</DocsHeading>
        <CodeSnippet label="State wiring example" code={usage} />
        <p>
          Selection is controlled. Levels use the 28 sensory levels of the
          International Standards for Neurological Classification of Spinal Cord
          Injury (ISNCSCI): <code>C2</code> to <code>T12</code>, <code>L1</code>{" "}
          to <code>S3</code> and <code>S4-5</code>. Clicking a region selects
          its level on both sides of the body; Clear selection or Escape emits{" "}
          <code>null</code>. The exported <code>dermatomes</code> array lists
          each level with its region, the area it covers and its key sensory
          point.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="show-results">Show results</DocsHeading>
        <CodeSnippet label="Colors example" code={results} />
        <p>
          Pass <code>colors</code> to fill levels with your own CSS colors, for
          example to show a sensory exam. Levels you leave out keep the default
          palette, one hue per region, which <code>dermatomeColor</code>{" "}
          returns. Set <code>views</code> to show only the front or back, and{" "}
          <code>showLabels</code> to hide the level labels.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="accessibility">Accessibility</DocsHeading>
        <p>
          The level list is one tab stop. Arrow keys move between levels, Home
          and End jump to C2 and S4-5, Enter or Space selects, and Escape clears
          the selection. Moving through the list does not change the selection.
          Each figure is an image with a text alternative; the list is the
          accessible way to choose a level, and hovering either one previews the
          level in both.
        </p>
        <p className="text-sm text-muted-foreground">
          The figures are a simplified illustration drawn for OrganUI, after the
          ISNCSCI key sensory points. Real dermatomes overlap and vary between
          people and between charts, so do not use this map for diagnosis. The
          face and crown are supplied by the trigeminal nerve and are left
          unassigned.
        </p>
      </section>
      <ComponentExamples examples={componentExamples["dermatome-map"]!} />
      <PropsTable item="dermatome-map" />
      <DocsPager href="/docs/components/dermatome-map" />
    </div>
  )
}
