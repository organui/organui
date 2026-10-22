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

export const description = "Vaccine doses by age group, as a multiple bar chart"

// Doses given at one clinic, illustrative.
const chartData = [
  { age: "0–4", first: 186, second: 140 },
  { age: "5–17", first: 305, second: 230 },
  { age: "18–49", first: 437, second: 320 },
  { age: "50–64", first: 373, second: 310 },
  { age: "65+", first: 409, second: 380 },
]

const chartConfig = {
  first: {
    label: "First dose",
    color: "var(--chart-2)",
  },
  second: {
    label: "Second dose",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartBarVaccinations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vaccinations</CardTitle>
        <CardDescription>Doses given by age group</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="age"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="first" fill="var(--color-first)" radius={4} />
            <Bar dataKey="second" fill="var(--color-second)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Second doses trail in every group
        </div>
        <div className="leading-none text-muted-foreground">
          Closest in 65+, at 93%; illustrative data
        </div>
      </CardFooter>
    </Card>
  )
}
