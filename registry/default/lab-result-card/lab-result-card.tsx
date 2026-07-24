import type { ComponentProps } from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const resultStatusConfig = {
  normal: { label: "Within range", variant: "secondary" },
  abnormal: { label: "Outside range", variant: "outline" },
  critical: { label: "Critical result", variant: "destructive" },
  pending: { label: "Pending", variant: "outline" },
  unavailable: { label: "Unavailable", variant: "ghost" },
} as const

export type LabResultStatus = keyof typeof resultStatusConfig

export interface LabResultCardProps
  extends Omit<ComponentProps<typeof Card>, "children"> {
  name: string
  value?: string
  unit?: string
  referenceRange?: string
  status: LabResultStatus
  collectedAt?: string
  statusLabel?: string
}

export function LabResultCard({
  name,
  value,
  unit,
  referenceRange,
  status,
  collectedAt,
  statusLabel,
  ...props
}: LabResultCardProps) {
  const config = resultStatusConfig[status]
  const result = value ? [value, unit].filter(Boolean).join(" ") : "Not available"

  return (
    <Card {...props}>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle>{name}</CardTitle>
            <CardDescription>Laboratory result</CardDescription>
          </div>
          <Badge variant={config.variant}>{statusLabel ?? config.label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <dt className="text-sm text-muted-foreground">Result</dt>
            <dd className="text-2xl font-semibold tabular-nums">{result}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-sm text-muted-foreground">Reference range</dt>
            <dd className="font-medium">{referenceRange ?? "Not provided"}</dd>
          </div>
        </dl>
      </CardContent>
      {collectedAt ? (
        <CardFooter className="text-sm text-muted-foreground">
          Collected {collectedAt}
        </CardFooter>
      ) : null}
    </Card>
  )
}
