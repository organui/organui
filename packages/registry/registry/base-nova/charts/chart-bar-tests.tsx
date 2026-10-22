"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
  "Blood tests and imaging ordered by day, as an interactive bar chart"

// Repeatable noise between -1 and 1, so the server and browser draw the same
// chart.
function noise(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

// Daily orders from April to June, illustrative: fewer at weekends.
const chartData = Array.from({ length: 91 }, (_, day) => {
  const date = new Date(Date.UTC(2026, 3, 1 + day))
  const weekend = [0, 6].includes(date.getUTCDay())
  return {
    date: date.toISOString().slice(0, 10),
    bloodTests: (weekend ? 310 : 520) + Math.round(70 * noise(day)),
    imaging: (weekend ? 70 : 150) + Math.round(25 * noise(day + 100)),
  }
})

const chartConfig = {
  orders: {
    label: "Orders",
  },
  bloodTests: {
    label: "Blood tests",
    color: "var(--chart-2)",
  },
  imaging: {
    label: "Imaging",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const total = {
  bloodTests: chartData.reduce((acc, curr) => acc + curr.bloodTests, 0),
  imaging: chartData.reduce((acc, curr) => acc + curr.imaging, 0),
}

// Dates are UTC days, so they read the same on the server and in the browser.
function formatDate(value: string, options?: Intl.DateTimeFormatOptions) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
    ...options,
  })
}

export function ChartBarTests() {
  const [activeChart, setActiveChart] = React.useState<
    "bloodTests" | "imaging"
  >("bloodTests")

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle>Tests ordered</CardTitle>
          <CardDescription>
            Orders per day for the last 3 months; illustrative data
          </CardDescription>
        </div>
        <div className="flex">
          {(["bloodTests", "imaging"] as const).map((chart) => (
            <button
              key={chart}
              type="button"
              aria-pressed={activeChart === chart}
              data-active={activeChart === chart}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveChart(chart)}
            >
              <span className="text-xs text-muted-foreground">
                {chartConfig[chart].label}
              </span>
              <span className="text-lg leading-none font-bold sm:text-3xl">
                {total[chart].toLocaleString("en-US")}
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
          <BarChart
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
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="orders"
                  labelFormatter={(value) =>
                    formatDate(String(value), { year: "numeric" })
                  }
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
