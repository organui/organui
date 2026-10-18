import { Pharynx } from "@workspace/registry/pharynx"

export function Example() {
  return (
    <Pharynx
      label="Pharynx without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
