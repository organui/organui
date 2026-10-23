"use client"

// Also install @organui/anatomy-tree.
import { useState } from "react"
import { AnatomyTree } from "@workspace/registry/anatomy-tree"
import { Eye, eyeModel } from "@workspace/registry/eye"
import {
  organAnatomyNodes,
  organDefaultVisibility,
} from "@workspace/registry/organ-viewer"

const data = organAnatomyNodes(eyeModel)

export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [visibility, setVisibility] = useState(() =>
    organDefaultVisibility(eyeModel)
  )
  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <Eye
        label="Eye with anatomy example"
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
        visibility={visibility}
      />
      <AnatomyTree
        label="Eye anatomy"
        data={data}
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
        visibility={visibility}
        onVisibilityChange={setVisibility}
        defaultExpandedIds={
          eyeModel.structures.length <= 40 ? data.map(({ id }) => id) : []
        }
        className="max-h-[28rem] min-w-0 overflow-auto"
      />
    </div>
  )
}
