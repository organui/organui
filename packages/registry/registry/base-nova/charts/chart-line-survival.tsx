"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardAction,
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
  "Kaplan–Meier survival curves for two trial arms, with censoring and numbers at risk"

// Event-free survival in percent, month by month, for a fictional trial.
const treatment = [
  100, 100, 98, 98, 96, 95, 95, 93, 92, 92, 90, 88, 88, 87, 85, 85, 84, 83, 83,
  82, 81, 81, 80, 80, 79,
]
const control = [
  100, 98, 95, 93, 90, 87, 85, 82, 80, 78, 75, 73, 71, 70, 68, 66, 65, 63, 62,
  61, 60, 59, 58, 57, 56,
]
// Months in which a patient left follow-up without an event.
const censored = {
  treatment: [6, 11, 17, 22],
  control: [4, 9, 15, 20],
}

const chartData = treatment.map((survival, month) => ({
  month,
  treatment: survival,
  control: control[month]!,
}))

// Patients still followed at each landmark, shown under the curves.
const atRisk = [
  { month: 0, treatment: 120, control: 120 },
  { month: 6, treatment: 112, control: 101 },
  { month: 12, treatment: 101, control: 82 },
  { month: 18, treatment: 93, control: 70 },
  { month: 24, treatment: 84, control: 59 },
]

// The hazard ratio as the trial reported it, treatment against control.
const hazardRatio = { value: 0.48, low: 0.3, high: 0.77 }

const chartConfig = {
  treatment: {
    label: "Treatment",
    color: "var(--chart-2)",
  },
  control: {
    label: "Control",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

// A short vertical tick where a patient was censored, as on a published
// Kaplan–Meier plot. Other points draw nothing.
function censorTick(arm: keyof typeof censored) {
  function CensorTick({
    cx,
    cy,
    index,
  }: {
    cx?: number
    cy?: number
    index?: number
  }) {
    if (cx === undefined || cy === undefined || index === undefined)
      return <g key={`${arm}-${index}`} />
    if (!censored[arm].includes(chartData[index]!.month))
      return <g key={`${arm}-${index}`} />
    return (
      <path
        key={`${arm}-${index}`}
        d={`M${cx},${cy - 5}V${cy + 5}`}
        stroke={`var(--color-${arm})`}
        strokeWidth={2}
      />
    )
  }
  return CensorTick
}

const last = chartData.at(-1)!

export function ChartLineSurvival() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event-free survival</CardTitle>
        <CardDescription>Kaplan–Meier, by trial arm</CardDescription>
        <CardAction className="flex flex-col items-end gap-1">
          <div className="text-2xl leading-none font-semibold">
            {hazardRatio.value}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              HR
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            95% CI {hazardRatio.low}–{hazardRatio.high}
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: -12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              type="number"
              domain={[0, 24]}
              ticks={atRisk.map(({ month }) => month)}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) =>
                    `Month ${payload[0]?.payload.month}`
                  }
                  formatter={(value, name) => (
                    <div className="flex min-w-[120px] items-center text-xs text-muted-foreground">
                      {chartConfig[name as keyof typeof chartConfig]?.label}
                      <span className="ml-auto font-mono font-medium text-foreground tabular-nums">
                        {value}%
                      </span>
                    </div>
                  )}
                />
              }
            />
            {(["treatment", "control"] as const).map((arm) => (
              <Line
                key={arm}
                dataKey={arm}
                type="stepAfter"
                stroke={`var(--color-${arm})`}
                strokeWidth={2}
                dot={censorTick(arm)}
                activeDot={{ r: 4 }}
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
        {/* Numbers at risk, each under its landmark on the time axis. The
            row is inset by the plot's margins (the y-axis's 60px less the
            chart's -12px, and 12px on the right). */}
        <div className="grid gap-1 text-xs">
          <div className="font-medium">Number at risk</div>
          {(["treatment", "control"] as const).map((arm) => (
            <div key={arm} className="flex items-center">
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-[2px]"
                style={{ background: chartConfig[arm].color }}
              />
              <span className="sr-only">{chartConfig[arm].label}</span>
              <div className="relative mr-3 ml-[38px] h-4 flex-1 font-mono text-muted-foreground tabular-nums">
                {atRisk.map((landmark) => (
                  <span
                    key={landmark.month}
                    className="absolute -translate-x-1/2"
                    style={{ left: `${(landmark.month / 24) * 100}%` }}
                  >
                    {landmark[arm]}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {last.treatment}% vs {last.control}% event-free at {last.month} months
        </div>
        <div className="leading-none text-muted-foreground">
          Ticks mark censored patients; a fictional trial
        </div>
      </CardFooter>
    </Card>
  )
}
