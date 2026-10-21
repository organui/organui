"use client"
import { MoleculeViewer } from "@workspace/registry/molecule-viewer"

// Atoms as spheres, coloured by element, without the sequence.
export function Example() {
  return (
    <MoleculeViewer
      src="/models/crambin.pdb"
      defaultRepresentation="spacefill"
      defaultColorScheme="element"
      sequence={false}
      label="Crambin as spacefill"
    />
  )
}
