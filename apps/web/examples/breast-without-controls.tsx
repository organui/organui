import { Breast } from "@workspace/registry/breast"

export function Example() {
  return (
    <Breast
      label="Breast without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
