import { Melanoma } from "@workspace/registry/melanoma"

export function Example() {
  return (
    <Melanoma
      label="Melanoma without panel example"
      panel={false}
      defaultStage="thick"
    />
  )
}
