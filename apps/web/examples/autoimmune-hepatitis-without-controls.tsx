import { AutoimmuneHepatitis } from "@workspace/registry/autoimmune-hepatitis"

export function Example() {
  return (
    <AutoimmuneHepatitis
      label="Autoimmune hepatitis without controls example"
      controls={false}
    />
  )
}
