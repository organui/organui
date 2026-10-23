import { GallstoneDisease } from "@workspace/registry/gallstone-disease"

export function Example() {
  return (
    <GallstoneDisease
      label="Gallstone disease without panel example"
      panel={false}
      defaultStage="cholangitis"
    />
  )
}
