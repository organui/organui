import { LaryngealCancer } from "@workspace/registry/laryngeal-cancer"

export function Example() {
  return (
    <LaryngealCancer
      label="Laryngeal cancer without panel example"
      panel={false}
      defaultStage="fixed-cord"
    />
  )
}
