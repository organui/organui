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
  "Emergency department visits seen within four hours, by weekday"

// Average visits per weekday, and how many were admitted, transferred or
// discharged within four hours of arrival. Illustrative.
const chartData = [
  { day: "Monday", visits: 214, withinFour: 140 },
  { day: "Tuesday", visits: 186, withinFour: 145 },
  { day: "Wednesday", visits: 179, withinFour: 143 },
  { day: "Thursday", visits: 182, withinFour: 144 },
  { day: "Friday", visits: 191, withinFour: 140 },
  { day: "Saturday", visits: 168, withinFour: 138 },
  { day: "Sunday", visits: 175, withinFour: 142 },
].map((day) => ({
  ...day,
  share: Math.round((day.withinFour / day.visits) * 100),
}))

const chartConfig = {
  share: {
    label: "Within 4 hours",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

// An operational target for the share seen within four hours; set yours.
const target = 78
const visits = chartData.reduce((sum, { visits }) => sum + visits, 0)
const withinFour = chartData.reduce(
  (sum, { withinFour }) => sum + withinFour,
  0
)
const overall = Math.round((withinFour / visits) * 100)
const atTarget = overall >= target
const worst = chartData.reduce((a, b) => (b.share < a.share ? b : a))

export function ChartBarEdVisits() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ED four-hour performance</CardTitle>
        <CardDescription>Share of visits seen within 4 hours</CardDescription>
        <CardAction className="flex flex-col items-end gap-1.5">
          <div className="text-2xl leading-none font-semibold">
            {overall}%{" "}
            <span className="text-sm font-normal text-muted-foreground">
              this week
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
            {atTarget ? "Meets target" : "Below target"}
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
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[50, 100]}
              ticks={[50, 75, 100]}
              tickFormatter={(value) => `${value}%`}
              allowDataOverflow
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                const row = payload?.[0]?.payload as
                  (typeof chartData)[number] | undefined
                if (!active || !row) return null
                return (
                  <div className="grid min-w-[10rem] gap-1 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl">
                    <div className="font-medium">{row.day}</div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-muted-foreground">
                        Within 4 hours
                      </span>
                      <span className="font-mono font-medium tabular-nums">
                        {row.share}%
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-muted-foreground">Visits</span>
                      <span className="font-mono tabular-nums">
                        {row.visits}
                      </span>
                    </div>
                  </div>
                )
              }}
            />
            {/* Days below target at full strength, the rest muted. */}
            <Bar dataKey="share" radius={4} maxBarSize={32}>
              {chartData.map((day) => (
                <Cell
                  key={day.day}
                  fill="var(--color-share)"
                  fillOpacity={day.share < target ? 1 : 0.35}
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
          {worst.day}s are hardest, at {worst.share}% of {worst.visits} visits
        </div>
        <div className="leading-none text-muted-foreground">
          Muted bars meet the target; illustrative data
        </div>
      </CardFooter>
    </Card>
  )
}
