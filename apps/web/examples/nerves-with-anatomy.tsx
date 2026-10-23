"use client"

// Also install @organui/anatomy-tree.
import { useState } from "react"
import { AnatomyTree } from "@workspace/registry/anatomy-tree"
import { Nerves, nervesModel } from "@workspace/registry/nerves"
import {
  organAnatomyNodes,
  organDefaultVisibility,
} from "@workspace/registry/organ-viewer"

const data = organAnatomyNodes(nervesModel)

export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [visibility, setVisibility] = useState(() =>
    organDefaultVisibility(nervesModel)
  )
  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <Nerves
        label="Nerves with anatomy example"
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
        visibility={visibility}
      />
      <AnatomyTree
        label="Nerves anatomy"
        data={data}
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
        visibility={visibility}
        onVisibilityChange={setVisibility}
        defaultExpandedIds={
          nervesModel.structures.length <= 40 ? data.map(({ id }) => id) : []
        }
        className="max-h-[28rem] min-w-0 overflow-auto"
      />
    </div>
  )
}
