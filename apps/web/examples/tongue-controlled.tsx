"use client"

import { useState } from "react"
import { Tongue, tongueModel } from "@workspace/registry/tongue"

export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = tongueModel.structures.find(({ id }) => id === selectedId)
  return (
    <div className="flex flex-col gap-3">
      <Tongue
        label="Tongue controlled selection example"
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
