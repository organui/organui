"use client"

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart"
import { IconPlaceholder } from "@/icons/icon-placeholder"

export const description =
  "A NEWS2 early warning score, as a radar of each parameter's points"

// One set of observations for a fictional patient on a ward.
const observations = {
  respirationRate: 22,
  oxygenSaturation: 94,
  onOxygen: false,
  systolic: 104,
  pulse: 98,
  alert: true,
  temperature: 38.4,
}

// Points for a value against NEWS2 bands, each [upper limit, points] in
// order; a value above every limit scores the last band's points.
function band(value: number, bands: [number, number][], above: number) {
  return bands.find(([limit]) => value <= limit)?.[1] ?? above
}

// The Royal College of Physicians' NEWS2 chart, with SpO2 scale 1. Check it
// against the chart your organisation uses before relying on it.
const chartData = [
  {
    parameter: "Respiration rate",
    short: "RR",
    reading: `${observations.respirationRate}/min`,
    points: band(
      observations.respirationRate,
      [
        [8, 3],
        [11, 1],
        [20, 0],
        [24, 2],
      ],
      3
    ),
  },
  {
    parameter: "Oxygen saturation",
    short: "SpO₂",
    reading: `${observations.oxygenSaturation}%`,
    points: band(
      observations.oxygenSaturation,
      [
        [91, 3],
        [93, 2],
        [95, 1],
      ],
      0
    ),
  },
  {
    parameter: "Air or oxygen",
    short: "O₂",
    reading: observations.onOxygen ? "Oxygen" : "Air",
    points: observations.onOxygen ? 2 : 0,
  },
  {
    parameter: "Systolic blood pressure",
    short: "SBP",
    reading: `${observations.systolic} mmHg`,
    points: band(
      observations.systolic,
      [
        [90, 3],
        [100, 2],
        [110, 1],
        [219, 0],
      ],
      3
    ),
  },
  {
    parameter: "Pulse",
    short: "Pulse",
    reading: `${observations.pulse}/min`,
    points: band(
      observations.pulse,
      [
        [40, 3],
        [50, 1],
        [90, 0],
        [110, 1],
        [130, 2],
      ],
      3
    ),
  },
  {
    parameter: "Consciousness",
    short: "ACVPU",
    reading: observations.alert ? "Alert" : "New confusion or less",
    points: observations.alert ? 0 : 3,
  },
  {
    parameter: "Temperature",
    short: "Temp",
    reading: `${observations.temperature} °C`,
    points: band(
      observations.temperature,
      [
        [35, 3],
        [36, 1],
        [38, 0],
        [39, 1],
      ],
      2
    ),
  },
]

const chartConfig = {
  points: {
    label: "Points",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

// The clinical risk NEWS2 assigns: a total of 7 or more is high, 5 or more
// is medium, and any single parameter scoring 3 raises a low total to
// low–medium.
const total = chartData.reduce((sum, { points }) => sum + points, 0)
const anyThree = chartData.some(({ points }) => points === 3)
const risk =
  total >= 7 ? "High" : total >= 5 ? "Medium" : anyThree ? "Low–medium" : "Low"
const highest = chartData.reduce((a, b) => (b.points > a.points ? b : a))

export function ChartRadarNews2() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>NEWS2</CardTitle>
        <CardDescription>
          Early warning score, latest observations
        </CardDescription>
        <CardAction className="flex flex-col items-end gap-1.5">
          <div className="text-2xl leading-none font-semibold">
            {total}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              points
            </span>
          </div>
          <Badge variant="outline">
            {risk === "Low" ? (
              <IconPlaceholder
                lucide="CheckIcon"
                tabler="IconCheck"
                hugeicons="Tick02Icon"
                phosphor="CheckIcon"
                remixicon="RiCheckLine"
                data-icon="inline-start"
              />
            ) : (
              <IconPlaceholder
                lucide="TriangleAlertIcon"
                tabler="IconAlertTriangle"
                hugeicons="Alert02Icon"
                phosphor="WarningIcon"
                remixicon="RiAlertLine"
                data-icon="inline-start"
              />
            )}
            {risk} risk
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData} outerRadius="66%">
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                const row = payload?.[0]?.payload as
                  (typeof chartData)[number] | undefined
                if (!active || !row) return null
                return (
                  <div className="grid min-w-[9rem] gap-1 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl">
                    <div className="font-medium">{row.parameter}</div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-muted-foreground">
                        {row.reading}
                      </span>
                      <span className="font-mono font-medium tabular-nums">
                        {row.points} pts
                      </span>
                    </div>
                  </div>
                )
              }}
            />
            {/* The short names the NEWS2 chart prints; the tooltip gives each in
                full. */}
            <PolarAngleAxis dataKey="short" />
            {/* Rings at 1, 2 and 3 points, the most one parameter scores. */}
            <PolarRadiusAxis
              domain={[0, 3]}
              tickCount={4}
              tick={false}
              axisLine={false}
            />
            <PolarGrid />
            <Radar
              dataKey="points"
              fill="var(--color-points)"
              fillOpacity={0.6}
              dot={{ r: 4, fillOpacity: 1 }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {highest.points
            ? `${highest.parameter} scores most, ${highest.points} points`
            : "Every parameter scores 0"}
        </div>
        <div className="leading-none text-muted-foreground">
          Follow your local escalation policy; a fictional patient
        </div>
      </CardFooter>
    </Card>
  )
}
