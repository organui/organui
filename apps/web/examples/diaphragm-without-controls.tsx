import { Diaphragm } from "@workspace/registry/diaphragm"

export function Example() {
  return (
    <Diaphragm
      label="Diaphragm without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
