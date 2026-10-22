"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

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
  "Continuous glucose monitor time in range by week, as a stacked bar chart"

// Share of each week a fictional patient's sensor glucose spent in each
// range, in percent. The ranges are the international consensus ones.
const chartData = [
  { week: "Week 1", veryLow: 2, low: 5, inRange: 58, high: 25, veryHigh: 10 },
  { week: "Week 2", veryLow: 1, low: 4, inRange: 63, high: 23, veryHigh: 9 },
  { week: "Week 3", veryLow: 1, low: 3, inRange: 68, high: 21, veryHigh: 7 },
  { week: "Week 4", veryLow: 0, low: 2, inRange: 74, high: 18, veryHigh: 6 },
]

// One ramp from low to high glucose, so the order of the stack reads at a
// glance.
const chartConfig = {
  veryHigh: {
    label: "Very high (>250)",
    color: "var(--chart-1)",
  },
  high: {
    label: "High (181–250)",
    color: "var(--chart-2)",
  },
  inRange: {
    label: "In range (70–180)",
    color: "var(--chart-3)",
  },
  low: {
    label: "Low (54–69)",
    color: "var(--chart-4)",
  },
  veryLow: {
    label: "Very low (<54)",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

// The ranges from lowest to highest, the order they stack from the base.
const ranges = ["veryLow", "low", "inRange", "high", "veryHigh"] as const

// Consensus targets for most adults: over 70% in range, under 4% below 70.
const targets = { inRange: 70, below: 4 }
const first = chartData[0]!
const latest = chartData.at(-1)!
const atTarget =
  latest.inRange > targets.inRange &&
  latest.low + latest.veryLow < targets.below

export function ChartBarTimeInRange() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Time in range</CardTitle>
        <CardDescription>Sensor glucose, mg/dL, by week</CardDescription>
        <CardAction className="flex flex-col items-end gap-1.5">
          <div className="text-2xl leading-none font-semibold">
            {latest.inRange}%{" "}
            <span className="text-sm font-normal text-muted-foreground">
              in range
            </span>
          </div>
          <Badge variant="outline">
            {atTarget ? (
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
            {atTarget ? "At target" : "Below target"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="week"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis hide domain={[0, 100]} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => (
                    <div className="flex min-w-[150px] items-center text-xs text-muted-foreground">
                      {chartConfig[name as keyof typeof chartConfig]?.label}
                      <span className="ml-auto font-mono font-medium text-foreground tabular-nums">
                        {value}%
                      </span>
                    </div>
                  )}
                />
              }
            />
            {ranges.map((range, index) => (
              <Bar
                key={range}
                dataKey={range}
                stackId="a"
                fill={`var(--color-${range})`}
                maxBarSize={48}
                radius={
                  index === 0
                    ? [0, 0, 4, 4]
                    : index === ranges.length - 1
                      ? [4, 4, 0, 0]
                      : 0
                }
              />
            ))}
            {/* Highest to lowest, the order the stack reads from the top. */}
            <ChartLegend
              itemSorter={(item) =>
                -ranges.indexOf(item.dataKey as (typeof ranges)[number])
              }
              content={<ChartLegendContent className="flex-wrap" />}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {latest.inRange >= first.inRange ? "Up" : "Down"}{" "}
          {Math.abs(latest.inRange - first.inRange)} points since{" "}
          {first.week.toLowerCase()}
        </div>
        <div className="leading-none text-muted-foreground">
          Targets: over {targets.inRange}% in range, under {targets.below}% low
        </div>
      </CardFooter>
    </Card>
  )
}
