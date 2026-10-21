import { ComponentPreview } from "@/components/component-preview"
import { ComponentInstallation } from "@/components/component-installation"
import { CodeSnippet } from "@/components/code-snippet"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import { PropsTable } from "@/components/props-table"
import Link from "next/link"
import { OrganExamples } from "@/components/organ-examples"
import { docsMetadata, registryItems, shadcn } from "@/lib/registry"
import { site } from "@/lib/site"

export const metadata = docsMetadata(
  "Organ viewer",
  "A three.js viewer for GLB anatomy models with selection, ghosting, named views and accessible controls.",
  "/docs/components/organ-viewer"
)

const model = `import type { OrganModel } from "@/components/organ-viewer"

export const kidneyModel: OrganModel = {
  name: "Kidney",
  src: "/models/kidney.glb",
  defaultView: "Anterior",
  views: [
    { name: "Anterior", direction: [0, 0, 1] },
    { name: "Posterior", direction: [0, 0, -1] },
  ],
  structures: [
    // id is the mesh name, or userData.structureId, in the GLB.
    { id: "cortex", label: "Renal cortex", group: "Kidney", color: "#b5685f" },
  ],
  attribution: {
    credit: "Your model credit.",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    source: "https://example.com/model",
  },
}`

const handle = `const viewer = useRef<OrganViewerHandle>(null)
// viewer.current?.setView("Posterior")
// viewer.current?.zoom(0.85)   // below 1 zooms in
// viewer.current?.rotate(0.2)  // radians around the target
// viewer.current?.reset()
<OrganViewer ref={viewer} model={kidneyModel} />`

export default async function Page() {
  const organs = registryItems.filter(({ organ }) => organ)
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href="/docs/components/organ-viewer" title="Organ viewer">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          The 3D stage every OrganUI explorer shares. Give it a GLB and a
          description of its structures; it handles loading, framing, picking
          and emphasis.
        </p>
      </DocsHeader>
      <ComponentPreview name="organ-viewer-demo" />
      <section className="flex flex-col gap-4">
        <DocsHeading id="installation">Installation</DocsHeading>
        <p>
          Most apps want a ready-made organ:{" "}
          {organs.map((item, index) => (
            <span key={item.name}>
              {index > 0 && ", "}
              <Link href={item.href} className="underline">
                {item.title.toLowerCase()}
              </Link>
            </span>
          ))}
          . To bring your own model, install the viewer alone.
        </p>
        <ComponentInstallation
          name="organ-viewer"
          command={`bunx ${shadcn} add ${site.url}/r/organ-viewer.json`}
        />
        <p className="text-sm text-muted-foreground">
          The source installs into your components directory and adds three.js,
          plus shadcn&apos;s <code>alert</code>, <code>button</code>,{" "}
          <code>progress</code>, <code>select</code> and <code>tooltip</code>{" "}
          for its controls. Its toolbar composes them with Base UI&apos;s{" "}
          <code>render</code> prop;{" "}
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
        <DocsHeading id="usage">Usage</DocsHeading>
        <CodeSnippet label="Model description example" code={model} />
        <p>
          Every structure must exist in the GLB, matched by mesh name or{" "}
          <code>userData.structureId</code> on the mesh or one of its parents;
          otherwise the viewer reports that the model is incomplete. View
          directions point from the model towards the camera, with +x the
          patient&apos;s left, +y superior and +z anterior. A view with{" "}
          <code>structureIds</code> frames only those structures.
        </p>
      </section>
      <OrganExamples name="organ-viewer" />
      <section className="flex flex-col gap-4">
        <DocsHeading id="behaviour">Behaviour</DocsHeading>
        <p>
          Selection and visibility are controlled, with the same contract as the
          anatomy tree: pass <code>selectedId</code> and a visibility map where
          missing IDs are visible, and update them from{" "}
          <code>onSelectionChange</code>. A selected structure glows in its own
          colour while everything else is ghosted, so it stays visible even
          inside other anatomy. Clicks on a ghost prefer the solid structure
          behind it.
        </p>
        <p>
          Each named view fits the model to 80% of the stage from its direction.
          Rotating leaves the named view, and <code>onViewChange</code> reports{" "}
          <code>null</code>; zooming does not. Drag or the arrow keys rotate;
          scroll, pinch, plus and minus zoom. Motion damping is off when the
          user prefers reduced motion.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="control-it-from-your-ui">
          Control it from your UI
        </DocsHeading>
        <CodeSnippet label="Imperative handle example" code={handle} />
        <p>
          Pass <code>controls=&#123;false&#125;</code> to hide the built-in view
          menu, zoom and reset buttons. <code>organAnatomyNodes(model)</code>{" "}
          builds anatomy tree data from the model&apos;s groups, and{" "}
          <code>organDefaultVisibility(model)</code> returns its initial
          visibility.
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
