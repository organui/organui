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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description =
  "Emergency department visits by weekday, as a bar chart"

// Average visits per weekday, illustrative.
const chartData = [
  { day: "Monday", visits: 214 },
  { day: "Tuesday", visits: 186 },
  { day: "Wednesday", visits: 179 },
  { day: "Thursday", visits: 182 },
  { day: "Friday", visits: 191 },
  { day: "Saturday", visits: 168 },
  { day: "Sunday", visits: 175 },
]

const chartConfig = {
  visits: {
    label: "Visits",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartBarEdVisits() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ED visits</CardTitle>
        <CardDescription>Average per weekday</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="visits" fill="var(--color-visits)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Mondays are busiest; illustrative data.
      </CardFooter>
    </Card>
  )
}
