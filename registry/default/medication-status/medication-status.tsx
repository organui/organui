import type { ComponentProps } from "react"

import { Badge } from "@/components/ui/badge"

const medicationStatusConfig = {
  active: { label: "Active", variant: "default" },
  held: { label: "On hold", variant: "outline" },
  completed: { label: "Completed", variant: "secondary" },
  discontinued: { label: "Discontinued", variant: "destructive" },
  unknown: { label: "Unknown", variant: "ghost" },
} as const

export type MedicationState = keyof typeof medicationStatusConfig

export interface MedicationStatusProps
  extends Omit<ComponentProps<typeof Badge>, "children" | "variant"> {
  status: MedicationState
  label?: string
}

export function MedicationStatus({ status, label, ...props }: MedicationStatusProps) {
  const config = medicationStatusConfig[status]

  return (
    <Badge variant={config.variant} {...props}>
      {label ?? config.label}
    </Badge>
  )
}
