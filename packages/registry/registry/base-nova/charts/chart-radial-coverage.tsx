"use client"

import { RadialBar, RadialBarChart } from "recharts"

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

const lowest = chartData.reduce((a, b) => (b.coverage < a.coverage ? b : a))
const others = Math.min(
  ...chartData.filter((item) => item !== lowest).map(({ coverage }) => coverage)
)

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
          <RadialBarChart data={chartData} innerRadius={30} outerRadius={110}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="vaccine" />}
            />
            <RadialBar dataKey="coverage" background />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {chartConfig[lowest.vaccine as keyof typeof chartConfig].label} lags,
          at {lowest.coverage}%
        </div>
        <div className="leading-none text-muted-foreground">
          The others reach {others}% or more; illustrative data
        </div>
      </CardFooter>
    </Card>
  )
}
