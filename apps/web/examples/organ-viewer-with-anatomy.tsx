// Also install the Explorer 01 composition:
// bunx shadcn@4.22.1 add @organui/explorer-01
import { heartModel } from "@workspace/registry/heart"
import { OrganExplorer } from "@workspace/registry/blocks/explorer-01/components/organ-explorer"

const model = heartModel

export function Example() {
  return <OrganExplorer model={model} />
}
