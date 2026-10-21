"use client"
import { useState } from "react"
import { DnaHelix } from "@workspace/registry/dna-helix"
import { Button } from "@workspace/ui/components/button"

const sequence = "ATGGCCATTGTAATGGGCCGC"

// Your own controls move the selection; the helix and strands follow.
export function Example() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0)
  const index = selectedIndex ?? 0
  return (
    <div className="flex w-full flex-col gap-4">
      <DnaHelix
        sequence={sequence}
        selectedIndex={selectedIndex}
        onSelectionChange={setSelectedIndex}
        autoRotate={false}
      />
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={index === 0}
          onClick={() => setSelectedIndex(index - 1)}
        >
          Previous pair
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={index === sequence.length - 1}
          onClick={() => setSelectedIndex(index + 1)}
        >
          Next pair
        </Button>
        <span className="text-sm text-muted-foreground" role="status">
          Pair {index + 1} of {sequence.length}
        </span>
      </div>
    </div>
  )
}
