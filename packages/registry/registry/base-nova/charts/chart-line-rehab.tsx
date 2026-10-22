"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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
  "Resting heart rate and daily steps during cardiac rehab, as an interactive line chart"

// Repeatable noise between -1 and 1, so the server and browser draw the same
// chart.
function noise(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

// Daily wearable readings for a fictional patient over 12 weeks of cardiac
// rehab: resting heart rate falls as daily steps rise.
const chartData = Array.from({ length: 84 }, (_, day) => {
  const date = new Date(Date.UTC(2026, 3, 1 + day))
  return {
    date: date.toISOString().slice(0, 10),
    heartRate: Math.round(74 - day / 8 + 2.5 * noise(day)),
    steps: Math.round(3200 + day * 55 + 900 * noise(day + 100)),
  }
})

const chartConfig = {
  heartRate: {
    label: "Resting heart rate",
    color: "var(--chart-2)",
  },
  steps: {
    label: "Steps",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

// The last week's average, the figure a clinician would quote.
const lastWeek = chartData.slice(-7)
const average = {
  heartRate: Math.round(
    lastWeek.reduce((acc, curr) => acc + curr.heartRate, 0) / lastWeek.length
  ),
  steps: Math.round(
    lastWeek.reduce((acc, curr) => acc + curr.steps, 0) / lastWeek.length
  ),
}

const units = { heartRate: "bpm", steps: "a day" }

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
  const [activeChart, setActiveChart] = React.useState<"heartRate" | "steps">(
    "heartRate"
  )

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Cardiac rehab</CardTitle>
          <CardDescription>
            Wearable readings over 12 weeks, with last week&apos;s averages; a
            fictional patient
          </CardDescription>
        </div>
        <div className="flex">
          {(["heartRate", "steps"] as const).map((chart) => (
            <button
              key={chart}
              type="button"
              aria-pressed={activeChart === chart}
              data-active={activeChart === chart}
              className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveChart(chart)}
            >
              <span className="text-xs text-muted-foreground">
                {chartConfig[chart].label}
              </span>
              <span className="text-lg leading-none font-bold whitespace-nowrap sm:text-3xl">
                {average[chart].toLocaleString("en-US")}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  {units[chart]}
                </span>
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
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
            <YAxis hide domain={["dataMin - 3", "dataMax + 3"]} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  labelFormatter={(value) =>
                    formatDate(String(value), { year: "numeric" })
                  }
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
