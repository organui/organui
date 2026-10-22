"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
import { IconPlaceholder } from "@/icons/icon-placeholder"

export const description = "Oxygen flow rate over time, as a step area chart"

// Flow is changed in steps, so the chart holds each value until the next.
const chartData = [
  { time: "00:00", flow: 4 },
  { time: "02:00", flow: 4 },
  { time: "04:00", flow: 3 },
  { time: "06:00", flow: 3 },
  { time: "08:00", flow: 2 },
  { time: "10:00", flow: 2 },
  { time: "12:00", flow: 1 },
  { time: "14:00", flow: 1 },
  { time: "16:00", flow: 0 },
]

const chartConfig = {
  flow: {
    label: "Oxygen (L/min)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartAreaOxygen() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Oxygen weaning</CardTitle>
        <CardDescription>Nasal cannula flow, litres per minute</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Area
              dataKey="flow"
              type="step"
              fill="var(--color-flow)"
              fillOpacity={0.4}
              stroke="var(--color-flow)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Off oxygen by 16:00{" "}
          <IconPlaceholder
            lucide="TrendingDownIcon"
            tabler="IconTrendingDown"
            hugeicons="ChartDownIcon"
            phosphor="TrendDownIcon"
            remixicon="RiArrowDownLine"
            className="size-4"
          />
        </div>
        <div className="leading-none text-muted-foreground">
          Weaned from 4 L/min; a fictional patient
        </div>
      </CardFooter>
    </Card>
  )
}
