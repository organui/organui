"use client"

import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "Medication adherence, as a pie chart with a legend"

// Doses over 30 days for a fictional patient.
const chartData = [
  { status: "onTime", doses: 52, fill: "var(--color-onTime)" },
  { status: "late", doses: 5, fill: "var(--color-late)" },
  { status: "missed", doses: 3, fill: "var(--color-missed)" },
]

const chartConfig = {
  doses: {
    label: "Doses",
  },
  onTime: {
    label: "On time",
    color: "var(--chart-2)",
  },
  late: {
    label: "Late",
    color: "var(--chart-4)",
  },
  missed: {
    label: "Missed",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartPieAdherence() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Adherence</CardTitle>
        <CardDescription>Doses over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie data={chartData} dataKey="doses" />
            <ChartLegend
              content={
                <ChartLegendContent
                  nameKey="status"
                  className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                />
              }
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        87% on time; a fictional patient.
      </CardFooter>
    </Card>
  )
}
