"use client"
import { useState } from "react"
import {
  DermatomeMap,
  type DermatomeId,
} from "@workspace/registry/dermatome-map"

// Colours from a sensory examination, such as reduced sensation on the
// left L4 to S1. Illustrative only.
const colors = {
  L4: "var(--color-amber-400)",
  L5: "var(--color-red-500)",
  S1: "var(--color-amber-400)",
}

export function Example() {
  const [selectedId, setSelectedId] = useState<DermatomeId | null>("L5")
  return (
    <DermatomeMap
      selectedId={selectedId}
      onSelectionChange={setSelectedId}
      colors={colors}
      label="Sensory examination"
    />
  )
}
