import type { ComponentProps } from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export interface PatientSummaryHeaderProps
  extends Omit<ComponentProps<typeof Card>, "children"> {
  displayName: string
  identifier: string
  details?: string[]
  status?: string
}

export function PatientSummaryHeader({
  displayName,
  identifier,
  details = [],
  status,
  ...props
}: PatientSummaryHeaderProps) {
  return (
    <Card {...props}>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <CardTitle>{displayName}</CardTitle>
            <CardDescription>Record {identifier}</CardDescription>
          </div>
          {status ? <Badge variant="secondary">{status}</Badge> : null}
        </div>
      </CardHeader>
      {details.length > 0 ? (
        <CardContent>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </CardContent>
      ) : null}
    </Card>
  )
}
