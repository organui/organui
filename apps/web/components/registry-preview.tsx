"use client"

import { useState, type ComponentType } from "react"
import { anatomyExampleData as data } from "@/lib/examples"
import { AnatomyTree } from "@workspace/registry/anatomy-tree"

function AnatomyTreePreview() {
  const [selectedId, setSelectedId] = useState<string | null>("lv")
  const [visibility, setVisibility] = useState<Record<string, boolean>>({})
  return (
    <AnatomyTree
      data={data}
      selectedId={selectedId}
      onSelectionChange={setSelectedId}
      visibility={visibility}
      onVisibilityChange={setVisibility}
      defaultExpandedIds={["heart", "left", "right"]}
      className="mx-auto max-w-md"
    />
  )
}

// Live previews on the registry index, keyed by registry item name. The
// browser suite requires one for every catalog item.
const previews: Record<string, ComponentType> = {
  "anatomy-tree": AnatomyTreePreview,
}

export function RegistryPreview({
  name,
  title,
}: {
  name: string
  title: string
}) {
  const Preview = previews[name]
  if (!Preview) return null
  return (
    <div
      role="region"
      aria-label={`${title} preview`}
      className="rounded-lg border bg-muted/30 p-4"
    >
      <Preview />
    </div>
  )
}
