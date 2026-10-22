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

export const description =
  "Insulin doses by day, as a stacked bar chart: tooltip with a custom formatter and a total"

// Insulin given each day for a fictional patient, in units.
const chartData = [
  { date: "2026-07-13", basal: 18, bolus: 22 },
  { date: "2026-07-14", basal: 18, bolus: 26 },
  { date: "2026-07-15", basal: 20, bolus: 19 },
  { date: "2026-07-16", basal: 20, bolus: 31 },
  { date: "2026-07-17", basal: 22, bolus: 24 },
  { date: "2026-07-18", basal: 22, bolus: 27 },
]

const chartConfig = {
  basal: {
    label: "Basal",
    color: "var(--chart-2)",
  },
  bolus: {
    label: "Bolus",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartTooltipInsulinAdvanced() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced</CardTitle>
        <CardDescription>
          Tooltip with a custom formatter and a total
        </CardDescription>
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
              content={
                <ChartTooltipContent
                  hideLabel
                  className="w-[180px]"
                  formatter={(value, name, item, index) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
                        style={
                          {
                            "--color-bg": `var(--color-${name})`,
                          } as React.CSSProperties
                        }
                      />
                      {chartConfig[name as keyof typeof chartConfig]?.label ||
                        name}
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium text-foreground tabular-nums">
                        {value}
                        <span className="font-normal text-muted-foreground">
                          units
                        </span>
                      </div>
                      {/* After the last item, the day's total. */}
                      {index === 1 && (
                        <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                          Total
                          <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium text-foreground tabular-nums">
                            {item.payload.basal + item.payload.bolus}
                            <span className="font-normal text-muted-foreground">
                              units
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                />
              }
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
