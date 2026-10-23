import { MyocardialInfarction } from "@workspace/registry/myocardial-infarction"

export function Example() {
  return (
    <MyocardialInfarction
      label="Myocardial infarction without panel example"
      panel={false}
      defaultStage="healed"
    />
  )
}
