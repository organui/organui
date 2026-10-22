"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
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
  type ChartConfig,
} from "@/components/ui/chart"
import { IconPlaceholder } from "@/icons/icon-placeholder"

export const description =
  "Outpatient did-not-attend rate by month, against a target"

// Outpatient appointments attended and missed each month, illustrative.
const chartData = [
  { month: "January", attended: 486, missed: 64 },
  { month: "February", attended: 505, missed: 58 },
  { month: "March", attended: 537, missed: 71 },
  { month: "April", attended: 473, missed: 49 },
  { month: "May", attended: 509, missed: 52 },
  { month: "June", attended: 514, missed: 47 },
].map((month) => ({
  ...month,
  rate:
    Math.round((month.missed / (month.attended + month.missed)) * 1000) / 10,
}))

const chartConfig = {
  rate: {
    label: "Did not attend",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

// A local target for the share of appointments missed; set your own.
const target = 10
const latest = chartData.at(-1)!
const first = chartData[0]!
const atTarget = latest.rate <= target

export function ChartBarAppointments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Missed appointments</CardTitle>
        <CardDescription>Outpatient did-not-attend rate</CardDescription>
        <CardAction className="flex flex-col items-end gap-1.5">
          <div className="text-2xl leading-none font-semibold">
            {latest.rate}%{" "}
            <span className="text-sm font-normal text-muted-foreground">
              in {latest.month.slice(0, 3)}
            </span>
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
            {atTarget ? "Within target" : "Above target"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: -12, right: 12, top: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 14]}
              ticks={[0, 5, 10]}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                const row = payload?.[0]?.payload as
                  (typeof chartData)[number] | undefined
                if (!active || !row) return null
                return (
                  <div className="grid min-w-[10rem] gap-1 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl">
                    <div className="font-medium">{row.month}</div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-muted-foreground">
                        Did not attend
                      </span>
                      <span className="font-mono font-medium tabular-nums">
                        {row.rate}%
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-muted-foreground">Missed</span>
                      <span className="font-mono tabular-nums">
                        {row.missed} of {row.attended + row.missed}
                      </span>
                    </div>
                  </div>
                )
              }}
            />
            {/* Months over target at full strength, the rest muted. */}
            <Bar dataKey="rate" radius={4} maxBarSize={32}>
              {chartData.map((month) => (
                <Cell
                  key={month.month}
                  fill="var(--color-rate)"
                  fillOpacity={month.rate > target ? 1 : 0.35}
                />
              ))}
            </Bar>
            <ReferenceLine
              y={target}
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
            >
              <Label
                value={`Target ${target}%`}
                position="insideTopRight"
                className="fill-muted-foreground"
                fontSize={11}
              />
            </ReferenceLine>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {latest.rate <= first.rate ? "Down" : "Up"} from {first.rate}% in{" "}
          {first.month}
        </div>
        <div className="leading-none text-muted-foreground">
          Muted bars meet the target; illustrative data
        </div>
      </CardFooter>
    </Card>
  )
}
