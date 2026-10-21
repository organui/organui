"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

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
  "Most common discharge diagnoses, as a horizontal bar chart"

// Discharges in one quarter, illustrative.
const chartData = [
  { diagnosis: "Pneumonia", discharges: 186 },
  { diagnosis: "Heart failure", discharges: 152 },
  { diagnosis: "Sepsis", discharges: 137 },
  { diagnosis: "COPD", discharges: 113 },
  { diagnosis: "Hip fracture", discharges: 89 },
]

const chartConfig = {
  discharges: {
    label: "Discharges",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartBarDiagnoses() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top diagnoses</CardTitle>
        <CardDescription>Discharges this quarter</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 24 }}
          >
            <XAxis type="number" dataKey="discharges" hide />
            <YAxis
              dataKey="diagnosis"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={88}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="discharges"
              fill="var(--color-discharges)"
              radius={5}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Illustrative data, not a real hospital&apos;s.
      </CardFooter>
    </Card>
  )
}
