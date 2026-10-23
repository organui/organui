"use client"

import { Label, Pie, PieChart, usePlotArea } from "recharts"

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
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { IconPlaceholder } from "@/icons/icon-placeholder"

export const description =
  "Proportion of days covered by a medication over a year, as a donut chart"

// Days in the last year a fictional patient had their statin on hand, from
// pharmacy fills.
const days = { covered: 303, total: 365 }

const chartData = [
  { status: "covered", days: days.covered, fill: "var(--color-covered)" },
  {
    status: "uncovered",
    days: days.total - days.covered,
    fill: "var(--color-uncovered)",
  },
]

const chartConfig = {
  days: {
    label: "Days",
  },
  covered: {
    label: "Covered",
    color: "var(--chart-2)",
  },
  uncovered: {
    label: "Without medication",
    color: "var(--muted)",
  },
} satisfies ChartConfig

// The usual threshold for calling a patient adherent.
const threshold = 80
const pdc = Math.round((days.covered / days.total) * 100)
const adherent = pdc >= threshold
const radius = { inner: 64, outer: 88 }

// The threshold as a dashed spoke across the ring, clockwise from the top.
function ThresholdSpoke() {
  const plot = usePlotArea()
  if (!plot) return null
  const cx = plot.x + plot.width / 2
  const cy = plot.y + plot.height / 2
  const angle = ((90 - (threshold / 100) * 360) * Math.PI) / 180
  const at = (r: number) => ({
    x: cx + r * Math.cos(angle),
    y: cy - r * Math.sin(angle),
  })
  const start = at(radius.inner - 4)
  const end = at(radius.outer + 4)
  const label = at(radius.outer + 16)
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
        {threshold}%
      </text>
    </g>
  )
}

export function ChartPiePdc() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Statin adherence</CardTitle>
        <CardDescription>Proportion of days covered, last year</CardDescription>
        <CardAction>
          <Badge variant="outline">
            {adherent ? (
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
            {adherent ? "Adherent" : "Below threshold"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="days"
              nameKey="status"
              innerRadius={radius.inner}
              outerRadius={radius.outer}
              startAngle={90}
              endAngle={-270}
              strokeWidth={2}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {pdc}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          PDC
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            <ThresholdSpoke />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {days.total - days.covered} days without medication
        </div>
        <div className="leading-none text-muted-foreground">
          {threshold}% or more counts as adherent; a fictional patient
        </div>
      </CardFooter>
    </Card>
  )
}
