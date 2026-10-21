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
      <CardFooter className="text-sm text-muted-foreground">
        About one in ten missed; illustrative data.
      </CardFooter>
    </Card>
  )
}
