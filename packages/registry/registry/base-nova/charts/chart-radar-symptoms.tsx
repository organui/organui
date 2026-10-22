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

export const description = "A symptom profile, as a radar chart"

// Patient-reported severity from 0 to 10, a fictional patient.
const chartData = [
  { symptom: "Pain", severity: 6 },
  { symptom: "Fatigue", severity: 8 },
  { symptom: "Nausea", severity: 3 },
  { symptom: "Breathlessness", severity: 5 },
  { symptom: "Anxiety", severity: 4 },
  { symptom: "Appetite", severity: 6 },
]

const chartConfig = {
  severity: {
    label: "Severity (0–10)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const worst = chartData.reduce((a, b) => (b.severity > a.severity ? b : a))

export function ChartRadarSymptoms() {
  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Symptoms</CardTitle>
        <CardDescription>Self-reported severity today</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="symptom" />
            <PolarGrid />
            <Radar
              dataKey="severity"
              fill="var(--color-severity)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {worst.symptom} scores highest, at {worst.severity} of 10
        </div>
        <div className="leading-none text-muted-foreground">
          Self-reported today; a fictional patient
        </div>
      </CardFooter>
    </Card>
  )
}
