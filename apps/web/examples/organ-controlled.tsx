"use client"

import { useState } from "react"
import {
  OrganViewer,
  type OrganModel,
} from "@workspace/registry/organ-viewer/organ-viewer"

export function Example({ model }: { model: OrganModel }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = model.structures.find(({ id }) => id === selectedId)
  return (
    <div className="flex flex-col gap-3">
      <OrganViewer
        model={model}
        label={`${model.name} controlled selection example`}
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
        className="h-[28rem]"
      />
      <p role="status" className="text-sm text-muted-foreground">
        {selected ? `Selected: ${selected.label}` : "Select a structure in 3D."}
      </p>
    </div>
  )
}
