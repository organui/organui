"use client"

import { Bar, BarChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description =
  "Insulin doses by day, as a stacked bar chart: tooltip without a label or indicator"

// Insulin given each day for a fictional patient, in units.
const chartData = [
  { date: "2026-07-13", basal: 18, bolus: 22 },
  { date: "2026-07-14", basal: 18, bolus: 26 },
  { date: "2026-07-15", basal: 20, bolus: 19 },
  { date: "2026-07-16", basal: 20, bolus: 31 },
  { date: "2026-07-17", basal: 22, bolus: 24 },
  { date: "2026-07-18", basal: 22, bolus: 27 },
]

const chartConfig = {
  basal: {
    label: "Basal",
    color: "var(--chart-2)",
  },
  bolus: {
    label: "Bolus",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartTooltipInsulinNoLabel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No label</CardTitle>
        <CardDescription>Tooltip without a label or indicator</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                  timeZone: "UTC",
                })
              }
            />
            <Bar
              dataKey="basal"
              stackId="a"
              fill="var(--color-basal)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="bolus"
              stackId="a"
              fill="var(--color-bolus)"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={<ChartTooltipContent hideIndicator hideLabel />}
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
