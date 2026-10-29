import { heartModel } from "@workspace/registry/heart"
import { OrganViewer } from "@workspace/registry/organ-viewer"

export function Example() {
  return (
    <OrganViewer
      model={heartModel}
      controls={false}
      label="Heart in the organ viewer"
    />
  )
}
