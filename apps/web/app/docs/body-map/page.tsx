import { ComponentPreview } from "@/components/component-preview"
import {
  codeBlock,
  docsMetadata,
  registryNamespace,
  shadcn,
} from "@/lib/registry"
import { site } from "@/lib/site"

export const metadata = docsMetadata(
  "Body map",
  "An accessible front and back body map for recording where a patient has pain or symptoms.",
  "/docs/body-map"
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
      <header className="flex flex-col gap-4">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Components / Forms
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Body map</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          A front and back outline of the body for recording where pain or
          symptoms are. Each region is a checkbox, so it works with a mouse, a
          touch screen, a keyboard and a screen reader.
        </p>
      </header>
      <ComponentPreview name="body-map-demo" />
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
          {`bunx ${shadcn} add ${site.url}/r/body-map.json`}
        </pre>
        <p>
          To install by name, add the OrganUI namespace to{" "}
          <code>components.json</code> and run{" "}
          <code>bunx {shadcn} add @organui/body-map</code>, or install from
          GitHub with <code>bunx {shadcn} add organui/organui/body-map</code>.
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
          shadcn&apos;s <code>button</code> if you do not have it yet. The body
          is inline SVG drawn with your theme tokens; there are no images, 3D
          packages or global styles.
        </p>
        <a className="underline" href="/r/body-map.json">
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
        <h2 className="text-2xl font-semibold">Keyboard and screen readers</h2>
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
        <h2 className="text-2xl font-semibold">Customize</h2>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Custom regions example"
          className={codeBlock}
        >
          {custom}
        </pre>
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
    </div>
  )
}
