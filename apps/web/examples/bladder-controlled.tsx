"use client"

import { useState } from "react"
import { Bladder, bladderModel } from "@workspace/registry/bladder"

export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = bladderModel.structures.find(({ id }) => id === selectedId)
  return (
    <div className="flex flex-col gap-3">
      <Bladder
        label="Bladder controlled selection example"
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
