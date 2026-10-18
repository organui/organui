import { Thymus } from "@workspace/registry/thymus"

export function Example() {
  return (
    <Thymus
      label="Thymus without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
