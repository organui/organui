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
  "Body map",
  "An accessible front and back body map for recording where a patient has pain or symptoms.",
  "/docs/components/body-map"
)

const usage = `"use client"
import { useState } from "react"
import { BodyMap } from "@/components/ui/body-map"

export function PainLocation() {
  const [regions, setRegions] = useState<string[]>([])
  return (
    <form action="/symptoms">
      <BodyMap
        label="Where does it hurt?"
        value={regions}
        onValueChange={setRegions}
        name="regions"
      />
      <button type="submit">Save</button>
    </form>
  )
}`

const custom = `import { BodyMap, bodyMapRegions } from "@/components/ui/body-map"

// Translate labels, or drop regions you do not record.
const regions = bodyMapRegions
  .filter(({ view }) => view === "front")
  .map((region) => ({ ...region, label: translate(region.label) }))

<BodyMap regions={regions} views={["front"]} value={value}
  onValueChange={(ids) => setValue(ids.slice(-1))} />`

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href="/docs/components/body-map" title="Body map">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          A front and back outline of the body for recording where pain or
          symptoms are. Each region is a checkbox, so it works with a mouse, a
          touch screen, a keyboard and a screen reader.
        </p>
      </DocsHeader>
      <ComponentPreview name="body-map-demo" />
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
          name="body-map"
          command={`bunx ${shadcn} add ${site.url}/r/body-map.json`}
        />
        <p>
          Or by name: <code>bunx {shadcn} add @organui/body-map</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          The source installs into your configured UI directory, along with
          shadcn&apos;s <code>button</code> if you do not have it yet. The body
          is inline SVG drawn with your theme tokens; there are no images, 3D
          packages or global styles.
        </p>
        <a className="underline" href="/r/body-map.json">
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="usage">Usage</DocsHeading>
        <CodeSnippet label="State wiring example" code={usage} />
        <p>
          Selection is controlled. <code>value</code> is the list of selected
          region IDs in the order they were picked, and{" "}
          <code>onValueChange</code> receives the next list. IDs that are not
          among the regions are dropped from that list. With <code>name</code>,
          each selected ID is submitted as a hidden input, so a plain form posts{" "}
          <code>regions=right-knee&amp;regions=…</code>.
        </p>
        <p>
          Sides are the patient&apos;s. From the front, the patient&apos;s right
          is on the viewer&apos;s left; from the back it is on the viewer&apos;s
          right. Small R and L markers beside each view say so. Front and back
          regions have separate IDs, such as <code>right-knee</code> and{" "}
          <code>right-knee-back</code>.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="accessibility">Accessibility</DocsHeading>
        <p>
          Each view is one tab stop. Arrow keys move to the nearest region in
          that direction, Home and End jump to the first and last region, and
          Space or Enter selects or clears the focused region. Regions are
          announced by name with their checked state, and a status line counts
          the selection. Selected regions are also listed as buttons that remove
          them, which is the quickest way to undo a pick on a small screen.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="customize">Customize</DocsHeading>
        <CodeSnippet label="Custom regions example" code={custom} />
        <p>
          <code>bodyMapRegions</code> exports the default regions. Pass your own
          list to <code>regions</code> to rename, remove or redraw them; paths
          share a 200 by 440 coordinate space and paired shapes set{" "}
          <code>mirrored</code> to reflect across the midline. Use{" "}
          <code>views</code> to show one side, <code>label</code> for the
          group&apos;s accessible name and <code>className</code> for the outer
          container. To allow one region only, keep the last ID as shown above.
          Edit the installed source to shade regions by severity.
        </p>
        <p className="text-sm text-muted-foreground">
          The outline and regions were drawn for this component as a simplified,
          non-clinical diagram. They do not follow a validated pain-drawing
          instrument or dermatome boundaries.
        </p>
      </section>
      <ComponentExamples examples={componentExamples["body-map"]!} />
      <PropsTable item="body-map" />
      <DocsPager href="/docs/components/body-map" />
    </div>
  )
}
