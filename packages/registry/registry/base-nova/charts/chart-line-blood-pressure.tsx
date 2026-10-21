"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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

export const description =
  "Home blood pressure readings, as a multiple line chart"

// Morning readings for a fictional patient starting treatment.
const chartData = [
  { day: "Mon", systolic: 152, diastolic: 94 },
  { day: "Tue", systolic: 148, diastolic: 92 },
  { day: "Wed", systolic: 145, diastolic: 90 },
  { day: "Thu", systolic: 141, diastolic: 88 },
  { day: "Fri", systolic: 138, diastolic: 86 },
  { day: "Sat", systolic: 134, diastolic: 84 },
  { day: "Sun", systolic: 131, diastolic: 82 },
]

const chartConfig = {
  systolic: {
    label: "Systolic (mmHg)",
    color: "var(--chart-2)",
  },
  diastolic: {
    label: "Diastolic (mmHg)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartLineBloodPressure() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blood pressure</CardTitle>
        <CardDescription>Morning home readings, first week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: -12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[60, 160]}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="systolic"
              type="monotone"
              stroke="var(--color-systolic)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="diastolic"
              type="monotone"
              stroke="var(--color-diastolic)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Down 21/12 mmHg over the week; a fictional patient.
      </CardFooter>
    </Card>
  )
}
