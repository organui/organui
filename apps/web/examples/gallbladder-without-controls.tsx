import { Gallbladder } from "@workspace/registry/gallbladder"

export function Example() {
  return (
    <Gallbladder
      label="Gallbladder without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
