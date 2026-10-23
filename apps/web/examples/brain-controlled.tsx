"use client"

import { useState } from "react"
import { Brain, brainModel } from "@workspace/registry/brain"

export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = brainModel.structures.find(({ id }) => id === selectedId)
  return (
    <div className="flex flex-col gap-3">
      <Brain
        label="Brain controlled selection example"
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
      />
      <p role="status" className="text-sm text-muted-foreground">
        {selected ? `Selected: ${selected.label}` : "Select a structure in 3D."}
      </p>
    </div>
  )
}
