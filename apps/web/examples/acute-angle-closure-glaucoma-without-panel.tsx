import { AcuteAngleClosureGlaucoma } from "@workspace/registry/acute-angle-closure-glaucoma"

export function Example() {
  return (
    <AcuteAngleClosureGlaucoma
      label="Acute angle-closure glaucoma without panel example"
      panel={false}
      defaultStage="glaucomatous"
    />
  )
}
