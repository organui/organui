"use client"

import {
  CartesianGrid,
  Label,
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

export const description =
  "Home blood pressure readings, as a multiple line chart"

// Morning readings for a fictional patient starting treatment.
const chartData = [
  { day: "Mon", systolic: 152, diastolic: 94 },
  { day: "Tue", systolic: 148, diastolic: 92 },
  { day: "Wed", systolic: 145, diastolic: 90 },
  { day: "Thu", systolic: 141, diastolic: 88 },
  { day: "Fri", systolic: 138, diastolic: 86 },
  { day: "Sat", systolic: 134, diastolic: 84 },
  { day: "Sun", systolic: 131, diastolic: 82 },
]

const chartConfig = {
  systolic: {
    label: "Systolic (mmHg)",
    color: "var(--chart-2)",
  },
  diastolic: {
    label: "Diastolic (mmHg)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const latest = chartData.at(-1)!

export function ChartLineBloodPressure() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blood pressure</CardTitle>
        <CardDescription>Morning home readings, first week</CardDescription>
        <CardAction className="flex flex-col items-end gap-1.5">
          <div className="text-2xl leading-none font-semibold">
            {latest.systolic}/{latest.diastolic}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              mmHg
            </span>
          </div>
          <Badge variant="outline">
            <IconPlaceholder
              lucide="TriangleAlertIcon"
              tabler="IconAlertTriangle"
              hugeicons="Alert02Icon"
              phosphor="WarningIcon"
              remixicon="RiAlertLine"
              data-icon="inline-start"
            />
            Above target
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: -12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[60, 160]}
            />
            {/* A common home target of 130/80; set your own patient's. */}
            <ReferenceLine
              y={130}
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
            >
              <Label
                value="130"
                position="insideBottomLeft"
                className="fill-muted-foreground"
                fontSize={11}
              />
            </ReferenceLine>
            <ReferenceLine
              y={80}
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
            >
              <Label
                value="80"
                position="insideBottomLeft"
                className="fill-muted-foreground"
                fontSize={11}
              />
            </ReferenceLine>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="systolic"
              type="monotone"
              stroke="var(--color-systolic)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="diastolic"
              type="monotone"
              stroke="var(--color-diastolic)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Down 21/12 mmHg this week{" "}
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
          Morning home readings; a fictional patient
        </div>
      </CardFooter>
    </Card>
  )
}
