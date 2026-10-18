"use client"

import { useState } from "react"
import { Joints, jointsModel } from "@workspace/registry/joints"

export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = jointsModel.structures.find(({ id }) => id === selectedId)
  return (
    <div className="flex flex-col gap-3">
      <Joints
        label="Joints controlled selection example"
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
