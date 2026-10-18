import { Thyroid } from "@workspace/registry/thyroid"

export function Example() {
  return (
    <Thyroid
      label="Thyroid without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
