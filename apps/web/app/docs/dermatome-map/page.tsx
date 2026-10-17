import { ComponentPreview } from "@/components/component-preview"
import {
  codeBlock,
  docsMetadata,
  registryNamespace,
  shadcn,
} from "@/lib/registry"
import { site } from "@/lib/site"

export const metadata = docsMetadata(
  "Dermatome map",
  "A front and back body map of the skin each spinal nerve supplies, from C2 to S4-5, with the ISNCSCI key sensory points.",
  "/docs/dermatome-map"
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
      <header className="flex flex-col gap-4">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Components / Nervous system
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Dermatome map</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          The skin each spinal nerve supplies, front and back. Pick a level from
          the list or a region on the body to see its area and the key point
          where it is tested.
        </p>
      </header>
      <ComponentPreview name="dermatome-map-demo" />
      <section className="flex flex-col gap-4">
        <h2 id="installation" className="text-2xl font-semibold">
          Installation
        </h2>
        <p>
          In a React 19 project configured with shadcn, Tailwind CSS 4, and the
          Base UI / Nova theme, run the command below.
        </p>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Installation command"
          className={codeBlock}
        >
          {`bunx ${shadcn} add ${site.url}/r/dermatome-map.json`}
        </pre>
        <p>
          To install by name, add the OrganUI namespace to{" "}
          <code>components.json</code> and run{" "}
          <code>bunx {shadcn} add @organui/dermatome-map</code>, or install from
          GitHub with{" "}
          <code>bunx {shadcn} add organui/organui/dermatome-map</code>.
        </p>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Registry namespace configuration"
          className={codeBlock}
        >
          {registryNamespace}
        </pre>
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
        <h2 id="usage" className="text-2xl font-semibold">
          Usage
        </h2>
        <pre
          tabIndex={0}
          role="region"
          aria-label="State wiring example"
          className={codeBlock}
        >
          {usage}
        </pre>
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
        <h2 className="text-2xl font-semibold">Show results</h2>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Colors example"
          className={codeBlock}
        >
          {results}
        </pre>
        <p>
          Pass <code>colors</code> to fill levels with your own CSS colors, for
          example to show a sensory exam. Levels you leave out keep the default
          palette, one hue per region, which <code>dermatomeColor</code>{" "}
          returns. Set <code>views</code> to show only the front or back, and{" "}
          <code>showLabels</code> to hide the level labels.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Keyboard and accessibility</h2>
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
    </div>
  )
}
