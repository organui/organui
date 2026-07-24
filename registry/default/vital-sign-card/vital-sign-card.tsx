import type { ComponentProps } from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export interface VitalSignCardProps
  extends Omit<ComponentProps<typeof Card>, "children"> {
  label: string
  value?: string | number
  unit?: string
  measuredAt?: string
  status?: "recorded" | "attention" | "unavailable"
}

export function VitalSignCard({
  label,
  value,
  unit,
  measuredAt,
  status = "recorded",
  ...props
}: VitalSignCardProps) {
  const statusConfig = {
    recorded: { label: "Recorded", variant: "secondary" },
    attention: { label: "Review", variant: "destructive" },
    unavailable: { label: "Unavailable", variant: "outline" },
  } as const
  const config = statusConfig[status]

  return (
    <Card {...props}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle>{label}</CardTitle>
            <CardDescription>{measuredAt ?? "Measurement time unavailable"}</CardDescription>
          </div>
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tabular-nums">
          {value ?? "—"}{" "}
          {unit ? <span className="text-base font-normal text-muted-foreground">{unit}</span> : null}
        </p>
      </CardContent>
    </Card>
  )
}
