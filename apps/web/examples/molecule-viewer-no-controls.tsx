"use client"
import { MoleculeViewer } from "@workspace/registry/molecule-viewer"

// Only the structure: no menus, buttons or sequence. It still rotates.
export function Example() {
  return (
    <MoleculeViewer
      src="/models/crambin.pdb"
      defaultColorScheme="rainbow"
      controls={false}
      sequence={false}
      label="Crambin, without controls"
    />
  )
}
