"use client"

// Also install @organui/anatomy-tree.
import { useState } from "react"
import { AnatomyTree } from "@workspace/registry/anatomy-tree"
import { Stomach, stomachModel } from "@workspace/registry/stomach"
import {
  organAnatomyNodes,
  organDefaultVisibility,
} from "@workspace/registry/organ-viewer"

const data = organAnatomyNodes(stomachModel)

export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [visibility, setVisibility] = useState(() =>
    organDefaultVisibility(stomachModel)
  )
  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <Stomach
        label="Stomach with anatomy example"
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
        visibility={visibility}
      />
      <AnatomyTree
        label="Stomach anatomy"
        data={data}
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
        visibility={visibility}
        onVisibilityChange={setVisibility}
        defaultExpandedIds={
          stomachModel.structures.length <= 40 ? data.map(({ id }) => id) : []
        }
        className="max-h-[28rem] min-w-0 overflow-auto"
      />
    </div>
  )
}
