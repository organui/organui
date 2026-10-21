"use client"
import { useState } from "react"
import { AnatomyTree } from "@workspace/registry/anatomy-tree"
import { anatomyExampleData as data } from "@/lib/examples"

// Visibility starts with the right heart hidden; its branch shows as mixed.
export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [visibility, setVisibility] = useState<Record<string, boolean>>({
    ra: false,
    rv: false,
  })
  return (
    <AnatomyTree
      data={data}
      selectedId={selectedId}
      onSelectionChange={setSelectedId}
      visibility={visibility}
      onVisibilityChange={setVisibility}
      defaultExpandedIds={["heart", "left", "right"]}
      label="Heart, right side hidden"
      className="w-full max-w-sm"
    />
  )
}
