"use client"

import { useState } from "react"
import { Hair, hairModel } from "@workspace/registry/hair"

export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = hairModel.structures.find(({ id }) => id === selectedId)
  return (
    <div className="flex flex-col gap-3">
      <Hair
        label="Hair controlled selection example"
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
      />
      <p role="status" className="text-sm text-muted-foreground">
        {selected ? `Selected: ${selected.label}` : "Select a structure in 3D."}
      </p>
    </div>
  )
}
