import { Vestibular } from "@workspace/registry/vestibular"

export function Example() {
  return (
    <Vestibular
      label="Vestibular system without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
