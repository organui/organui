"use client"

import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
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

const latest = chartData.at(-1)!
// A common fasting target; set your own patient's range.
const targetRange = { low: 80, high: 130 }
const inTarget =
  latest.glucose >= targetRange.low && latest.glucose <= targetRange.high

const first = chartData[0]!
const change = Math.round(
  ((latest.glucose - first.glucose) / first.glucose) * 100
)

export function ChartLineGlucose() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fasting glucose</CardTitle>
        <CardDescription>Fingerstick readings, one week</CardDescription>
        <CardAction className="flex flex-col items-end gap-1.5">
          <div className="text-2xl leading-none font-semibold">
            {latest.glucose}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              mg/dL
            </span>
          </div>
          <Badge variant="outline">
            {inTarget ? (
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
            {inTarget
              ? "At target"
              : latest.glucose > targetRange.high
                ? "Above target"
                : "Below target"}
          </Badge>
        </CardAction>
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
              interval={0}
            />
            <YAxis hide domain={[60, 160]} />
            <ReferenceArea
              y1={targetRange.low}
              y2={targetRange.high}
              fill="var(--muted-foreground)"
              fillOpacity={0.08}
            >
              <Label
                value={`Target ${targetRange.low}–${targetRange.high}`}
                position="insideBottomRight"
                className="fill-muted-foreground"
                fontSize={11}
              />
            </ReferenceArea>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="glucose"
              type="monotone"
              stroke="var(--color-glucose)"
              strokeWidth={2}
              dot={{ fill: "var(--color-glucose)" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {change < 0 ? "Down" : "Up"} {Math.abs(change)}% this week{" "}
          {change < 0 ? (
            <IconPlaceholder
              lucide="TrendingDownIcon"
              tabler="IconTrendingDown"
              hugeicons="ChartDownIcon"
              phosphor="TrendDownIcon"
              remixicon="RiArrowDownLine"
              className="size-4"
            />
          ) : (
            <IconPlaceholder
              lucide="TrendingUpIcon"
              tabler="IconTrendingUp"
              hugeicons="ChartUpIcon"
              phosphor="TrendUpIcon"
              remixicon="RiArrowUpLine"
              className="size-4"
            />
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          {first.day} to {latest.day}; a fictional patient
        </div>
      </CardFooter>
    </Card>
  )
}
