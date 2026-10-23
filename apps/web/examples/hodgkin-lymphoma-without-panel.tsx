import { HodgkinLymphoma } from "@workspace/registry/hodgkin-lymphoma"

export function Example() {
  return (
    <HodgkinLymphoma
      label="Hodgkin lymphoma without panel example"
      panel={false}
      defaultStage="remission"
    />
  )
}
