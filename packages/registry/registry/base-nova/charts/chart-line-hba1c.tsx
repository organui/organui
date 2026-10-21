"use client"

import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"

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

export const description = "HbA1c by quarter, as a line chart with labels"

// Quarterly results in percent, a fictional patient.
const chartData = [
  { quarter: "Q1 2025", hba1c: 8.4 },
  { quarter: "Q2 2025", hba1c: 7.9 },
  { quarter: "Q3 2025", hba1c: 7.5 },
  { quarter: "Q4 2025", hba1c: 7.2 },
  { quarter: "Q1 2026", hba1c: 6.9 },
  { quarter: "Q2 2026", hba1c: 6.8 },
]

const chartConfig = {
  hba1c: {
    label: "HbA1c (%)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartLineHba1c() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>HbA1c</CardTitle>
        <CardDescription>Quarterly, over 18 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="quarter"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 2)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="hba1c"
              type="natural"
              stroke="var(--color-hba1c)"
              strokeWidth={2}
              dot={{ fill: "var(--color-hba1c)" }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Below 7% since Q1 2026; a fictional patient.
      </CardFooter>
    </Card>
  )
}
