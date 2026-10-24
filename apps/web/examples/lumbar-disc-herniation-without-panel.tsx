import { LumbarDiscHerniation } from "@workspace/registry/lumbar-disc-herniation"

export function Example() {
  return (
    <LumbarDiscHerniation
      label="Lumbar disc herniation without panel example"
      panel={false}
      defaultStage="cauda-equina-syndrome"
    />
  )
}
