import { ComponentPreview } from "@/components/component-preview"
import { ComponentInstallation } from "@/components/component-installation"
import { CodeSnippet } from "@/components/code-snippet"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import { PropsTable } from "@/components/props-table"
import { ExampleSection } from "@/components/component-examples"
import { componentExamples } from "@/lib/component-examples"
import Link from "next/link"
import { docsMetadata, organsPage, shadcn } from "@/lib/registry"
import { site } from "@/lib/site"

export const metadata = docsMetadata(
  "Organ viewer",
  "The three.js stage every OrganUI organ is built on: any GLB anatomy model with selection, ghosting, named views and accessible controls.",
  "/docs/components/organ-viewer"
)

const component = `// A ready-made organ: one file, the heart's model passed to the viewer.
import { Heart } from "@/components/heart"

<Heart />

// The same viewer with a model of your own.
import { OrganViewer } from "@/components/organ-viewer"

<OrganViewer model={kidneyModel} />`

const model = `import type { OrganModel } from "@/components/organ-viewer"

export const kidneyModel: OrganModel = {
  name: "Kidney",
  src: "/models/kidney.glb",
  defaultView: "Anterior",
  views: [{ name: "Anterior", direction: [0, 0, 1] }],
  structures: [
    // id is the mesh name, or userData.structureId, in the GLB.
    { id: "cortex", label: "Renal cortex", group: "Kidney", color: "#b5685f" },
    { id: "medulla", label: "Renal medulla", group: "Kidney", color: "#8f4a46" },
  ],
  attribution: {
    credit: "Your model credit.",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    source: "https://example.com/model",
  },
}`

const views = `export const kidneyModel: OrganModel = {
  // …
  defaultView: "Anterior",
  views: [
    { name: "Anterior", direction: [0, 0, 1] },
    { name: "Posterior", direction: [0, 0, -1] },
    // Frames only the medulla, from the front.
    { name: "Medulla", direction: [0, 0, 1], structureIds: ["medulla"] },
  ],
}`

const render = `import { OrganViewer } from "@/components/organ-viewer"
import { kidneyModel } from "@/lib/kidney-model"

export function KidneyViewer() {
  return <OrganViewer model={kidneyModel} label="Kidney" />
}`

const handle = `const viewer = useRef<OrganViewerHandle>(null)
// viewer.current?.setView("Posterior")
// viewer.current?.zoom(0.85)   // below 1 zooms in
// viewer.current?.rotate(0.2)  // radians around the target
// viewer.current?.reset()
<OrganViewer ref={viewer} model={kidneyModel} controls={false} />`

