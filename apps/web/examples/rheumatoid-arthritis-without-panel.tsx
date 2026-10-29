import { RheumatoidArthritis } from "@workspace/registry/rheumatoid-arthritis"

export function Example() {
  return (
    <RheumatoidArthritis
      label="Rheumatoid arthritis without panel example"
      panel={false}
      defaultStage="established"
    />
  )
}
