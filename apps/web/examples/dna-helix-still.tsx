"use client"
import { DnaHelix } from "@workspace/registry/dna-helix"

// A still helix without the strands below, as an illustration.
export function Example() {
  return (
    <DnaHelix
      sequence="GATTACAGATTACA"
      autoRotate={false}
      strands={false}
      label="A still DNA helix"
    />
  )
}
