"use client"
import { useState } from "react"
import { DnaHelix } from "@workspace/registry/dna-helix"

export function Example() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  return (
    <DnaHelix
      sequence="ATGCGTACCTGAGCTTAACGGATC"
      selectedIndex={selectedIndex}
      onSelectionChange={setSelectedIndex}
    />
  )
}
