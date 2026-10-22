"use client"

import { Cell, Label, Pie, PieChart } from "recharts"

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
  "A month of twice-daily doses as a ring, each dose on time, late or missed"

// Doses that were taken late or missed, by their place in the month's 60
// twice-daily doses, for a fictional patient. Every other dose was on time.
const late = [7, 18, 25, 40, 51]
const missed = [12, 33, 47]

// One equal segment per dose, in the order they were due, so when doses
// slipped reads around the ring like a clock.
const chartData = Array.from({ length: 60 }, (_, index) => {
  const status = missed.includes(index)
    ? "missed"
    : late.includes(index)
      ? "late"
      : "onTime"
  return {
    dose: index,
    day: Math.floor(index / 2) + 1,
    time: index % 2 ? "evening" : "morning",
    status,
    value: 1,
    fill: `var(--color-${status})`,
  }
})

const chartConfig = {
  onTime: {
    label: "On time",
    color: "var(--chart-2)",
  },
  late: {
    label: "Late",
    color: "var(--chart-4)",
  },
  missed: {
    label: "Missed",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const onTime = chartData.filter(({ status }) => status === "onTime").length
const share = Math.round((onTime / chartData.length) * 100)
// Missing no more than one dose in twenty is a common bar for good adherence.
const good = missed.length / chartData.length <= 0.05
const missedDays = chartData
  .filter(({ status }) => status === "missed")
  .map(({ day, time }) => `day ${day} ${time}`)

export function ChartPieAdherence() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Doses</CardTitle>
        <CardDescription>Twice daily, the last 30 days</CardDescription>
        <CardAction>
          <Badge variant="outline">
            {good ? (
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
            {missed.length} missed
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
              content={({ active, payload }) => {
                const dose = payload?.[0]?.payload as
                  (typeof chartData)[number] | undefined
                if (!active || !dose) return null
                return (
                  <div className="grid min-w-[8rem] gap-1 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl">
                    <div className="font-medium">
                      Day {dose.day}, {dose.time}
                    </div>
                    <div className="text-muted-foreground">
                      {
                        chartConfig[dose.status as keyof typeof chartConfig]
                          .label
                      }
                    </div>
                  </div>
                )
              }}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="status"
              innerRadius={70}
              outerRadius={96}
              startAngle={90}
              endAngle={-270}
              paddingAngle={1}
              stroke="none"
              legendType="none"
            >
              {/* On-time doses muted, so late and missed ones stand out. */}
              {chartData.map((dose) => (
                <Cell
                  key={dose.dose}
                  fill={dose.fill}
                  fillOpacity={dose.status === "onTime" ? 0.35 : 1}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {share}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          on time
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex items-center justify-center gap-4 pt-3 text-xs">
          {(["onTime", "late", "missed"] as const).map((status) => (
            <div key={status} className="flex items-center gap-1.5">
              <div
                className="size-2 shrink-0 rounded-[2px]"
                style={{
                  background: chartConfig[status].color,
                  opacity: status === "onTime" ? 0.35 : 1,
                }}
              />
              {chartConfig[status].label}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {missed.length
            ? `Missed on ${missedDays.join(", ")}`
            : "No doses missed"}
        </div>
        <div className="leading-none text-muted-foreground">
          Each segment is one dose, from the top; a fictional patient
        </div>
      </CardFooter>
    </Card>
  )
}
