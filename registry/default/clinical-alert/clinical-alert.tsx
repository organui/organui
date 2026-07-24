import type { ComponentProps } from "react"
import { AlertCircleIcon, InfoIcon, TriangleAlertIcon } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

const clinicalAlertConfig = {
  information: { icon: InfoIcon, variant: "default" },
  warning: { icon: TriangleAlertIcon, variant: "default" },
  critical: { icon: AlertCircleIcon, variant: "destructive" },
} as const

export interface ClinicalAlertProps
  extends Omit<ComponentProps<typeof Alert>, "children" | "title"> {
  severity: keyof typeof clinicalAlertConfig
  title: string
  description: string
}

export function ClinicalAlert({
  severity,
  title,
  description,
  ...props
}: ClinicalAlertProps) {
  const config = clinicalAlertConfig[severity]
  const Icon = config.icon

  return (
    <Alert variant={config.variant} {...props}>
      <Icon aria-hidden="true" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}
