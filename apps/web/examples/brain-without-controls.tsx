import { Brain } from "@workspace/registry/brain"

export function Example() {
  return (
    <Brain
      label="Brain without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
