"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "Basal insulin dose titration, as a step line chart"

// Units of basal insulin, adjusted every few days. Fictional.
const chartData = [
  { day: "Day 1", dose: 10 },
  { day: "Day 4", dose: 12 },
  { day: "Day 7", dose: 14 },
  { day: "Day 10", dose: 16 },
  { day: "Day 13", dose: 16 },
  { day: "Day 16", dose: 18 },
  { day: "Day 19", dose: 18 },
]

const chartConfig = {
  dose: {
    label: "Basal insulin (units)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartLineInsulin() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Insulin titration</CardTitle>
        <CardDescription>Basal dose, adjusted every three days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.replace("Day ", "")}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="dose"
              type="step"
              stroke="var(--color-dose)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        From 10 to 18 units over 19 days; illustrative, not a protocol.
      </CardFooter>
    </Card>
  )
}
