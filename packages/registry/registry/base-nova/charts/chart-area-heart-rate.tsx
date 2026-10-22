"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  ReferenceArea,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { IconPlaceholder } from "@/icons/icon-placeholder"

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

const latest = chartData.at(-1)!
// The usual adult resting range, drawn behind the readings.
const normal = { low: 60, high: 100 }
const inRange =
  latest.heartRate >= normal.low && latest.heartRate <= normal.high

const peak = chartData.reduce((a, b) => (b.heartRate > a.heartRate ? b : a))

export function ChartAreaHeartRate() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Heart rate</CardTitle>
        <CardDescription>Hourly, across a day shift</CardDescription>
        <CardAction className="flex flex-col items-end gap-1.5">
          <div className="text-2xl leading-none font-semibold">
            {latest.heartRate}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              bpm
            </span>
          </div>
          <Badge variant="outline">
            {inRange ? (
              <IconPlaceholder
                lucide="CheckIcon"
                tabler="IconCheck"
                hugeicons="Tick02Icon"
                phosphor="CheckIcon"
                remixicon="RiCheckLine"
                data-icon="inline-start"
              />
            ) : (
              <IconPlaceholder
                lucide="TriangleAlertIcon"
                tabler="IconAlertTriangle"
                hugeicons="Alert02Icon"
                phosphor="WarningIcon"
                remixicon="RiAlertLine"
                data-icon="inline-start"
              />
            )}
            {inRange ? "In range" : "Out of range"}
          </Badge>
        </CardAction>
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
            <ReferenceArea
              y1={normal.low}
              y2={normal.high}
              fill="var(--muted-foreground)"
              fillOpacity={0.08}
            >
              <Label
                value={`Normal ${normal.low}–${normal.high}`}
                position="insideTopLeft"
                className="fill-muted-foreground"
                fontSize={11}
              />
            </ReferenceArea>
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
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Peaks at {peak.heartRate} bpm at {peak.time}
        </div>
        <div className="leading-none text-muted-foreground">
          {chartData[0]!.time} to {latest.time}; a fictional patient
        </div>
      </CardFooter>
    </Card>
  )
}
