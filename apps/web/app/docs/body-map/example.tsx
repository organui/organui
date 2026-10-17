"use client"
import { useState } from "react"
import { BodyMap, bodyMapRegions } from "@workspace/registry/body-map"

const labels = new Map(bodyMapRegions.map(({ id, label }) => [id, label]))

export function Example() {
  const [value, setValue] = useState<string[]>(["right-knee"])
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
      <BodyMap
        value={value}
        onValueChange={setValue}
        label="Where does it hurt?"
        className="rounded-xl border p-5"
      />
      <aside className="rounded-xl border bg-muted/30 p-5">
        <h2 className="mb-3 font-medium">Your form state</h2>
        <p className="text-sm text-muted-foreground">
          Select regions on either view. The IDs are yours to store with the
          rest of the record.
        </p>
        <pre
          tabIndex={0}
          role="region"
          className="mt-4 overflow-auto rounded-md bg-background p-3 text-xs focus-visible:outline-2 focus-visible:outline-ring"
          aria-label="Selected region IDs"
        >
          {JSON.stringify(value, null, 2)}
        </pre>
        <p className="mt-4 text-xs text-muted-foreground">
          Last selected: {labels.get(value.at(-1) ?? "") ?? "none"}
        </p>
      </aside>
    </div>
  )
}
