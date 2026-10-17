"use client"

import { useState, type ComponentType } from "react"
import { anatomyExampleData as data } from "@/lib/examples"
import { AnatomyTree } from "@workspace/registry/anatomy-tree"
import { OrganPreview } from "@/components/organ-preview"

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

function OrganViewerPreview() {
  return <OrganPreview name="heart" organ="Heart" />
}

// Live previews on the registry index, keyed by registry item name. The
// browser suite requires one for every catalog item.
const previews: Record<string, ComponentType> = {
  "anatomy-tree": AnatomyTreePreview,
  "organ-viewer": OrganViewerPreview,
}

export function RegistryPreview({
  name,
  title,
  organ,
}: {
  name: string
  title: string
  organ: boolean
}) {
  const Preview = previews[name]
  if (!organ && !Preview) return null
  return (
    <div
      role="region"
      aria-label={`${title} preview`}
      className="rounded-lg border bg-muted/30 p-4"
    >
      {organ ? (
        <OrganPreview name={name} organ={title} />
      ) : (
        Preview && <Preview />
      )}
    </div>
  )
}
