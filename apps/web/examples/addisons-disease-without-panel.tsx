import { AddisonsDisease } from "@workspace/registry/addisons-disease"

export function Example() {
  return (
    <AddisonsDisease
      label="Addison's disease without panel example"
      panel={false}
      defaultStage="adrenal-crisis"
    />
  )
}
