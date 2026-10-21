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

const description =
  "An accessible anatomy tree component for selecting structures and controlling visibility in healthcare interfaces."

export const metadata = docsMetadata(
  "Anatomy tree",
  description,
  "/docs/components/anatomy-tree"
)
const usage = `"use client"
import { useState } from "react"
import { AnatomyTree } from "@/components/ui/anatomy-tree"

const data = [{ id: "heart", label: "Heart", children: [
  { id: "lv", label: "Left ventricle" }
]}]

export function Panel() {
  const [selectedId, select] = useState<string | null>(null)
  const [visibility, show] = useState<Record<string, boolean>>({})
  return <AnatomyTree data={data}
    selectedId={selectedId} onSelectionChange={select}
    visibility={visibility} onVisibilityChange={show}
    defaultExpandedIds={["heart"]} />
}`
export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href="/docs/components/anatomy-tree" title="Anatomy tree">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          A searchable hierarchy for selecting structures and controlling what
          your viewer shows. Bring your own data and rendering engine.
        </p>
      </DocsHeader>
      <ComponentPreview name="anatomy-tree-demo" />
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
          name="anatomy-tree"
          command={`bunx ${shadcn} add ${site.url}/r/anatomy-tree.json`}
        />
        <p>
          Or by name: <code>bunx {shadcn} add @organui/anatomy-tree</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          The source installs into your configured UI directory, along with
          shadcn&apos;s <code>button</code>, <code>input</code>,{" "}
          <code>field</code> and <code>empty</code> if you do not have them yet.
          It uses your existing theme tokens; it installs no global styles or 3D
          packages. Tested configurations are documented in the repository.
        </p>
        <a className="underline" href="/r/anatomy-tree.json">
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="usage">Usage</DocsHeading>
        <CodeSnippet label="State wiring example" code={usage} />
        <p>
          Use globally unique, nonempty IDs that remain stable between renders.
          Duplicate IDs throw an error. Labels may repeat. Selection is
          controlled: Enter or a label click emits an ID; navigation never
          changes selection. Keep the selected ID in your own state and use it
          to highlight your viewer.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="visibility-and-search">
          Visibility and search
        </DocsHeading>
        <p>
          Visibility is controlled by a map of leaf IDs to booleans. Missing
          leaves are visible. Branches summarize their leaves as visible,
          hidden, or mixed. Space or the visibility button hides all descendants
          when all are visible; otherwise it shows them all. This includes
          descendants hidden by search or collapsed branches. Branch IDs in the
          map do not override their leaves.
        </p>
        <p>
          Search matches labels without case sensitivity, showing matches and
          their ancestors. Matching branches do not automatically include
          nonmatching children. Search temporarily expands results and disables
          collapse; clearing it restores your previous expansion. Selection
          remains unchanged even when its row is filtered out.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="accessibility">Accessibility</DocsHeading>
        <p>
          Tab enters the search field, then the tree as one tab stop. Up/Down
          move between visible rows; Home/End move to the first/last row. Right
          expands a branch or enters its first child. Left collapses a branch or
          moves to its parent. Enter selects; Space changes visibility.
          Selection and checked visibility are exposed separately to assistive
          technology.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="data-updates">Data updates</DocsHeading>
        <p>
          Data updates retain state by ID. If the focused row disappears, focus
          returns to a visible ancestor or the first row; an empty result
          returns focus to search. Removed selected IDs are not automatically
          cleared: reconcile controlled state in your application. Visibility
          callbacks remove IDs absent from the current dataset. New leaves
          default to visible. Expansion defaults apply only on mount; use a
          React key to reset the component.
        </p>
        <p>
          When <code>selectedId</code> changes to a row that is not shown, for
          example after a pick in your 3D viewer, the tree expands its ancestors
          and scrolls the row into view within its scrolling container, without
          moving the page. Mark a grouping with <code>selectable: false</code>{" "}
          when it has no single structure to select: clicking or pressing Enter
          on it expands or collapses it instead. Give any node a{" "}
          <code>color</code> to show a matching swatch before its label.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="customize">Customize</DocsHeading>
        <p>
          Set <code>label</code> for the accessible tree name and search label,{" "}
          <code>className</code> for the outer container, and{" "}
          <code>defaultExpandedIds</code> for initial expansion. Edit the
          installed source for row styling. Semantic background, foreground,
          muted, accent, border, and ring tokens come from your theme. No theme
          values are overwritten.
        </p>
        <p className="text-sm text-muted-foreground">
          Designed for small to medium in-memory trees. No virtualization, lazy
          loading, drag and drop, multiselection, or viewer implementation.
          Built on shadcn&apos;s components, with a copy for{" "}
          <Link href="/docs/base-ui" className="underline">
            Radix projects
          </Link>
          . Keyboard/browser checks do not replace a screen-reader usability
          audit.
        </p>
      </section>
      <ComponentExamples examples={componentExamples["anatomy-tree"]!} />
      <PropsTable item="anatomy-tree" />
      <DocsPager href="/docs/components/anatomy-tree" />
    </div>
  )
}