const examples = Object.fromEntries(
  componentExamples["organ-viewer"]!.map((example) => [example.name, example])
)

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href="/docs/components/organ-viewer" title="Organ viewer">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          The 3D stage every OrganUI organ is built on. Give it a GLB and a
          description of its structures; it handles loading, framing, picking
          and emphasis.
        </p>
      </DocsHeader>
      <ComponentPreview name="organ-viewer-demo" hideCode />
      <p>
        <Link href={organsPage.href} className="underline">
          Browse all {organsPage.title.toLowerCase()}
        </Link>
        , each ready to install.
      </p>
      <section className="flex flex-col gap-4">
        <DocsHeading id="component">Component</DocsHeading>
        <p>
          Most apps install a ready-made organ, such as the{" "}
          <Link href="/docs/components/heart" className="underline">
            heart
          </Link>
          . Each organ is one file: its model&apos;s description passed to the
          organ viewer, which installs with it as a dependency, the way
          shadcn&apos;s <code>chart</code> installs with each chart. The
          organ&apos;s page shows its examples and props.
        </p>
        <p>
          Use the organ viewer directly to show a model OrganUI does not ship.
          The rest of this page is about that.
        </p>
        <CodeSnippet label="Organ and viewer example" code={component} />
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="installation">Installation</DocsHeading>
        <p>
          Installing an organ brings the viewer with it. To bring your own
          model, install the viewer alone:
        </p>
        <ComponentInstallation
          name="organ-viewer"
          command={`bunx ${shadcn} add ${site.url}/r/organ-viewer.json`}
        />
        <p className="text-sm text-muted-foreground">
          The source installs into your components directory and adds three.js,
          plus shadcn&apos;s <code>alert</code>, <code>button</code>,{" "}
          <code>popover</code>, <code>progress</code>, <code>select</code> and{" "}
          <code>tooltip</code> for its controls. Its toolbar composes them with
          Base UI&apos;s <code>render</code> prop;{" "}
          <Link href="/docs/base-ui" className="underline">
            Radix projects
          </Link>{" "}
          get a copy built on <code>asChild</code>. It uses your theme tokens
          and installs no global styles.
        </p>
        <a className="underline" href="/r/organ-viewer.json">
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="your-first-model">Your First Model</DocsHeading>
        <p>
          A model is a GLB and a description of what is in it. Here is a kidney,
          step by step.
        </p>
        <DocsHeading id="describe-the-structures" level={3}>
          Describe the structures
        </DocsHeading>
        <p>
          Point <code>src</code> at the GLB, served from your origin or with
          CORS, and list its structures. Every model needs at least one view;
          the next step adds more. Every structure must exist in the file,
          matched by mesh name or <code>userData.structureId</code> on the mesh
          or one of its parents; otherwise the viewer reports that the model is
          incomplete. <code>group</code> gathers structures in the anatomy tree,
          and <code>color</code> is the structure&apos;s own colour. The viewer
          shows the attribution&apos;s credit and licence.
        </p>
        <CodeSnippet label="Model description example" code={model} />
        <DocsHeading id="add-views" level={3}>
          Add views
        </DocsHeading>
        <p>
          Named views fill the toolbar&apos;s menu, and <code>defaultView</code>{" "}
          is the one shown first. Directions point from the model towards the
          camera, with +x the patient&apos;s left, +y superior and +z anterior.
          A view with <code>structureIds</code> frames only those structures.
        </p>
        <CodeSnippet label="Views example" code={views} />
        <DocsHeading id="render-it" level={3}>
          Render it
        </DocsHeading>
        <p>
          Pass the model to the viewer. <code>label</code> names the stage for
          assistive technology.
        </p>
        <CodeSnippet label="Render example" code={render} />
      </section>
      <ExampleSection example={examples["organ-viewer-models"]!}>
        <p>
          A new model is a new file to load, so give the viewer a{" "}
          <code>key</code> per model. The toolbar offers the model&apos;s named
          views, zoom and reset; <code>controls=&#123;false&#125;</code> hides
          it, as the demo at the top does.
        </p>
      </ExampleSection>
      <section className="flex flex-col gap-4">
        <DocsHeading id="selection-and-visibility">
          Selection and visibility
        </DocsHeading>
        <p>
          Selection and visibility are controlled, with the same contract as the
          anatomy tree: pass <code>selectedId</code> and a visibility map where
          missing IDs are visible, and update them from{" "}
          <code>onSelectionChange</code>. A selected structure glows in its own
          colour while everything else is ghosted, so it stays visible even
          inside other anatomy. Clicks on a ghost prefer the solid structure
          behind it. <code>organAnatomyNodes(model)</code> builds anatomy tree
          data from the model&apos;s groups, and{" "}
          <code>organDefaultVisibility(model)</code> returns its initial
          visibility. The heart&apos;s page shows{" "}
          <Link
            href="/docs/components/heart#controlled-selection"
            className="underline"
          >
            controlled selection
          </Link>{" "}
          and{" "}
          <Link
            href="/docs/components/heart#with-anatomy-panel"
            className="underline"
          >
            an anatomy panel
          </Link>
          .
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="views-and-controls">Views and controls</DocsHeading>
        <p>
          Each named view fits the model to 80% of the stage from its direction.
          Rotating leaves the named view, and <code>onViewChange</code> reports{" "}
          <code>null</code>; zooming does not. Pass{" "}
          <code>controls=&#123;false&#125;</code> to hide the view menu, zoom
          and reset buttons, and drive the viewer from your own UI through its
          ref.
        </p>
        <CodeSnippet label="Imperative handle example" code={handle} />
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="accessibility">Accessibility</DocsHeading>
        <p>
          Drag or the arrow keys rotate; scroll, pinch, plus and minus zoom.
          Motion damping is off when the user prefers reduced motion.
        </p>
        <p className="text-sm text-muted-foreground">
          WebGL is required. When it cannot start, or the model cannot load, the
          viewer shows a message with a retry button; keep a text alternative
          such as the anatomy tree alongside it.
        </p>
      </section>
      <PropsTable item="organ-viewer" />
      <DocsPager href="/docs/components/organ-viewer" />
    </div>
  )
}
