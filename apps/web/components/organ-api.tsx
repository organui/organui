import type { OrganViewerProps } from "@workspace/registry/organ-viewer"
import { PropsTable } from "@/components/props-table"

const defaults = {
  src: "Organ model URL",
  defaultView: "Organ default view",
  visibility: "Model defaults",
  label: "Interactive [organ] model",
} satisfies Partial<Record<keyof Omit<OrganViewerProps, "model">, string>>

export function OrganApi({ component }: { component: string }) {
  return (
    <PropsTable
      item="organ-viewer"
      component={component}
      description="The organ model is already configured."
      exclude={["model"]}
      defaults={defaults}
    />
  )
}
