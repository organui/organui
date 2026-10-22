"use client"

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Label,
  Line,
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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description =
  "An ambulatory glucose profile: the median and percentile bands over a day"

// A bump centred on an hour of the day, for the shape of the sample data.
function bump(hour: number, centre: number, width: number) {
  return Math.exp(-(((hour - centre) / width) ** 2) / 2)
}

// Fourteen days of sensor glucose for a fictional patient, folded into one
// day: the median at each hour, with the 25th–75th and 5th–95th percentiles.
// It rises before waking and after each meal.
const chartData = Array.from({ length: 24 }, (_, hour) => {
  const median =
    104 +
    14 * bump(hour, 5.5, 1.5) +
    44 * bump(hour, 8.5, 1.2) +
    50 * bump(hour, 13.5, 1.3) +
    58 * bump(hour, 19.5, 1.4)
  const spread = 14 + (median - 100) * 0.3
  return {
    time: `${String(hour).padStart(2, "0")}:00`,
    median: Math.round(median),
    middle: [Math.round(median - spread), Math.round(median + spread)],
    outer: [
      Math.round(median - spread * 2.2),
      Math.round(median + spread * 2.4),
    ],
  }
})

const chartConfig = {
  median: {
    label: "Median",
    color: "var(--chart-2)",
  },
  middle: {
    label: "25th–75th",
    color: "var(--chart-2)",
  },
  outer: {
    label: "5th–95th",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

// The consensus target range, in mg/dL.
const target = { low: 70, high: 180 }
const peak = chartData.reduce((a, b) => (b.median > a.median ? b : a))

export function ChartAreaGlucoseProfile() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Glucose profile</CardTitle>
        <CardDescription>14 days folded into one, mg/dL</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart
            accessibilityLayer
            data={chartData}
            margin={{ left: -12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={5}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[40, 280]}
              ticks={[target.low, target.high, 250]}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value, name) => (
                    <div className="flex min-w-[130px] items-center text-xs text-muted-foreground">
                      {chartConfig[name as keyof typeof chartConfig]?.label}
                      <span className="ml-auto font-mono font-medium text-foreground tabular-nums">
                        {Array.isArray(value) ? value.join("–") : value}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Area
              dataKey="outer"
              type="monotone"
              fill="var(--color-outer)"
              fillOpacity={0.25}
              stroke="none"
              activeDot={false}
            />
            <Area
              dataKey="middle"
              type="monotone"
              fill="var(--color-middle)"
              fillOpacity={0.35}
              stroke="none"
              activeDot={false}
            />
            <Line
              dataKey="median"
              type="monotone"
              stroke="var(--color-median)"
              strokeWidth={2}
              dot={false}
            />
            {[target.low, target.high].map((limit) => (
              <ReferenceLine
                key={limit}
                y={limit}
                stroke="var(--muted-foreground)"
                strokeDasharray="4 4"
              >
                {limit === target.low && (
                  <Label
                    value={`Target ${target.low}–${target.high}`}
                    position="insideBottomRight"
                    dy={16}
                    className="fill-muted-foreground"
                    fontSize={11}
                  />
                )}
              </ReferenceLine>
            ))}
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Highest at {peak.time}, median {peak.median} mg/dL
        </div>
        <div className="leading-none text-muted-foreground">
          Median with 25th–75th and 5th–95th percentiles; a fictional patient
        </div>
      </CardFooter>
    </Card>
  )
}
