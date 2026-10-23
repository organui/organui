"use client"

import { useState } from "react"
import { Kidneys, kidneysModel } from "@workspace/registry/kidneys"

export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = kidneysModel.structures.find(({ id }) => id === selectedId)
  return (
    <div className="flex flex-col gap-3">
      <Kidneys
        label="Kidneys controlled selection example"
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
      />
      <p role="status" className="text-sm text-muted-foreground">
        {selected ? `Selected: ${selected.label}` : "Select a structure in 3D."}
      </p>
    </div>
  )
}
