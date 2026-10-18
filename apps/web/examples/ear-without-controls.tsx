import { Ear } from "@workspace/registry/ear"

export function Example() {
  return (
    <Ear
      label="Ear without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
