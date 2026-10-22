"use client"

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { IconPlaceholder } from "@/icons/icon-placeholder"

export const description =
  "Monthly admissions against the range of the past three years"

// Admissions this year so far, against the lowest and highest of the same
// month over the past three years, as surveillance reports draw them.
// Illustrative figures for one hospital.
const chartData = [
  { month: "Jan", thisYear: 1186, low: 1090, high: 1240 },
  { month: "Feb", thisYear: 1305, low: 1060, high: 1210 },
  { month: "Mar", thisYear: 1237, low: 1040, high: 1190 },
  { month: "Apr", thisYear: 1073, low: 980, high: 1120 },
  { month: "May", thisYear: 1009, low: 960, high: 1100 },
  { month: "Jun", thisYear: 1114, low: 950, high: 1080 },
  { month: "Jul", thisYear: null, low: 940, high: 1070 },
  { month: "Aug", thisYear: null, low: 930, high: 1060 },
  { month: "Sep", thisYear: null, low: 970, high: 1110 },
  { month: "Oct", thisYear: null, low: 1010, high: 1150 },
  { month: "Nov", thisYear: null, low: 1050, high: 1190 },
  { month: "Dec", thisYear: null, low: 1100, high: 1260 },
].map((month) => ({ ...month, usual: [month.low, month.high] }))

const chartConfig = {
  thisYear: {
    label: "This year",
    color: "var(--chart-2)",
  },
  usual: {
    label: "Past 3 years",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig

const reported = chartData.filter(
  (month): month is (typeof chartData)[number] & { thisYear: number } =>
    month.thisYear !== null
)
const latest = reported.at(-1)!
const aboveRange = latest.thisYear > latest.high
const monthsAbove = reported.filter(({ thisYear, high }) => thisYear > high)

export function ChartAreaAdmissions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admissions</CardTitle>
        <CardDescription>Monthly, against the past 3 years</CardDescription>
        <CardAction className="flex flex-col items-end gap-1.5">
          <div className="text-2xl leading-none font-semibold">
            {latest.thisYear.toLocaleString("en-US")}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              in {latest.month}
            </span>
          </div>
          <Badge variant="outline">
            {aboveRange ? (
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
            {aboveRange ? "Above usual" : "Within usual"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart
            accessibilityLayer
            data={chartData}
            margin={{ left: -12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={1}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[800, 1400]}
              ticks={[900, 1100, 1300]}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value, name) => (
                    <div className="flex min-w-[140px] items-center text-xs text-muted-foreground">
                      {chartConfig[name as keyof typeof chartConfig]?.label}
                      <span className="ml-auto font-mono font-medium text-foreground tabular-nums">
                        {Array.isArray(value)
                          ? value
                              .map((n) => n.toLocaleString("en-US"))
                              .join("–")
                          : Number(value).toLocaleString("en-US")}
                      </span>
                    </div>
                  )}
                />
              }
            />
            {/* The usual range, from the past three years' lowest to highest. */}
            <Area
              dataKey="usual"
              type="monotone"
              fill="var(--color-usual)"
              fillOpacity={0.15}
              stroke="none"
              activeDot={false}
            />
            <Line
              dataKey="thisYear"
              type="monotone"
              stroke="var(--color-thisYear)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-thisYear)" }}
              connectNulls={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {monthsAbove.length
            ? `Above the usual range in ${monthsAbove.length} of ${reported.length} months`
            : "Within the usual range all year"}
        </div>
        <div className="leading-none text-muted-foreground">
          Shaded: the past three years&apos; lowest to highest; illustrative
        </div>
      </CardFooter>
    </Card>
  )
}
