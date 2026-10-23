import { AcuteAppendicitis } from "@workspace/registry/acute-appendicitis"

export function Example() {
  return (
    <AcuteAppendicitis
      label="Acute appendicitis without panel example"
      panel={false}
      defaultStage="perforated"
    />
  )
}
