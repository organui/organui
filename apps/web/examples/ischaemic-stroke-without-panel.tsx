import { IschaemicStroke } from "@workspace/registry/ischaemic-stroke"

export function Example() {
  return (
    <IschaemicStroke
      label="Ischaemic stroke without panel example"
      panel={false}
      defaultStage="acute"
    />
  )
}
