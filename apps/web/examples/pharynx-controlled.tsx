"use client"

import { useState } from "react"
import { Pharynx, pharynxModel } from "@workspace/registry/pharynx"

export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = pharynxModel.structures.find(({ id }) => id === selectedId)
  return (
    <div className="flex flex-col gap-3">
      <Pharynx
        label="Pharynx controlled selection example"
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
      />
      <p role="status" className="text-sm text-muted-foreground">
        {selected ? `Selected: ${selected.label}` : "Select a structure in 3D."}
      </p>
    </div>
  )
}
