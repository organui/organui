import { GravesDisease } from "@workspace/registry/graves-disease"

export function Example() {
  return (
    <GravesDisease
      label="Graves' disease without panel example"
      panel={false}
      defaultScale="eye"
      defaultStage="active-eye"
    />
  )
}
