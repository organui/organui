"use client"

import {
  CartesianGrid,
  ComposedChart,
  ErrorBar,
  Label,
  ReferenceLine,
  Scatter,
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
  type ChartConfig,
} from "@/components/ui/chart"

export const description =
  "A forest plot of hazard ratios with 95% confidence intervals by subgroup"

// Hazard ratios, treatment against control, for a fictional trial.
const subgroups = [
  { subgroup: "Overall", ratio: 0.48, low: 0.3, high: 0.77 },
  { subgroup: "Age < 65", ratio: 0.44, low: 0.24, high: 0.81 },
  { subgroup: "Age ≥ 65", ratio: 0.55, low: 0.28, high: 1.07 },
  { subgroup: "Women", ratio: 0.51, low: 0.26, high: 1.0 },
  { subgroup: "Men", ratio: 0.46, low: 0.25, high: 0.85 },
  { subgroup: "Diabetes", ratio: 0.62, low: 0.31, high: 1.24 },
]

// The interval as distances below and above the ratio, as the error bar
// draws it.
const chartData = subgroups.map((row) => ({
  ...row,
  interval: [row.ratio - row.low, row.high - row.ratio],
}))

const chartConfig = {
  ratio: {
    label: "Hazard ratio",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

// Intervals entirely below 1 favour treatment with confidence.
const confident = chartData.filter(({ high }) => high < 1)

export function ChartLineForestPlot() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subgroups</CardTitle>
        <CardDescription>Hazard ratio with 95% CI, log scale</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 8, right: 16, top: 16 }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              scale="log"
              domain={[0.2, 2]}
              ticks={[0.25, 0.5, 1, 2]}
              allowDataOverflow
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              type="category"
              dataKey="subgroup"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={80}
            />
            {/* A ratio of 1 means no difference between the arms. */}
            <ReferenceLine
              x={1}
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
            >
              <Label
                value="No effect"
                position="top"
                className="fill-muted-foreground"
                fontSize={11}
              />
            </ReferenceLine>
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                const row = payload?.[0]?.payload as
                  (typeof chartData)[number] | undefined
                if (!active || !row) return null
                return (
                  <div className="grid min-w-[9rem] gap-1 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl">
                    <div className="font-medium">{row.subgroup}</div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-muted-foreground">HR</span>
                      <span className="font-mono font-medium tabular-nums">
                        {row.ratio.toFixed(2)} ({row.low.toFixed(2)}–
                        {row.high.toFixed(2)})
                      </span>
                    </div>
                  </div>
                )
              }}
            />
            <Scatter dataKey="ratio" fill="var(--color-ratio)" shape="square">
              <ErrorBar
                dataKey="interval"
                direction="x"
                width={0}
                stroke="var(--color-ratio)"
                strokeWidth={2}
              />
            </Scatter>
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {confident.length} of {chartData.length} intervals sit below 1
        </div>
        <div className="leading-none text-muted-foreground">
          Below 1 favours treatment; a fictional trial
        </div>
      </CardFooter>
    </Card>
  )
}
