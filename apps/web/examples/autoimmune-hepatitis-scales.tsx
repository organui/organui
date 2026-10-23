"use client"

// Also install shadcn's toggle-group.
import { useState } from "react"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"
import {
  AutoimmuneHepatitis,
  autoimmuneHepatitisLobuleModel,
  autoimmuneHepatitisModel,
  type AutoimmuneHepatitisProps,
} from "@workspace/registry/autoimmune-hepatitis"

type Scale = NonNullable<AutoimmuneHepatitisProps["scale"]>

const scales = [
  { value: "liver", label: "Liver", model: autoimmuneHepatitisModel },
  {
    value: "liver-lobule",
    label: "Lobule",
    model: autoimmuneHepatitisLobuleModel,
  },
] satisfies { value: Scale; label: string; model: unknown }[]

export function Example() {
  const [scale, setScale] = useState<Scale>("liver")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { model } = scales.find(({ value }) => value === scale)!
  const selected = model.structures.find(({ id }) => id === selectedId)
  return (
    <div className="flex flex-col gap-3">
      <ToggleGroup
        aria-label="Scale"
        variant="outline"
        size="sm"
        spacing={2}
        value={[scale]}
        onValueChange={(values) => {
          if (values[0] === undefined) return
          setScale(values[0] as Scale)
          // Each scale has its own structure IDs.
          setSelectedId(null)
        }}
      >
        {scales.map(({ value, label }) => (
          <ToggleGroupItem key={value} value={value}>
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <AutoimmuneHepatitis
        key={scale}
        scale={scale}
        label="Autoimmune hepatitis scales example"
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
      />
      <p role="status" className="text-sm text-muted-foreground">
        {selected ? (
          <>
            <span className="font-medium text-foreground">
              {selected.label}
            </span>{" "}
            ({selected.group.toLowerCase()}): {selected.description}
          </>
        ) : (
          "Select a structure to read what the disease does there."
        )}
      </p>
    </div>
  )
}
