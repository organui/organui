"use client"
import { useState } from "react"
import {
  MoleculeViewer,
  residueLabel,
  type MoleculeResidue,
} from "@workspace/registry/molecule-viewer"

// The callback gives the residue's ID and record, here shown as your app's state.
export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [residue, setResidue] = useState<MoleculeResidue | null>(null)
  const viewer = (
    <MoleculeViewer
      src="/models/crambin.pdb"
      selectedId={selectedId}
      onSelectionChange={(id, picked) => {
        setSelectedId(id)
        setResidue(picked)
      }}
      onLoad={(structure) =>
        setResidue(
          structure.residues.find(({ id }) => id === selectedId) ?? null
        )
      }
      label="Crambin with residue selection"
    />
  )
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_16rem]">
      {viewer}
      <div className="rounded-xl border bg-muted/30 p-5">
        <h2 className="mb-3 font-medium">Your app state</h2>
        <p className="text-sm text-muted-foreground">
          Pick a residue on the model or in the sequence. The callback gives its
          ID and record.
        </p>
        <p className="mt-5 text-sm" role="status">
          Selected: {selectedId ?? "none"}
        </p>
        {residue && (
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            <dt className="text-muted-foreground">Residue</dt>
            <dd>{residueLabel(residue)}</dd>
            <dt className="text-muted-foreground">Structure</dt>
            <dd className="capitalize">{residue.secondary}</dd>
            <dt className="text-muted-foreground">Atoms</dt>
            <dd>{residue.atoms.length}</dd>
          </dl>
        )}
      </div>
    </div>
  )
}
