import type { ComponentProps } from "react"

import { Badge } from "@/components/ui/badge"

const specimenStatusConfig = {
  collected: { label: "Collected", variant: "secondary" },
  "in-transit": { label: "In transit", variant: "outline" },
  received: { label: "Received", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
  unavailable: { label: "Unavailable", variant: "ghost" },
} as const

export type SpecimenState = keyof typeof specimenStatusConfig

export interface SpecimenStatusProps
  extends Omit<ComponentProps<typeof Badge>, "children" | "variant"> {
  status: SpecimenState
  label?: string
}

export function SpecimenStatus({ status, label, ...props }: SpecimenStatusProps) {
  const config = specimenStatusConfig[status]

  return (
    <Badge variant={config.variant} {...props}>
      {label ?? config.label}
    </Badge>
  )
}
