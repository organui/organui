import { Spleen } from "@workspace/registry/spleen"

export function Example() {
  return (
    <Spleen
      label="Spleen without controls example"
      controls={false}
      className="h-[28rem]"
    />
  )
}
