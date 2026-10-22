"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description =
  "Emergency department arrivals by day, as an interactive area chart"

// Repeatable noise between -1 and 1, so the server and browser draw the same
// chart.
function noise(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return (x - Math.floor(x)) * 2 - 1
}

// Daily arrivals from April to June, illustrative: busier on Mondays.
const chartData = Array.from({ length: 91 }, (_, day) => {
  const date = new Date(Date.UTC(2026, 3, 1 + day))
  const monday = date.getUTCDay() === 1 ? 28 : 0
  return {
    date: date.toISOString().slice(0, 10),
    walkIn: 142 + monday + Math.round(18 * noise(day)),
    ambulance: 46 + Math.round(10 * noise(day + 100)),
  }
})

const chartConfig = {
  arrivals: {
    label: "Arrivals",
  },
  walkIn: {
    label: "Walk-in",
    color: "var(--chart-2)",
  },
  ambulance: {
    label: "Ambulance",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

// Each range is its own label, so the select shows it in Base UI and Radix.
const timeRanges = {
  "Last 3 months": 90,
  "Last 30 days": 30,
  "Last 7 days": 7,
}

// Dates are UTC days, so they read the same on the server and in the browser.
function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })
}

export function ChartAreaEdArrivals() {
  const [timeRange, setTimeRange] =
    React.useState<keyof typeof timeRanges>("Last 3 months")
  const filteredData = chartData.slice(-timeRanges[timeRange])

  return (
    <Card className="pt-0">
      <CardHeader className="flex flex-col items-stretch gap-2 space-y-0 border-b py-5 sm:flex-row sm:items-center">
        <div className="grid flex-1 gap-1">
          <CardTitle>ED arrivals</CardTitle>
          <CardDescription>
            Walk-in and ambulance arrivals per day; illustrative data
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={(next) => {
            if (next) setTimeRange(next as keyof typeof timeRanges)
          }}
        >
          <SelectTrigger
            className="w-full rounded-lg sm:ml-auto sm:w-40"
            aria-label="Time range"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {Object.keys(timeRanges).map((range) => (
              <SelectItem key={range} value={range} className="rounded-lg">
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillWalkIn" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-walkIn)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-walkIn)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillAmbulance" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-ambulance)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-ambulance)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={formatDate}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => formatDate(String(value))}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="ambulance"
              type="natural"
              fill="url(#fillAmbulance)"
              stroke="var(--color-ambulance)"
              stackId="a"
            />
            <Area
              dataKey="walkIn"
              type="natural"
              fill="url(#fillWalkIn)"
              stroke="var(--color-walkIn)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
