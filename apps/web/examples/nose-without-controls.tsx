import { Nose } from "@workspace/registry/nose"

export function Example() {
  return (
    <Nose
      label="Nose without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
