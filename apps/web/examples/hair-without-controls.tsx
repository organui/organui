import { Hair } from "@workspace/registry/hair"

export function Example() {
  return (
    <Hair
      label="Hair without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
