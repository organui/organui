"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
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
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import { IconPlaceholder } from "@/icons/icon-placeholder"

export const description =
  "Daily laboratory turnaround for urgent bloods, against a target"

// Repeatable noise between -1 and 1, so the server and browser draw the same
// chart.
function noise(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

// The median minutes from request to result for urgent bloods each day, from
// April to June, illustrative: slower at weekends, with fewer staff.
const chartData = Array.from({ length: 91 }, (_, day) => {
  const date = new Date(Date.UTC(2026, 3, 1 + day))
  const weekend = [0, 6].includes(date.getUTCDay())
  return {
    date: date.toISOString().slice(0, 10),
    minutes: Math.round((weekend ? 63 : 49) + 8 * noise(day)),
  }
})

const chartConfig = {
  minutes: {
    label: "Median turnaround",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

// The target from request to result for urgent bloods; set your own.
const target = 60
const lastMonth = chartData.slice(-30)
const withinTarget = lastMonth.filter(({ minutes }) => minutes <= target)
const share = Math.round((withinTarget.length / lastMonth.length) * 100)
const meets = share >= 90
const slowest = chartData.reduce((a, b) => (b.minutes > a.minutes ? b : a))

// Dates are UTC days, so they read the same on the server and in the browser.
function formatDate(value: string, options?: Intl.DateTimeFormatOptions) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
    ...options,
  })
}

export function ChartBarTurnaround() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lab turnaround</CardTitle>
        <CardDescription>
          Urgent bloods, median minutes from request to result, each day
        </CardDescription>
        <CardAction className="flex flex-col items-end gap-1.5">
          <div className="text-2xl leading-none font-semibold">
            {share}%{" "}
            <span className="text-sm font-normal text-muted-foreground">
              of days on target
            </span>
          </div>
          <Badge variant="outline">
            {meets ? (
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
            {meets ? "On track" : "Review weekends"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[260px] w-full"
        >
          <BarChart
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
              domain={[0, 80]}
              ticks={[0, 30, 60]}
              tickFormatter={(value) => `${value}m`}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                const row = payload?.[0]?.payload as
                  (typeof chartData)[number] | undefined
                if (!active || !row) return null
                return (
                  <div className="grid min-w-[9rem] gap-1 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl">
                    <div className="font-medium">
                      {formatDate(row.date, { weekday: "short" })}
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-muted-foreground">Median</span>
                      <span className="font-mono font-medium tabular-nums">
                        {row.minutes} min
                      </span>
                    </div>
                  </div>
                )
              }}
            />
            {/* Days over target at full strength, the rest muted. */}
            <Bar dataKey="minutes" radius={[2, 2, 0, 0]}>
              {chartData.map((day) => (
                <Cell
                  key={day.date}
                  fill="var(--color-minutes)"
                  fillOpacity={day.minutes > target ? 1 : 0.3}
                />
              ))}
            </Bar>
            <ReferenceLine
              y={target}
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
            >
              <Label
                value={`Target ${target} min`}
                position="insideTopRight"
                className="fill-muted-foreground"
                fontSize={11}
              />
            </ReferenceLine>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Slowest on {formatDate(slowest.date, { weekday: "short" })}, at{" "}
          {slowest.minutes} minutes
        </div>
        <div className="leading-none text-muted-foreground">
          Strong bars missed the target; illustrative data
        </div>
      </CardFooter>
    </Card>
  )
}
