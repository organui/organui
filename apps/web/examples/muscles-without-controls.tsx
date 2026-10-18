import { Muscles } from "@workspace/registry/muscles"

export function Example() {
  return (
    <Muscles
      label="Muscles without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
