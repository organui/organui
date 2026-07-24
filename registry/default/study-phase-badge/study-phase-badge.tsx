import type { ComponentProps } from "react"

import { Badge } from "@/components/ui/badge"

const studyPhaseLabels = {
  "early-phase-1": "Early phase 1",
  "phase-1": "Phase 1",
  "phase-2": "Phase 2",
  "phase-3": "Phase 3",
  "phase-4": "Phase 4",
  "not-applicable": "Not applicable",
} as const

export type StudyPhase = keyof typeof studyPhaseLabels

export interface StudyPhaseBadgeProps
  extends Omit<ComponentProps<typeof Badge>, "children" | "variant"> {
  phase: StudyPhase
  label?: string
}

export function StudyPhaseBadge({ phase, label, ...props }: StudyPhaseBadgeProps) {
  return (
    <Badge variant="outline" {...props}>
      {label ?? studyPhaseLabels[phase]}
    </Badge>
  )
}
