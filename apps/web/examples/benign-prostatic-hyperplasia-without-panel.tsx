import { BenignProstaticHyperplasia } from "@workspace/registry/benign-prostatic-hyperplasia"

export function Example() {
  return (
    <BenignProstaticHyperplasia
      label="Benign prostatic hyperplasia without panel example"
      panel={false}
      defaultScale="bladder"
      defaultStage="chronic-retention"
    />
  )
}
