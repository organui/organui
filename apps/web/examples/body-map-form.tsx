"use client"
import { useState } from "react"
import { BodyMap } from "@workspace/registry/body-map"
import { Button } from "@workspace/ui/components/button"

// With a name, the map submits one hidden input per region, like checkboxes.
export function Example() {
  const [value, setValue] = useState<string[]>([])
  const [submitted, setSubmitted] = useState<string[] | null>(null)
  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(
          new FormData(event.currentTarget).getAll("regions").map(String)
        )
      }}
    >
      <BodyMap
        value={value}
        onValueChange={setValue}
        name="regions"
        label="Where is the pain?"
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit">Submit</Button>
        <output className="text-sm text-muted-foreground">
          {submitted === null
            ? "Not submitted"
            : `Submitted: ${submitted.join(", ") || "nothing"}`}
        </output>
      </div>
    </form>
  )
}
