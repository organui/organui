import { MyastheniaGravis } from "@workspace/registry/myasthenia-gravis"

export function Example() {
  return (
    <MyastheniaGravis
      label="Myasthenia gravis without panel example"
      panel={false}
      defaultScale="thymus"
      defaultStage="generalised"
    />
  )
}
