"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { IconPlaceholder } from "@/icons/icon-placeholder"

export const description =
  "Clinic appointments attended and missed, as a stacked bar chart"

// Outpatient appointments per month, illustrative.
const chartData = [
  { month: "January", attended: 486, missed: 64 },
  { month: "February", attended: 505, missed: 58 },
  { month: "March", attended: 537, missed: 71 },
  { month: "April", attended: 473, missed: 49 },
  { month: "May", attended: 509, missed: 52 },
  { month: "June", attended: 514, missed: 47 },
]

const chartConfig = {
  attended: {
    label: "Attended",
    color: "var(--chart-2)",
  },
  missed: {
    label: "Missed",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const first = chartData[0]!
const last = chartData.at(-1)!
const change = Math.round(((last.missed - first.missed) / first.missed) * 100)
const missed = chartData.reduce((sum, { missed }) => sum + missed, 0)
const booked = chartData.reduce(
  (sum, { attended, missed }) => sum + attended + missed,
  0
)

export function ChartBarAppointments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments</CardTitle>
        <CardDescription>Attended and missed, by month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="attended"
              stackId="a"
              fill="var(--color-attended)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="missed"
              stackId="a"
              fill="var(--color-missed)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Missed {change < 0 ? "down" : "up"} {Math.abs(change)}% since{" "}
          {first.month}{" "}
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
          {Math.round((missed / booked) * 100)}% missed overall; illustrative
          data
        </div>
      </CardFooter>
    </Card>
  )
}
