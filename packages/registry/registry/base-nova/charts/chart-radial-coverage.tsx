"use client"

import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  usePlotArea,
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

export const description = "Vaccination coverage by vaccine, as a radial chart"

// Percent of eligible children covered, illustrative.
const chartData = [
  { vaccine: "mmr", coverage: 92, fill: "var(--color-mmr)" },
  { vaccine: "dtp", coverage: 95, fill: "var(--color-dtp)" },
  { vaccine: "polio", coverage: 94, fill: "var(--color-polio)" },
  { vaccine: "hepB", coverage: 89, fill: "var(--color-hepB)" },
  { vaccine: "hpv", coverage: 71, fill: "var(--color-hpv)" },
]

const chartConfig = {
  coverage: {
    label: "Coverage (%)",
  },
  mmr: {
    label: "MMR",
    color: "var(--chart-1)",
  },
  dtp: {
    label: "DTP",
    color: "var(--chart-2)",
  },
  polio: {
    label: "Polio",
    color: "var(--chart-3)",
  },
  hepB: {
    label: "Hepatitis B",
    color: "var(--chart-4)",
  },
  hpv: {
    label: "HPV",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

// Coverage that protects the whole population through herd immunity, as
// WHO sets it for measles; a common benchmark for childhood vaccines.
const target = 95
const reached = chartData.filter(({ coverage }) => coverage >= target)
const lowest = chartData.reduce((a, b) => (b.coverage < a.coverage ? b : a))

const radius = { inner: 30, outer: 96 }

// The target as a dashed spoke across the rings, at its angle on a clockwise
// ring that starts at the top, labelled just outside.
function TargetSpoke() {
  const plot = usePlotArea()
  if (!plot) return null
  const cx = plot.x + plot.width / 2
  const cy = plot.y + plot.height / 2
  const angle = ((90 - (target / 100) * 360) * Math.PI) / 180
  const at = (r: number) => ({
    x: cx + r * Math.cos(angle),
    y: cy - r * Math.sin(angle),
  })
  const start = at(radius.inner - 4)
  const end = at(radius.outer + 4)
  const label = at(radius.outer + 14)
  return (
    <g aria-hidden="true">
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke="var(--muted-foreground)"
        strokeDasharray="4 4"
      />
      <text
        x={label.x}
        y={label.y}
        textAnchor="middle"
        dominantBaseline="middle"
        className="fill-muted-foreground"
        fontSize={11}
      >
        {target}%
      </text>
    </g>
  )
}

export function ChartRadialCoverage() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Vaccine coverage</CardTitle>
        <CardDescription>Eligible children, this year</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            innerRadius={radius.inner}
            outerRadius={radius.outer}
            startAngle={90}
            endAngle={-270}
          >
            {/* Rings run clockwise from the top over 0–100%, with the target
                as a dashed spoke. */}
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="vaccine" />}
            />
            <RadialBar dataKey="coverage" background />
            <TargetSpoke />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {reached.length} of {chartData.length} reach the {target}% target
        </div>
        <div className="leading-none text-muted-foreground">
          {chartConfig[lowest.vaccine as keyof typeof chartConfig].label} lags,
          at {lowest.coverage}%; illustrative data
        </div>
      </CardFooter>
    </Card>
  )
}
