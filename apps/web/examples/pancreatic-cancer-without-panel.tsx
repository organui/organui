import { PancreaticCancer } from "@workspace/registry/pancreatic-cancer"

export function Example() {
  return (
    <PancreaticCancer
      label="Pancreatic cancer without panel example"
      panel={false}
      defaultStage="locally-advanced"
    />
  )
}
