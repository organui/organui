"use client"
import { useState } from "react"
import { DnaHelix } from "@workspace/registry/dna-helix"

// The default: buttons on the stage and the strands below it.
export function Example() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  return (
    <DnaHelix
      label="DNA helix with its strands"
      sequence="ATGCGTACCTGAGCTTAACGGATC"
      selectedIndex={selectedIndex}
      onSelectionChange={setSelectedIndex}
    />
  )
}
