import { AcuteOtitisMedia } from "@workspace/registry/acute-otitis-media"

export function Example() {
  return (
    <AcuteOtitisMedia
      label="Acute otitis media without panel example"
      panel={false}
      defaultStage="perforated"
    />
  )
}
