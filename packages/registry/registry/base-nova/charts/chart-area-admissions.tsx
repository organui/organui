"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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

export const description = "Hospital admissions by month, as an area chart"

// Illustrative data, not from a real hospital.
const chartData = [
  { month: "January", admissions: 1186 },
  { month: "February", admissions: 1305 },
  { month: "March", admissions: 1237 },
  { month: "April", admissions: 1073 },
  { month: "May", admissions: 1009 },
  { month: "June", admissions: 1114 },
]

const chartConfig = {
  admissions: {
    label: "Admissions",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartAreaAdmissions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admissions</CardTitle>
        <CardDescription>Inpatient admissions, January to June</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="admissions"
              type="natural"
              fill="var(--color-admissions)"
              fillOpacity={0.4}
              stroke="var(--color-admissions)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Busiest in February; illustrative data.
      </CardFooter>
    </Card>
  )
}
