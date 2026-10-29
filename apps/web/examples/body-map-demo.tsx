"use client"
import { useState } from "react"
import { BodyMap } from "@workspace/registry/body-map"

export function Example() {
  const [value, setValue] = useState<string[]>(["right-knee"])
  return (
    <BodyMap
      value={value}
      onValueChange={setValue}
      label="Where does it hurt?"
    />
  )
}
