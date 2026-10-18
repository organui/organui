import { Teeth } from "@workspace/registry/teeth"

export function Example() {
  return (
    <Teeth
      label="Teeth without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
