import { Bladder } from "@workspace/registry/bladder"

export function Example() {
  return (
    <Bladder
      label="Bladder without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
