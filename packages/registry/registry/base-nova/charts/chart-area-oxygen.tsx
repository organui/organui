"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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

const latest = chartData.at(-1)!
const onRoomAir = latest.flow === 0

const first = chartData[0]!
const offAt = chartData.find(({ flow }) => flow === 0)?.time

export function ChartAreaOxygen() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Oxygen weaning</CardTitle>
        <CardDescription>Nasal cannula flow, litres per minute</CardDescription>
        <CardAction className="flex flex-col items-end gap-1.5">
          <div className="text-2xl leading-none font-semibold">
            {latest.flow}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              L/min
            </span>
          </div>
          <Badge variant="outline">
            {onRoomAir ? (
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
            {onRoomAir ? "Room air" : "On oxygen"}
          </Badge>
        </CardAction>
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
          {offAt ? `Off oxygen by ${offAt}` : `On ${latest.flow} L/min`}{" "}
          {latest.flow < first.flow ? (
            <IconPlaceholder
              lucide="TrendingDownIcon"
              tabler="IconTrendingDown"
              hugeicons="ChartDownIcon"
              phosphor="TrendDownIcon"
              remixicon="RiArrowDownLine"
              className="size-4"
            />
          ) : (
            <IconPlaceholder
              lucide="TrendingUpIcon"
              tabler="IconTrendingUp"
              hugeicons="ChartUpIcon"
              phosphor="TrendUpIcon"
              remixicon="RiArrowUpLine"
              className="size-4"
            />
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Started at {first.flow} L/min; a fictional patient
        </div>
      </CardFooter>
    </Card>
  )
}
