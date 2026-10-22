"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardAction,
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
import { IconPlaceholder } from "@/icons/icon-placeholder"

export const description = "Basal insulin dose titration, as a step line chart"

// Units of basal insulin, adjusted every few days. Fictional.
const chartData = [
  { day: "Day 1", dose: 10 },
  { day: "Day 4", dose: 12 },
  { day: "Day 7", dose: 14 },
  { day: "Day 10", dose: 16 },
  { day: "Day 13", dose: 16 },
  { day: "Day 16", dose: 18 },
  { day: "Day 19", dose: 18 },
]

const chartConfig = {
  dose: {
    label: "Basal insulin (units)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const latest = chartData.at(-1)!

const first = chartData[0]!

export function ChartLineInsulin() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Insulin titration</CardTitle>
        <CardDescription>Basal dose, adjusted every three days</CardDescription>
        <CardAction className="flex flex-col items-end gap-1.5">
          <div className="text-2xl leading-none font-semibold">
            {latest.dose}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              units
            </span>
          </div>
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
              tickFormatter={(value) => value.replace("Day ", "")}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="dose"
              type="step"
              stroke="var(--color-dose)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {latest.dose >= first.dose ? "Up" : "Down"} from {first.dose} to{" "}
          {latest.dose} units{" "}
          {latest.dose < first.dose ? (
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
          {first.day} to {latest.day}; illustrative, not a protocol
        </div>
      </CardFooter>
    </Card>
  )
}
