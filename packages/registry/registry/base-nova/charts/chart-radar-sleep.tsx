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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description =
  "Sleep quality by domain, as a radar chart with a circular grid"

// Scores from 0 to 3, lower is better, as sleep questionnaires often score.
const chartData = [
  { domain: "Quality", score: 2 },
  { domain: "Latency", score: 3 },
  { domain: "Duration", score: 1 },
  { domain: "Efficiency", score: 2 },
  { domain: "Disturbance", score: 1 },
  { domain: "Daytime", score: 2 },
]

const chartConfig = {
  score: {
    label: "Score (0–3)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const worst = chartData.reduce((a, b) => (b.score > a.score ? b : a))

export function ChartRadarSleep() {
  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Sleep</CardTitle>
        <CardDescription>Questionnaire domains, last month</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarGrid gridType="circle" />
            <PolarAngleAxis dataKey="domain" />
            <Radar
              dataKey="score"
              fill="var(--color-score)"
              fillOpacity={0.6}
              dot={{ r: 4, fillOpacity: 1 }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {worst.domain} scores worst, at {worst.score} of 3
        </div>
        <div className="leading-none text-muted-foreground">
          Higher is worse; a fictional patient
        </div>
      </CardFooter>
    </Card>
  )
}
