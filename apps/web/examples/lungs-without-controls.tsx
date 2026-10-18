import { Lungs } from "@workspace/registry/lungs"

export function Example() {
  return (
    <Lungs
      label="Lungs without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
