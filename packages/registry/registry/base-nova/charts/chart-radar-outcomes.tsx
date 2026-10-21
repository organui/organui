"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

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

export const description =
  "Patient-reported outcomes before and after, as a radar chart"

// Scores from 0 to 100, higher is better, a fictional patient.
const chartData = [
  { domain: "Mobility", before: 42, after: 71 },
  { domain: "Self-care", before: 55, after: 80 },
  { domain: "Activities", before: 38, after: 66 },
  { domain: "Pain", before: 30, after: 64 },
  { domain: "Mood", before: 58, after: 72 },
]

const chartConfig = {
  before: {
    label: "Before surgery",
    color: "var(--chart-1)",
  },
  after: {
    label: "Six months after",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartRadarOutcomes() {
  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Outcomes</CardTitle>
        <CardDescription>
          Before and six months after a hip replacement
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis dataKey="domain" />
            <PolarGrid />
            <Radar
              dataKey="before"
              fill="var(--color-before)"
              fillOpacity={0.6}
            />
            <Radar
              dataKey="after"
              fill="var(--color-after)"
              fillOpacity={0.6}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Better in every domain; a fictional patient.
      </CardFooter>
    </Card>
  )
}
