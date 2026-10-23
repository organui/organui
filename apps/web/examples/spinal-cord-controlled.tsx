"use client"

import { useState } from "react"
import { SpinalCord, spinalCordModel } from "@workspace/registry/spinal-cord"

export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = spinalCordModel.structures.find(
    ({ id }) => id === selectedId
  )
  return (
    <div className="flex flex-col gap-3">
      <SpinalCord
        label="Spinal cord controlled selection example"
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
      />
      <p role="status" className="text-sm text-muted-foreground">
        {selected ? `Selected: ${selected.label}` : "Select a structure in 3D."}
      </p>
    </div>
  )
}
