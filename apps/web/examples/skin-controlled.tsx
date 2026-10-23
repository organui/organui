"use client"

import { useState } from "react"
import { Skin, skinModel } from "@workspace/registry/skin"

export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = skinModel.structures.find(({ id }) => id === selectedId)
  return (
    <div className="flex flex-col gap-3">
      <Skin
        label="Skin controlled selection example"
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
      />
      <p role="status" className="text-sm text-muted-foreground">
        {selected ? `Selected: ${selected.label}` : "Select a structure in 3D."}
      </p>
    </div>
  )
}
