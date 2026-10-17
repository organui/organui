"use client"
import { useState } from "react"
import {
  DermatomeMap,
  type DermatomeId,
} from "@workspace/registry/dermatome-map"

export function Example() {
  const [selectedId, setSelectedId] = useState<DermatomeId | null>("C6")
  return (
    <div className="flex flex-col gap-3">
      <DermatomeMap selectedId={selectedId} onSelectionChange={setSelectedId} />
      <p className="text-xs text-muted-foreground">
        A simplified, original illustration. Dermatomes overlap and vary between
        people and between published charts; this is not a clinical tool.
      </p>
    </div>
  )
}
