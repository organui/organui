"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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

export const description = "Heart rate across a shift, as a gradient area chart"

// Hourly readings for one fictional patient.
const chartData = [
  { time: "07:00", heartRate: 72 },
  { time: "08:00", heartRate: 76 },
  { time: "09:00", heartRate: 84 },
  { time: "10:00", heartRate: 91 },
  { time: "11:00", heartRate: 88 },
  { time: "12:00", heartRate: 79 },
  { time: "13:00", heartRate: 74 },
  { time: "14:00", heartRate: 70 },
  { time: "15:00", heartRate: 73 },
  { time: "16:00", heartRate: 77 },
  { time: "17:00", heartRate: 82 },
  { time: "18:00", heartRate: 75 },
]

const chartConfig = {
  heartRate: {
    label: "Heart rate (bpm)",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function ChartAreaHeartRate() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Heart rate</CardTitle>
        <CardDescription>Hourly, across a day shift</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: -12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={2}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[50, 110]}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillHeartRate" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-heartRate)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-heartRate)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="heartRate"
              type="natural"
              fill="url(#fillHeartRate)"
              stroke="var(--color-heartRate)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Peaks at 91 bpm at 10:00; a fictional patient.
      </CardFooter>
    </Card>
  )
}
