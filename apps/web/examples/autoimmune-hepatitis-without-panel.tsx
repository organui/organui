import { AutoimmuneHepatitis } from "@workspace/registry/autoimmune-hepatitis"

export function Example() {
  return (
    <AutoimmuneHepatitis
      label="Autoimmune hepatitis without panel example"
      panel={false}
      defaultScale="liver-lobule"
      defaultStage="cirrhosis"
    />
  )
}
