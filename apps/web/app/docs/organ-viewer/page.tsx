import Link from "next/link"
import { OrganExplorer } from "@/components/organ-explorer"
import { organModels } from "@/lib/organ-models"
import { codeBlock, docsMetadata, registryItems, shadcn } from "@/lib/registry"
import { site } from "@/lib/site"

export const metadata = docsMetadata(
  "Organ viewer",
  "A three.js viewer for GLB anatomy models with selection, ghosting, named views and accessible controls.",
  "/docs/organ-viewer"
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
  const heart = await organModels.heart!()
  const organs = registryItems.filter(({ organ }) => organ)
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Components / Anatomy
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Organ viewer</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          The 3D stage every OrganUI explorer shares. Give it a GLB and a
          description of its structures; it handles loading, framing, picking
          and emphasis.
        </p>
      </header>
      <OrganExplorer model={heart} />
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Install</h2>
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
        <pre
          tabIndex={0}
          role="region"
          aria-label="Installation command"
          className={codeBlock}
        >
          {`bunx ${shadcn} add ${site.url}/r/organ-viewer.json`}
        </pre>
        <p className="text-sm text-muted-foreground">
          The source installs into your components directory and adds three.js.
          It uses your theme tokens and installs no global styles.
        </p>
        <a className="underline" href="/r/organ-viewer.json">
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Describe a model</h2>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Model description example"
          className={codeBlock}
        >
          {model}
        </pre>
        <p>
          Every structure must exist in the GLB, matched by mesh name or{" "}
          <code>userData.structureId</code> on the mesh or one of its parents;
          otherwise the viewer reports that the model is incomplete. View
          directions point from the model towards the camera, with +x the
          patient&apos;s left, +y superior and +z anterior. A view with{" "}
          <code>structureIds</code> frames only those structures.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Behaviour</h2>
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
        <h2 className="text-2xl font-semibold">Control it from your UI</h2>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Imperative handle example"
          className={codeBlock}
        >
          {handle}
        </pre>
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
    </div>
  )
}
