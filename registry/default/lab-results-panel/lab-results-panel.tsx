import type { ComponentProps } from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type LabResultStatus =
  | "normal"
  | "abnormal"
  | "critical"
  | "pending"
  | "unavailable"

export interface LabPanelResult {
  id: string
  name: string
  value?: string
  unit?: string
  referenceRange?: string
  status: LabResultStatus
}

export interface LabResultsPanelProps
  extends Omit<ComponentProps<typeof Card>, "children" | "results"> {
  results: LabPanelResult[]
  title?: string
  description?: string
}

const statusConfig = {
  normal: { label: "Normal", variant: "secondary" },
  abnormal: { label: "Abnormal", variant: "outline" },
  critical: { label: "Critical", variant: "destructive" },
  pending: { label: "Pending", variant: "outline" },
  unavailable: { label: "Unavailable", variant: "ghost" },
} as const

export function LabResultsPanel({
  results,
  title = "Lab results",
  description = "Most recent reported values",
  ...props
}: LabResultsPanelProps) {
  const flaggedCount = results.filter(
    ({ status }) => status === "abnormal" || status === "critical"
  ).length
  const pendingCount = results.filter(
    ({ status }) => status === "pending"
  ).length

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="flex flex-wrap gap-2 pt-2" aria-label="Result summary">
          <Badge variant="secondary">{results.length} total</Badge>
          <Badge variant={flaggedCount > 0 ? "destructive" : "outline"}>
            {flaggedCount} flagged
          </Badge>
          <Badge variant="outline">{pendingCount} pending</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyTitle>No lab results</EmptyTitle>
              <EmptyDescription>
                Results will appear here after they are reported.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableCaption className="sr-only">
              {title}: {description}
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">Test</TableHead>
                <TableHead scope="col">Result</TableHead>
                <TableHead scope="col">Reference range</TableHead>
                <TableHead scope="col">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => {
                const status = statusConfig[result.status]

                return (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">{result.name}</TableCell>
                    <TableCell>
                      {result.value ?? "Not available"}
                      {result.value && result.unit ? ` ${result.unit}` : ""}
                    </TableCell>
                    <TableCell>
                      {result.referenceRange ?? "Not available"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
