"use client"

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Scatter,
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
  "Length of stay for the top diagnoses against a benchmark, as a dumbbell chart"

// The most common diagnoses at discharge this quarter, with the median stay
// in days and the stay expected for the case mix. Illustrative, not a real
// hospital's.
const diagnoses = [
  { diagnosis: "Pneumonia", discharges: 186, stay: 6.1, expected: 5.2 },
  { diagnosis: "Heart failure", discharges: 152, stay: 8.4, expected: 9.0 },
  { diagnosis: "Sepsis", discharges: 137, stay: 7.9, expected: 6.5 },
  { diagnosis: "COPD", discharges: 113, stay: 4.2, expected: 4.6 },
  { diagnosis: "Hip fracture", discharges: 89, stay: 14.5, expected: 15.0 },
]

// Each row joins the expected stay to the actual one, so the gap reads as a
// line: long when the stay runs over.
const chartData = diagnoses.map((row) => ({
  ...row,
  gap: [Math.min(row.stay, row.expected), Math.max(row.stay, row.expected)],
  over: row.stay > row.expected,
}))

const chartConfig = {
  stay: {
    label: "Median stay",
    color: "var(--chart-2)",
  },
  expected: {
    label: "Expected",
    color: "var(--muted-foreground)",
  },
  gap: {
    label: "Gap",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig

const over = chartData.filter((row) => row.over)
// The diagnosis whose extra days, across all its patients, cost most beds.
const costliest = over.reduce(
  (a, b) =>
    (b.stay - b.expected) * b.discharges > (a.stay - a.expected) * a.discharges
      ? b
      : a,
  over[0] ?? chartData[0]!
)
const bedDays = Math.round(
  (costliest.stay - costliest.expected) * costliest.discharges
)

export function ChartBarDiagnoses() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Length of stay</CardTitle>
        <CardDescription>Top diagnoses this quarter, in days</CardDescription>
        <CardAction className="flex flex-col items-end gap-1.5">
          <div className="text-2xl leading-none font-semibold">
            {over.length}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              of {chartData.length} over
            </span>
          </div>
          <Badge variant="outline">
            {over.length ? (
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
            {over.length ? "Over benchmark" : "Within benchmark"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 8, right: 16 }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 16]}
              ticks={[0, 4, 8, 12, 16]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              type="category"
              dataKey="diagnosis"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={88}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                const row = payload?.[0]?.payload as
                  (typeof chartData)[number] | undefined
                if (!active || !row) return null
                return (
                  <div className="grid min-w-[10rem] gap-1 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl">
                    <div className="font-medium">{row.diagnosis}</div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-muted-foreground">Median stay</span>
                      <span className="font-mono font-medium tabular-nums">
                        {row.stay} days
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-muted-foreground">Expected</span>
                      <span className="font-mono tabular-nums">
                        {row.expected} days
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-muted-foreground">Discharges</span>
                      <span className="font-mono tabular-nums">
                        {row.discharges}
                      </span>
                    </div>
                  </div>
                )
              }}
            />
            <Bar
              dataKey="gap"
              fill="var(--color-gap)"
              fillOpacity={0.4}
              barSize={3}
              legendType="none"
              tooltipType="none"
            />
            <Scatter
              dataKey="expected"
              fill="var(--background)"
              stroke="var(--color-expected)"
              strokeWidth={2}
            />
            <Scatter dataKey="stay" fill="var(--color-stay)" />
          </ComposedChart>
        </ChartContainer>
        <div className="flex items-center justify-center gap-4 pt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div
              className="size-2.5 rounded-full"
              style={{ background: chartConfig.stay.color }}
            />
            {chartConfig.stay.label}
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="size-2.5 rounded-full border-2"
              style={{ borderColor: chartConfig.expected.color }}
            />
            {chartConfig.expected.label}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {over.length
            ? `${costliest.diagnosis} runs about ${bedDays} bed days over`
            : "Every diagnosis within its expected stay"}
        </div>
        <div className="leading-none text-muted-foreground">
          Expected stay is for the case mix; illustrative data
        </div>
      </CardFooter>
    </Card>
  )
}
