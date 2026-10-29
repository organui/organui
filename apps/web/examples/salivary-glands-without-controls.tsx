import { SalivaryGlands } from "@workspace/registry/salivary-glands"

export function Example() {
  return (
    <SalivaryGlands
      label="Salivary glands without controls example"
      controls={false}
    />
  )
}
