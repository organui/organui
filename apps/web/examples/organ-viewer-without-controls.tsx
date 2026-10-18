import { heartModel } from "@workspace/registry/heart"
import { OrganViewer } from "@workspace/registry/organ-viewer"

const model = heartModel

export function Example() {
  return (
    <OrganViewer
      model={model}
      label={`${model.name} without controls example`}
      controls={false}
      className="h-[28rem]"
    />
  )
}
