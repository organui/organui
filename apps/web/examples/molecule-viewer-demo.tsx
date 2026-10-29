"use client"
import { MoleculeViewer } from "@workspace/registry/molecule-viewer"

export function Example() {
  return (
    <div className="flex w-full flex-col gap-3">
      <MoleculeViewer
        src="/models/crambin.pdb"
        label="Interactive crambin structure"
      />
      <p className="text-xs text-muted-foreground">
        Crambin, PDB 1CRN (Hendrickson and Teeter), CC0.
      </p>
    </div>
  )
}
