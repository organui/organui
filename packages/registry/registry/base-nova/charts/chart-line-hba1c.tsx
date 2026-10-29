"use client"

import {
  CartesianGrid,
  Label,
  LabelList,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

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

export const description = "HbA1c by quarter, as a line chart with labels"

// Quarterly results in percent, a fictional patient.
const chartData = [
  { quarter: "Q1 2025", hba1c: 8.4 },
  { quarter: "Q2 2025", hba1c: 7.9 },
  { quarter: "Q3 2025", hba1c: 7.5 },
  { quarter: "Q4 2025", hba1c: 7.2 },
  { quarter: "Q1 2026", hba1c: 6.9 },
  { quarter: "Q2 2026", hba1c: 6.8 },
]

const chartConfig = {
  hba1c: {
    label: "HbA1c (%)",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const latest = chartData.at(-1)!
// A common target for adults, in percent; set your own patient's.
const target = 7
const atTarget = latest.hba1c < target

const first = chartData[0]!
// The first quarter from which every reading stays below target.
const belowFrom = chartData.find((_, index) =>
  chartData.slice(index).every(({ hba1c }) => hba1c < target)
)

export function ChartLineHba1c() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>HbA1c</CardTitle>
        <CardDescription>Quarterly, over 18 months</CardDescription>
        <CardAction className="flex flex-col items-end gap-1.5">
          <div className="text-2xl leading-none font-semibold">
            {latest.hba1c}{" "}
            <span className="text-sm font-normal text-muted-foreground">%</span>
          </div>
          <Badge variant="outline">
            {atTarget ? (
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
            {atTarget ? "At target" : "Above target"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            // Room for half of the first and last quarter labels.
            margin={{ top: 20, left: 20, right: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="quarter"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // "Q1 2025" as "Q1 '25", so the year stays on the axis.
              tickFormatter={(value) => value.replace(" 20", " '")}
              interval={0}
            />
            <YAxis hide domain={[6, 9]} />
            <ReferenceLine
              y={target}
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
            >
              <Label
                value={`Target ${target}%`}
                position="insideBottomLeft"
                className="fill-muted-foreground"
                fontSize={11}
              />
            </ReferenceLine>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="hba1c"
              type="monotone"
              stroke="var(--color-hba1c)"
              strokeWidth={2}
              dot={{ fill: "var(--color-hba1c)" }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {latest.hba1c <= first.hba1c ? "Down" : "Up"}{" "}
          {Math.abs(first.hba1c - latest.hba1c).toFixed(1)} points since{" "}
          {first.quarter}{" "}
          {latest.hba1c <= first.hba1c ? (
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
          {belowFrom
            ? `Below ${target}% since ${belowFrom.quarter}`
            : `Not yet below ${target}%`}
          ; a fictional patient
        </div>
      </CardFooter>
    </Card>
  )
}
