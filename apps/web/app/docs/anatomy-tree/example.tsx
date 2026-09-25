"use client"
import { useState } from "react"
import { AnatomyTree, type AnatomyNode } from "@workspace/registry/anatomy-tree"

const data: AnatomyNode[] = [
  {
    id: "heart",
    label: "Heart",
    children: [
      {
        id: "left",
        label: "Left heart",
        children: [
          { id: "la", label: "Left atrium" },
          { id: "lv", label: "Left ventricle" },
        ],
      },
      {
        id: "right",
        label: "Right heart",
        children: [
          { id: "ra", label: "Right atrium" },
          { id: "rv", label: "Right ventricle" },
        ],
      },
    ],
  },
]
export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [visibility, setVisibility] = useState<Record<string, boolean>>({})
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <AnatomyTree
        data={data}
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
        visibility={visibility}
        onVisibilityChange={setVisibility}
        defaultExpandedIds={["heart", "left", "right"]}
      />
      <aside className="rounded-xl border bg-muted/30 p-5">
        <h2 className="mb-3 font-medium">Your viewer state</h2>
        <p className="text-sm text-muted-foreground">
          Select a structure or change its visibility. These callbacks can drive
          your own viewer.
        </p>
        <p className="mt-5 text-sm" role="status">
          Selected: {selectedId ?? "none"}
        </p>
        <pre
          tabIndex={0}
          role="region"
          className="mt-4 overflow-auto rounded-md bg-background p-3 text-xs focus-visible:outline-2 focus-visible:outline-ring"
          aria-label="Visibility state"
        >
          {JSON.stringify(visibility, null, 2)}
        </pre>
        <p className="mt-4 text-xs text-muted-foreground">
          Original, simplified example data. No patient data, models, or
          clinical validation.
        </p>
      </aside>
    </div>
  )
}
