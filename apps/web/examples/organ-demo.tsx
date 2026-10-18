import {
  OrganViewer,
  type OrganModel,
} from "@workspace/registry/organ-viewer/organ-viewer"

export function Example({ model }: { model: OrganModel }) {
  return (
    <OrganViewer
      model={model}
      label={`${model.name} default example`}
      className="h-[28rem]"
    />
  )
}
