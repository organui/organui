import { BreastCancer } from "@workspace/registry/breast-cancer"

export function Example() {
  return (
    <BreastCancer
      label="Breast cancer without panel example"
      panel={false}
      defaultStage="locally-advanced"
    />
  )
}
