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

export const description = "Fasting glucose readings, as a line chart with dots"

// Fasting fingerstick readings in mg/dL, a fictional patient.
const chartData = [
  { day: "Mon", glucose: 132 },
  { day: "Tue", glucose: 124 },
  { day: "Wed", glucose: 141 },
  { day: "Thu", glucose: 118 },
  { day: "Fri", glucose: 112 },
  { day: "Sat", glucose: 121 },
  { day: "Sun", glucose: 108 },
]

const chartConfig = {
  glucose: {
    label: "Glucose (mg/dL)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartLineGlucose() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fasting glucose</CardTitle>
        <CardDescription>Fingerstick readings, one week</CardDescription>
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
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="glucose"
              type="natural"
              stroke="var(--color-glucose)"
              strokeWidth={2}
              dot={{ fill: "var(--color-glucose)" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Trending down toward target; a fictional patient.
      </CardFooter>
    </Card>
  )
}
