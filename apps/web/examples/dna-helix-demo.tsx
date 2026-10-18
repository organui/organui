"use client"
import { useId, useState } from "react"
import { DnaHelix } from "@workspace/registry/dna-helix"
import { Input } from "@workspace/ui/components/input"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"

export function Example({ compact = false }: { compact?: boolean }) {
  const [sequence, setSequence] = useState("ATGCGTACCTGAGCTTAACGGATC")
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const field = useId()
  const helix = (
    <DnaHelix
      sequence={sequence}
      selectedIndex={selectedIndex}
      onSelectionChange={setSelectedIndex}
      // The index page holds many previews; only the docs page animates.
      autoRotate={!compact}
      className={compact ? "h-72" : undefined}
    />
  )
  if (compact) return helix
  return (
    <div className="flex flex-col gap-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor={field}>Sequence, 5′ to 3′</FieldLabel>
          <Input
            id={field}
            value={sequence}
            spellCheck={false}
            onChange={(event) => {
              setSequence(event.target.value)
              setSelectedIndex(null)
            }}
          />
        </Field>
      </FieldGroup>
      {helix}
      <p className="text-sm" role="status">
        Selected pair: {selectedIndex === null ? "none" : selectedIndex + 1}
      </p>
    </div>
  )
}
