"use client"

import { useState } from "react"
import { Heart, heartModel } from "@workspace/registry/heart"

export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = heartModel.structures.find(({ id }) => id === selectedId)
  return (
    <div className="flex flex-col gap-3">
      <Heart
        label="Heart controlled selection example"
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
      />
      <p role="status" className="text-sm text-muted-foreground">
        {selected ? `Selected: ${selected.label}` : "Select a structure in 3D."}
      </p>
    </div>
  )
}
