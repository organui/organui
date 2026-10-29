"use client"
import { DnaHelix } from "@workspace/registry/dna-helix"

export function Example() {
  return (
    <DnaHelix
      sequence="ATGCGTACCTGAGCTTAACGGATC"
      controls={false}
      strands={false}
    />
  )
}
