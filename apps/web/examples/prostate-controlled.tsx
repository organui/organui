"use client"

import { useState } from "react"
import { Prostate, prostateModel } from "@workspace/registry/prostate"

export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = prostateModel.structures.find(({ id }) => id === selectedId)
  return (
    <div className="flex flex-col gap-3">
      <Prostate
        label="Prostate controlled selection example"
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
      />
      <p role="status" className="text-sm text-muted-foreground">
        {selected ? `Selected: ${selected.label}` : "Select a structure in 3D."}
      </p>
    </div>
  )
}
