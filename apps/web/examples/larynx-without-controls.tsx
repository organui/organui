import { Larynx } from "@workspace/registry/larynx"

export function Example() {
  return (
    <Larynx
      label="Larynx without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
