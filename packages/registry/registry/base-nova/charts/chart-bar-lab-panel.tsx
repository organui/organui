"use client"

import { Bar, ComposedChart, LabelList, Scatter, XAxis, YAxis } from "recharts"

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
  "A lab panel, each result placed on its own reference range"

// One draw for a fictional patient, with typical adult reference ranges.
// Check your own laboratory's ranges, which vary by method and population.
const results = [
  { analyte: "Sodium", value: 138, low: 135, high: 145, unit: "mmol/L" },
  { analyte: "Potassium", value: 5.4, low: 3.5, high: 5.0, unit: "mmol/L" },
  { analyte: "Creatinine", value: 1.1, low: 0.6, high: 1.2, unit: "mg/dL" },
  { analyte: "Glucose", value: 92, low: 70, high: 99, unit: "mg/dL" },
  { analyte: "Hemoglobin", value: 11.2, low: 12.0, high: 15.5, unit: "g/dL" },
]

// Each row has its own units, so each is scaled to its range: the range fills
// the middle half of the row, and the result sits where it falls.
const chartData = results.map((result) => {
  const width = result.high - result.low
  const start = result.low - width / 2
  const position = ((result.value - start) / (width * 2)) * 100
  return {
    ...result,
    range: [25, 75],
    position: Math.min(Math.max(position, 2), 98),
    flag:
      result.value > result.high ? "H" : result.value < result.low ? "L" : "",
  }
})

const chartConfig = {
  range: {
    label: "Reference range",
    color: "var(--muted-foreground)",
  },
  position: {
    label: "Result",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const flagged = chartData.filter(({ flag }) => flag)

export function ChartBarLabPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic panel</CardTitle>
        <CardDescription>Results against reference ranges</CardDescription>
        <CardAction className="flex flex-col items-end gap-1.5">
          <div className="text-2xl leading-none font-semibold">
            {flagged.length}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              of {chartData.length} flagged
            </span>
          </div>
          <Badge variant="outline">
            {flagged.length ? (
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
            {flagged.length ? "Review" : "All in range"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 8, right: 24 }}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              type="category"
              dataKey="analyte"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={84}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                const row = payload?.[0]?.payload as
                  (typeof chartData)[number] | undefined
                if (!active || !row) return null
                return (
                  <div className="grid min-w-[10rem] gap-1 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl">
                    <div className="font-medium">{row.analyte}</div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-muted-foreground">Result</span>
                      <span className="font-mono font-medium tabular-nums">
                        {row.value} {row.unit} {row.flag}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-muted-foreground">Range</span>
                      <span className="font-mono tabular-nums">
                        {row.low}–{row.high}
                      </span>
                    </div>
                  </div>
                )
              }}
            />
            <Bar
              dataKey="range"
              fill="var(--color-range)"
              fillOpacity={0.15}
              radius={4}
              barSize={12}
            />
            <Scatter dataKey="position" fill="var(--color-position)">
              {/* A high or low flag beside the result, as on a lab report. */}
              <LabelList
                dataKey="flag"
                position="right"
                offset={10}
                className="fill-foreground font-semibold"
                fontSize={12}
              />
            </Scatter>
          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {flagged.length
            ? flagged
                .map(
                  ({ analyte, flag }) =>
                    `${analyte} ${flag === "H" ? "high" : "low"}`
                )
                .join(", ")
            : "Every result in range"}
        </div>
        <div className="leading-none text-muted-foreground">
          The shaded bar is each range; a fictional patient
        </div>
      </CardFooter>
    </Card>
  )
}
