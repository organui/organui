"use client"

import { Pie, PieChart } from "recharts"

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
  "Blood donations by ABO group against the population, as two rings"

// Units donated this month, illustrative, and the share of people in each
// group, roughly as in the UK. Use your own population's figures.
const groups = [
  { type: "o", units: 412, population: 48 },
  { type: "a", units: 356, population: 38 },
  { type: "b", units: 98, population: 10 },
  { type: "ab", units: 34, population: 4 },
]

const units = groups.reduce((sum, { units }) => sum + units, 0)
const chartData = groups.map((group) => ({
  ...group,
  donated: Math.round((group.units / units) * 100),
  fill: `var(--color-${group.type})`,
}))

const chartConfig = {
  donated: {
    label: "Donations",
  },
  population: {
    label: "Population",
  },
  o: {
    label: "O",
    color: "var(--chart-1)",
  },
  a: {
    label: "A",
    color: "var(--chart-2)",
  },
  b: {
    label: "B",
    color: "var(--chart-3)",
  },
  ab: {
    label: "AB",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

// The group donated furthest below its share of the population.
const short = chartData.reduce((a, b) =>
  b.donated - b.population < a.donated - a.population ? b : a
)
const shortfall = short.donated < short.population
const label = chartConfig[short.type as keyof typeof chartConfig].label

export function ChartPieBloodTypes() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Blood donations</CardTitle>
        <CardDescription>Outer: units donated. Inner: people.</CardDescription>
        <CardAction>
          <Badge variant="outline">
            {shortfall ? (
              <IconPlaceholder
                lucide="TriangleAlertIcon"
                tabler="IconAlertTriangle"
                hugeicons="Alert02Icon"
                phosphor="WarningIcon"
                remixicon="RiAlertLine"
                data-icon="inline-start"
              />
            ) : (
              <IconPlaceholder
                lucide="CheckIcon"
                tabler="IconCheck"
                hugeicons="Tick02Icon"
                phosphor="CheckIcon"
                remixicon="RiCheckLine"
                data-icon="inline-start"
              />
            )}
            {shortfall ? `Type ${label} short` : "In proportion"}
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
              content={
                <ChartTooltipContent
                  hideLabel
                  nameKey="type"
                  formatter={(value, name, item) => (
                    <div className="flex min-w-[130px] items-center gap-2 text-xs text-muted-foreground">
                      <div
                        className="size-2.5 shrink-0 rounded-[2px]"
                        style={{ background: item.payload.fill }}
                      />
                      {
                        chartConfig[
                          item.payload.type as keyof typeof chartConfig
                        ].label
                      }
                      ,{" "}
                      {chartConfig[
                        name as keyof typeof chartConfig
                      ]?.label.toLowerCase()}
                      <span className="ml-auto font-mono font-medium text-foreground tabular-nums">
                        {value}%
                      </span>
                    </div>
                  )}
                />
              }
            />
            {/* People inside, donations outside, so a gap reads across. */}
            <Pie
              data={chartData}
              dataKey="population"
              nameKey="type"
              innerRadius={40}
              outerRadius={64}
              fillOpacity={0.45}
              strokeWidth={2}
            />
            <Pie
              data={chartData}
              dataKey="donated"
              nameKey="type"
              innerRadius={70}
              outerRadius={100}
              strokeWidth={2}
            />
          </PieChart>
        </ChartContainer>
        {/* One key for both rings, which share their colors. */}
        <div className="flex items-center justify-center gap-4 pt-3 text-xs">
          {chartData.map(({ type }) => (
            <div key={type} className="flex items-center gap-1.5">
              <div
                className="size-2 shrink-0 rounded-[2px]"
                style={{
                  background: chartConfig[type as "o" | "a" | "b" | "ab"].color,
                }}
              />
              {chartConfig[type as keyof typeof chartConfig].label}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Type {label} is {short.donated}% of units, {short.population}% of
          people
        </div>
        <div className="leading-none text-muted-foreground">
          This month; illustrative data
        </div>
      </CardFooter>
    </Card>
  )
}
