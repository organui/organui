import { Vessels } from "@workspace/registry/vessels"

export function Example() {
  return (
    <Vessels
      label="Vessels without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
