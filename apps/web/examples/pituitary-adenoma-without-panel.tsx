import { PituitaryAdenoma } from "@workspace/registry/pituitary-adenoma"

export function Example() {
  return (
    <PituitaryAdenoma
      label="Pituitary adenoma without panel example"
      panel={false}
      defaultStage="macroadenoma"
    />
  )
}
