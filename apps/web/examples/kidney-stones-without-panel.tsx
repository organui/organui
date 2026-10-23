import { KidneyStones } from "@workspace/registry/kidney-stones"

export function Example() {
  return (
    <KidneyStones
      label="Kidney stones without panel example"
      panel={false}
      defaultStage="colic"
    />
  )
}
