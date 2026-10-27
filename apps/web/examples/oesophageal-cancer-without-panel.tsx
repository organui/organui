import { OesophagealCancer } from "@workspace/registry/oesophageal-cancer"

export function Example() {
  return (
    <OesophagealCancer
      label="Oesophageal cancer without panel example"
      panel={false}
      defaultStage="locally-advanced"
    />
  )
}
