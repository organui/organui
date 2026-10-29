"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  ReferenceLine,
  XAxis,
  YAxis,
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "Daily census by status, as a stacked area chart"

// Average beds in use per day, illustrative.
const chartData = [
  { month: "January", inpatient: 186, observation: 42 },
  { month: "February", inpatient: 205, observation: 51 },
  { month: "March", inpatient: 197, observation: 47 },
  { month: "April", inpatient: 173, observation: 38 },
  { month: "May", inpatient: 169, observation: 36 },
  { month: "June", inpatient: 181, observation: 44 },
]

const chartConfig = {
  inpatient: {
    label: "Inpatient",
    color: "var(--chart-2)",
  },
  observation: {
    label: "Observation",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

// Beds the hospital can staff, the ceiling the census works against.
const staffedBeds = 260

const busiest = chartData.reduce((a, b) =>
  b.inpatient + b.observation > a.inpatient + a.observation ? b : a
)

export function ChartAreaCensus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Census</CardTitle>
        <CardDescription>
          Average beds in use per day, January to June
        </CardDescription>
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
            <YAxis hide domain={[0, staffedBeds + 20]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="observation"
              type="monotone"
              fill="var(--color-observation)"
              fillOpacity={0.4}
              stroke="var(--color-observation)"
              stackId="a"
            />
            <Area
              dataKey="inpatient"
              type="monotone"
              fill="var(--color-inpatient)"
              fillOpacity={0.4}
              stroke="var(--color-inpatient)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ReferenceLine
              y={staffedBeds}
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
            >
              <Label
                value={`Staffed beds ${staffedBeds}`}
                position="insideTopRight"
                className="fill-muted-foreground"
                fontSize={11}
              />
            </ReferenceLine>
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Busiest in {busiest.month}, at{" "}
          {busiest.inpatient + busiest.observation} beds
        </div>
        <div className="leading-none text-muted-foreground">
          Illustrative data for one hospital
        </div>
      </CardFooter>
    </Card>
  )
}
