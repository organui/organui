import { CrohnsDisease } from "@workspace/registry/crohns-disease"

export function Example() {
  return (
    <CrohnsDisease
      label="Crohn's disease without panel example"
      panel={false}
      defaultStage="stricture"
    />
  )
}
