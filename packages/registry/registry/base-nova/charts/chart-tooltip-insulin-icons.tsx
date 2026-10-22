"use client"

import * as React from "react"
import { Bar, BarChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
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

export const description =
  "Insulin doses by day, as a stacked bar chart: tooltip with icons from chartConfig"

// Insulin given each day for a fictional patient, in units.
const chartData = [
  { date: "2026-07-13", basal: 18, bolus: 22 },
  { date: "2026-07-14", basal: 18, bolus: 26 },
  { date: "2026-07-15", basal: 20, bolus: 19 },
  { date: "2026-07-16", basal: 20, bolus: 31 },
  { date: "2026-07-17", basal: 22, bolus: 24 },
  { date: "2026-07-18", basal: 22, bolus: 27 },
]

// Basal insulin runs around the clock; bolus insulin covers meals.
function BasalIcon(props: React.ComponentProps<"svg">) {
  return (
    <IconPlaceholder
      lucide="ClockIcon"
      tabler="IconClock"
      hugeicons="Clock01Icon"
      phosphor="ClockIcon"
      remixicon="RiTimeLine"
      {...props}
    />
  )
}

function BolusIcon(props: React.ComponentProps<"svg">) {
  return (
    <IconPlaceholder
      lucide="UtensilsIcon"
      tabler="IconToolsKitchen2"
      hugeicons="SpoonAndForkIcon"
      phosphor="ForkKnifeIcon"
      remixicon="RiRestaurantLine"
      {...props}
    />
  )
}

const chartConfig = {
  basal: {
    label: "Basal",
    color: "var(--chart-2)",
    icon: BasalIcon,
  },
  bolus: {
    label: "Bolus",
    color: "var(--chart-1)",
    icon: BolusIcon,
  },
} satisfies ChartConfig

export function ChartTooltipInsulinIcons() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Icons</CardTitle>
        <CardDescription>Tooltip with icons from chartConfig</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                  timeZone: "UTC",
                })
              }
            />
            <Bar
              dataKey="basal"
              stackId="a"
              fill="var(--color-basal)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="bolus"
              stackId="a"
              fill="var(--color-bolus)"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
