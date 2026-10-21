"use client"
import { useState } from "react"
import {
  DermatomeMap,
  type DermatomeId,
} from "@workspace/registry/dermatome-map"

// The back alone, without labels, for a compact layout.
export function Example() {
  const [selectedId, setSelectedId] = useState<DermatomeId | null>(null)
  return (
    <DermatomeMap
      selectedId={selectedId}
      onSelectionChange={setSelectedId}
      views={["back"]}
      showLabels={false}
      label="Dermatomes, back"
      className="w-full max-w-xs"
    />
  )
}
