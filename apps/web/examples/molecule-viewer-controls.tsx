"use client"
import { MoleculeViewer } from "@workspace/registry/molecule-viewer"

// The default: style and colour menus, zoom and reset, and the sequence.
export function Example() {
  return (
    <MoleculeViewer
      src="/models/crambin.pdb"
      label="Crambin with controls and sequence"
    />
  )
}
