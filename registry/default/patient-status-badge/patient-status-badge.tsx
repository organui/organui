import type { ComponentProps } from "react"

import { Badge } from "@/components/ui/badge"

const patientStatusConfig = {
  active: { label: "Active", variant: "default" },
  inactive: { label: "Inactive", variant: "secondary" },
  critical: { label: "Critical", variant: "destructive" },
  pending: { label: "Pending", variant: "outline" },
  unknown: { label: "Unknown", variant: "ghost" },
} as const

export type PatientStatus = keyof typeof patientStatusConfig

export interface PatientStatusBadgeProps
  extends Omit<ComponentProps<typeof Badge>, "children" | "variant"> {
  status: PatientStatus
  label?: string
}

export function PatientStatusBadge({
  status,
  label,
  ...props
}: PatientStatusBadgeProps) {
  const config = patientStatusConfig[status]

  return (
    <Badge variant={config.variant} {...props}>
      {label ?? config.label}
    </Badge>
  )
}
