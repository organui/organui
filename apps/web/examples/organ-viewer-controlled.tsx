"use client"

import { heartModel } from "@workspace/registry/heart"
import { useState } from "react"
import { OrganViewer } from "@workspace/registry/organ-viewer"

const model = heartModel

export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = model.structures.find(({ id }) => id === selectedId)
  return (
    <div className="flex flex-col gap-3">
      <OrganViewer
        model={model}
        label={`${model.name} controlled selection example`}
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
      />
      <p role="status" className="text-sm text-muted-foreground">
        {selected ? `Selected: ${selected.label}` : "Select a structure in 3D."}
      </p>
    </div>
  )
}
