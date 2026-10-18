// Also install the Explorer 01 composition:
// bunx shadcn@4.21.0 add @organui/explorer-01
import { OrganExplorer } from "@workspace/registry/blocks/explorer-01/components/organ-explorer"
import type { OrganModel } from "@workspace/registry/organ-viewer/organ-viewer"

export function Example({ model }: { model: OrganModel }) {
  return <OrganExplorer model={model} />
}
