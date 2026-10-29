import { PepticUlcerDisease } from "@workspace/registry/peptic-ulcer-disease"

export function Example() {
  return (
    <PepticUlcerDisease
      label="Peptic ulcer disease without panel example"
      panel={false}
      defaultStage="bleeding"
    />
  )
}
