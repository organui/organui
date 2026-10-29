"use client"

import {
  CartesianGrid,
  ComposedChart,
  Label,
  Line,
  ReferenceLine,
  Scatter,
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { IconPlaceholder } from "@/icons/icon-placeholder"

export const description =
  "Resting heart rate through cardiac rehab, daily readings with a 7-day average and milestones"

// Repeatable noise between -1 and 1, so the server and browser draw the same
// chart.
function noise(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

// What happened, marked on the timeline.
const milestones = [
  { date: "2026-04-15", label: "Rehab starts" },
  { date: "2026-05-27", label: "Home exercise" },
]
const start = Date.UTC(2026, 3, 15)

// Resting heart rate from a fictional patient's wearable, each morning for
// twelve weeks: steady before rehab, then falling with training.
const readings = Array.from({ length: 84 }, (_, day) => {
  const date = Date.UTC(2026, 3, 1 + day)
  const trained = Math.max(0, (date - start) / 86_400_000)
  return {
    date: new Date(date).toISOString().slice(0, 10),
    heartRate: Math.round(
      76 - 9 * (1 - Math.exp(-trained / 30)) + 2.5 * noise(day)
    ),
  }
})

// Each day with the mean of the seven days to it.
const chartData = readings.map((day, index) => {
  const week = readings.slice(Math.max(0, index - 6), index + 1)
  return {
    ...day,
    average:
      index < 6
        ? null
        : Math.round(
            (week.reduce((sum, { heartRate }) => sum + heartRate, 0) /
              week.length) *
              10
          ) / 10,
  }
})

const chartConfig = {
  heartRate: {
    label: "Morning reading",
    color: "var(--chart-1)",
  },
  average: {
    label: "7-day average",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const before = chartData.find(({ date }) => date === milestones[0]!.date)!
const latest = chartData.at(-1)!
const change =
  Math.round(((latest.average ?? 0) - (before.average ?? 0)) * 10) / 10
const improving = change < 0

// Dates are UTC days, so they read the same on the server and in the browser.
function formatDate(value: string, options?: Intl.DateTimeFormatOptions) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
    ...options,
  })
}

export function ChartLineRehab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cardiac rehab</CardTitle>
        <CardDescription>
          Resting heart rate each morning, from a wearable; a fictional patient
        </CardDescription>
        <CardAction className="flex flex-col items-end gap-1.5">
          <div className="text-2xl leading-none font-semibold">
            {change > 0 ? "+" : ""}
            {change}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              bpm since rehab
            </span>
          </div>
          <Badge variant="outline">
            {improving ? (
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
            {improving ? "Improving" : "Not improving"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[260px] w-full"
        >
          <ComposedChart
            accessibilityLayer
            data={chartData}
            margin={{ left: -12, right: 12, top: 16 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => formatDate(value)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[60, 82]}
              ticks={[65, 70, 75, 80]}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(_, payload) =>
                    formatDate(payload[0]?.payload.date, { weekday: "short" })
                  }
                />
              }
            />
            {milestones.map((milestone) => (
              <ReferenceLine
                key={milestone.date}
                x={milestone.date}
                stroke="var(--muted-foreground)"
              >
                <Label
                  value={milestone.label}
                  position="insideTopLeft"
                  className="fill-foreground"
                  fontSize={11}
                />
              </ReferenceLine>
            ))}
            {/* Each reading faint, the average strong. */}
            <Scatter
              dataKey="heartRate"
              fill="var(--color-heartRate)"
              fillOpacity={0.45}
              shape={(props: { cx?: number; cy?: number }) => (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={2.5}
                  fill="var(--color-heartRate)"
                  fillOpacity={0.45}
                />
              )}
            />
            <Line
              dataKey="average"
              type="monotone"
              stroke="var(--color-average)"
              strokeWidth={2}
              dot={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          From {before.average} to {latest.average} bpm, 7-day average{" "}
          {latest.average! <= before.average! ? (
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
          {formatDate(milestones[0]!.date)} to {formatDate(latest.date)}; a
          fictional patient
        </div>
      </CardFooter>
    </Card>
  )
}
