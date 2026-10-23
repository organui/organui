import { autoimmuneHepatitis } from "@workspace/registry/autoimmune-hepatitis"
import { DiseaseViewer } from "@workspace/registry/disease-viewer"

export function Example() {
  return (
    <DiseaseViewer
      disease={autoimmuneHepatitis}
      label="Disease viewer default example"
    />
  )
}
