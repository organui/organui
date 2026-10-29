"use client"

import { useState } from "react"
import { Thyroid, thyroidModel } from "@workspace/registry/thyroid"

export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = thyroidModel.structures.find(({ id }) => id === selectedId)
  return (
    <div className="flex flex-col gap-3">
      <Thyroid
        label="Thyroid controlled selection example"
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
      />
      <p role="status" className="text-sm text-muted-foreground">
        {selected ? `Selected: ${selected.label}` : "Select a structure in 3D."}
      </p>
    </div>
  )
}
