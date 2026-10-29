"use client"
import { useState } from "react"
import { BodyMap } from "@workspace/registry/body-map"

// One figure, for forms that only ask about the front.
export function Example() {
  const [value, setValue] = useState<string[]>(["right-chest"])
  return (
    <BodyMap
      value={value}
      onValueChange={setValue}
      views={["front"]}
      label="Where is the pain, from the front?"
      className="w-full max-w-xs"
    />
  )
}
