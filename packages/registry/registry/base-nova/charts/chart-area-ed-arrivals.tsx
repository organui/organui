"use client"

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Label,
  Line,
  ReferenceLine,
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
  "Daily emergency department arrivals with a 7-day average, a surge threshold and events"

// Repeatable noise between -1 and 1, so the server and browser draw the same
// chart.
function noise(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

// Daily arrivals from April to June, illustrative: busier on Mondays, with a
// rise through May.
const arrivals = Array.from({ length: 91 }, (_, day) => {
  const date = new Date(Date.UTC(2026, 3, 1 + day))
  const monday = date.getUTCDay() === 1 ? 26 : 0
  const rise = 28 * Math.exp(-(((day - 50) / 12) ** 2) / 2)
  return {
    date: date.toISOString().slice(0, 10),
    arrivals: Math.round(186 + monday + rise + 18 * noise(day)),
  }
})

// Each day with the mean of the seven days to it, the line that smooths out
// the weekly pattern.
const chartData = arrivals.map((day, index) => {
  const week = arrivals.slice(Math.max(0, index - 6), index + 1)
  return {
    ...day,
    average:
      index < 6
        ? null
        : Math.round(
            week.reduce((sum, { arrivals }) => sum + arrivals, 0) / week.length
          ),
  }
})

const chartConfig = {
  arrivals: {
    label: "Arrivals",
    color: "var(--chart-1)",
  },
  average: {
    label: "7-day average",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

// The level at which the department calls in extra staff; set your own.
const surge = 220

// What happened, marked on the timeline.
const events = [
  { date: "2026-05-04", label: "Bank holiday" },
  { date: "2026-05-18", label: "Heatwave" },
]

const latest = chartData.at(-1)!
const peak = chartData.reduce((a, b) =>
  (b.average ?? 0) > (a.average ?? 0) ? b : a
)
const daysOver = chartData.filter(({ arrivals }) => arrivals > surge).length
const belowSurge = (latest.average ?? 0) < surge

// Dates are UTC days, so they read the same on the server and in the browser.
function formatDate(value: string, options?: Intl.DateTimeFormatOptions) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
    ...options,
  })
}

export function ChartAreaEdArrivals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ED arrivals</CardTitle>
        <CardDescription>
          Daily, April to June, with the 7-day average; illustrative data
        </CardDescription>
        <CardAction className="flex flex-col items-end gap-1.5">
          <div className="text-2xl leading-none font-semibold">
            {latest.average}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              a day, last 7 days
            </span>
          </div>
          <Badge variant="outline">
            {belowSurge ? (
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
            {belowSurge ? "Below surge" : "In surge"}
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
              domain={[140, 260]}
              ticks={[160, 200, 240]}
              allowDataOverflow
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(value) =>
                    formatDate(String(value), { weekday: "short" })
                  }
                />
              }
            />
            {/* Each day faint, the average strong. */}
            <Bar
              dataKey="arrivals"
              fill="var(--color-arrivals)"
              fillOpacity={0.35}
              radius={[2, 2, 0, 0]}
            />
            <Line
              dataKey="average"
              type="monotone"
              stroke="var(--color-average)"
              strokeWidth={2}
              dot={false}
            />
            <ReferenceLine
              y={surge}
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
            >
              <Label
                value={`Surge ${surge}`}
                position="insideTopRight"
                className="fill-muted-foreground"
                fontSize={11}
              />
            </ReferenceLine>
            {events.map((event) => (
              <ReferenceLine
                key={event.date}
                x={event.date}
                stroke="var(--muted-foreground)"
              >
                <Label
                  value={event.label}
                  position="insideTopLeft"
                  className="fill-foreground"
                  fontSize={11}
                />
              </ReferenceLine>
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Average peaked at {peak.average} a day, week to{" "}
          {formatDate(peak.date)}
        </div>
        <div className="leading-none text-muted-foreground">
          {daysOver} days over the surge level; illustrative data
        </div>
      </CardFooter>
    </Card>
  )
}
