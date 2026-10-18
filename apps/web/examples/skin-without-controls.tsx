import { Skin } from "@workspace/registry/skin"

export function Example() {
  return (
    <Skin
      label="Skin without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
