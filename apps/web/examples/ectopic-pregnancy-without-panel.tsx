import { EctopicPregnancy } from "@workspace/registry/ectopic-pregnancy"

export function Example() {
  return (
    <EctopicPregnancy
      label="Ectopic pregnancy without panel example"
      panel={false}
      defaultStage="ruptured"
    />
  )
}
