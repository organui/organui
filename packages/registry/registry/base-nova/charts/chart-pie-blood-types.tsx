"use client"

import { Pie, PieChart } from "recharts"

import {
  Card,
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

export const description = "Blood donations by type, as a pie chart"

// Units donated this month, illustrative.
const chartData = [
  { type: "o", units: 412, fill: "var(--color-o)" },
  { type: "a", units: 356, fill: "var(--color-a)" },
  { type: "b", units: 98, fill: "var(--color-b)" },
  { type: "ab", units: 34, fill: "var(--color-ab)" },
]

const chartConfig = {
  units: {
    label: "Units",
  },
  o: {
    label: "O",
    color: "var(--chart-1)",
  },
  a: {
    label: "A",
    color: "var(--chart-2)",
  },
  b: {
    label: "B",
    color: "var(--chart-3)",
  },
  ab: {
    label: "AB",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

const units = chartData.reduce((sum, { units }) => sum + units, 0)
const top = chartData.reduce((a, b) => (b.units > a.units ? b : a))

export function ChartPieBloodTypes() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Blood donations</CardTitle>
        <CardDescription>Units by ABO type, this month</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="units" nameKey="type" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Type {chartConfig[top.type as keyof typeof chartConfig].label} makes
          up {Math.round((top.units / units) * 100)}% of units
        </div>
        <div className="leading-none text-muted-foreground">
          This month; illustrative data
        </div>
      </CardFooter>
    </Card>
  )
}
