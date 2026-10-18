import {
  OrganViewer,
  type OrganModel,
} from "@workspace/registry/organ-viewer/organ-viewer"

export function Example({ model }: { model: OrganModel }) {
  return (
    <OrganViewer
      model={model}
      label={`${model.name} without controls example`}
      controls={false}
      className="h-[28rem]"
    />
  )
}
