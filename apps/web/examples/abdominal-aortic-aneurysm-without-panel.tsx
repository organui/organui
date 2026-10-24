import { AbdominalAorticAneurysm } from "@workspace/registry/abdominal-aortic-aneurysm"

export function Example() {
  return (
    <AbdominalAorticAneurysm
      label="Abdominal aortic aneurysm without panel example"
      panel={false}
      defaultStage="large"
    />
  )
}
