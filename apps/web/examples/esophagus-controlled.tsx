"use client"

import { useState } from "react"
import { Esophagus, esophagusModel } from "@workspace/registry/esophagus"

export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = esophagusModel.structures.find(({ id }) => id === selectedId)
  return (
    <div className="flex flex-col gap-3">
      <Esophagus
        label="Esophagus controlled selection example"
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
      />
      <p role="status" className="text-sm text-muted-foreground">
        {selected ? `Selected: ${selected.label}` : "Select a structure in 3D."}
      </p>
    </div>
  )
}
