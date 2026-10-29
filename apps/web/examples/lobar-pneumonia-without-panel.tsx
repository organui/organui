import { LobarPneumonia } from "@workspace/registry/lobar-pneumonia"

export function Example() {
  return (
    <LobarPneumonia
      label="Lobar pneumonia without panel example"
      panel={false}
      defaultStage="red-hepatisation"
    />
  )
}
