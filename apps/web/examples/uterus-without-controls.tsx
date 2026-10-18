import { Uterus } from "@workspace/registry/uterus"

export function Example() {
  return (
    <Uterus
      label="Uterus without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
