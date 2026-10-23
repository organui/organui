"use client"

import { useState } from "react"
import { Vestibular, vestibularModel } from "@workspace/registry/vestibular"

export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = vestibularModel.structures.find(
    ({ id }) => id === selectedId
  )
  return (
    <div className="flex flex-col gap-3">
      <Vestibular
        label="Vestibular system controlled selection example"
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
      />
      <p role="status" className="text-sm text-muted-foreground">
        {selected ? `Selected: ${selected.label}` : "Select a structure in 3D."}
      </p>
    </div>
  )
}
