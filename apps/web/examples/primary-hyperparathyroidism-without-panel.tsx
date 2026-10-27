import { PrimaryHyperparathyroidism } from "@workspace/registry/primary-hyperparathyroidism"

export function Example() {
  return (
    <PrimaryHyperparathyroidism
      label="Primary hyperparathyroidism without panel example"
      panel={false}
      defaultStage="cured"
    />
  )
}
