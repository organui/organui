"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  ReferenceLine,
  XAxis,
} from "recharts"

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

const average = Math.round(
  chartData.reduce((sum, { visits }) => sum + visits, 0) / chartData.length
)

const busiest = chartData.reduce((a, b) => (b.visits > a.visits ? b : a))

export function ChartBarEdVisits() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ED visits</CardTitle>
        <CardDescription>Average per weekday</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} margin={{ right: 52 }}>
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
            <ReferenceLine
              y={average}
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
            >
              <Label
                value={`Avg ${average}`}
                position="right"
                className="fill-muted-foreground"
                fontSize={11}
              />
            </ReferenceLine>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {busiest.day}s are busiest, at {busiest.visits} visits
        </div>
        <div className="leading-none text-muted-foreground">
          Average per weekday; illustrative data
        </div>
      </CardFooter>
    </Card>
  )
}
