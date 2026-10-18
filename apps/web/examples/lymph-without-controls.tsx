import { Lymph } from "@workspace/registry/lymph"

export function Example() {
  return (
    <Lymph
      label="Lymph node without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
