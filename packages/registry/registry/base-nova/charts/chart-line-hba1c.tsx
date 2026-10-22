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
            <IconPlaceholder
              lucide="CheckIcon"
              tabler="IconCheck"
              hugeicons="Tick02Icon"
              phosphor="CheckIcon"
              remixicon="RiCheckLine"
              data-icon="inline-start"
            />
            At target
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="quarter"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 2)}
            />
            <YAxis hide domain={[6, 9]} />
            {/* A common target for adults; set your own patient's. */}
            <ReferenceLine
              y={7}
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
            >
              <Label
                value="Target 7%"
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
              type="natural"
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
          Down 1.6 points since Q1 2025{" "}
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
          Below 7% since Q1 2026; a fictional patient
        </div>
      </CardFooter>
    </Card>
  )
}
