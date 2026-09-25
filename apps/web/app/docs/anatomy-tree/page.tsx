import Link from "next/link"
import { Example } from "./example"

export const metadata = { title: "Anatomy tree — OrganUI" }
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
    <main className="mx-auto max-w-5xl space-y-10 px-5 py-10 sm:px-10">
      <header className="space-y-4">
        <Link href="/" className="text-sm text-muted-foreground underline">
          OrganUI
        </Link>
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Components / Anatomy
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Anatomy tree</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          A searchable hierarchy for selecting structures and controlling what
          your viewer shows. Bring your own data and rendering engine.
        </p>
      </header>
      <Example />
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Install</h2>
        <p>
          In a React 19 project configured with shadcn, Tailwind CSS 4, and the
          Base UI / Nova theme, run the command below. Replace REGISTRY_ORIGIN
          with this site’s origin (including https://).
        </p>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Installation command"
          className="overflow-auto rounded-lg border bg-muted/30 p-4 text-sm focus-visible:outline-2 focus-visible:outline-ring"
        >
          bunx shadcn@4.21.0 add REGISTRY_ORIGIN/r/anatomy-tree.json
        </pre>
        <p className="text-sm text-muted-foreground">
          The source installs into your configured UI directory and adds
          @base-ui/react. It uses your existing theme tokens; it installs no
          global styles, registry dependencies, or 3D packages. Tested
          configurations are documented in the repository.
        </p>
        <a className="underline" href="/r/anatomy-tree.json">
          View registry item JSON
        </a>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Connect your state</h2>
        <pre
          tabIndex={0}
          role="region"
          aria-label="State wiring example"
          className="overflow-auto rounded-lg border bg-muted/30 p-4 text-sm focus-visible:outline-2 focus-visible:outline-ring"
        >
          {usage}
        </pre>
        <p>
          Use globally unique, nonempty IDs that remain stable between renders.
          Duplicate IDs throw an error. Labels may repeat. Selection is
          controlled: Enter or a label click emits an ID; navigation never
          changes selection. Keep the selected ID in your own state and use it
          to highlight your viewer.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Visibility and search</h2>
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
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Keyboard and data updates</h2>
        <p>
          Tab enters the search field, then the tree as one tab stop. Up/Down
          move between visible rows; Home/End move to the first/last row. Right
          expands a branch or enters its first child. Left collapses a branch or
          moves to its parent. Enter selects; Space changes visibility.
          Selection and checked visibility are exposed separately to assistive
          technology.
        </p>
        <p>
          Data updates retain state by ID. If the focused row disappears, focus
          returns to a visible ancestor or the first row; an empty result
          returns focus to search. Removed selected IDs are not automatically
          cleared: reconcile controlled state in your application. Visibility
          callbacks remove IDs absent from the current dataset. New leaves
          default to visible. Expansion defaults apply only on mount; use a
          React key to reset the component.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Customize</h2>
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
          loading, drag and drop, multiselection, or viewer implementation. Base
          UI buttons are a direct dependency; compatibility with Radix-based
          presets is not claimed. Keyboard/browser checks do not replace a
          screen-reader usability audit.
        </p>
      </section>
    </main>
  )
}
