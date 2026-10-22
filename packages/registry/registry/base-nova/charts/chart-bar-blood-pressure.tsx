"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  ReferenceArea,
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
  "24-hour blood pressure, as range bars from diastolic to systolic"

// Readings every two hours from an ambulatory monitor, for a fictional
// patient. Each bar spans diastolic to systolic, as on a paper vitals chart.
const chartData = [
  { time: "08:00", systolic: 136, diastolic: 86, asleep: false },
  { time: "10:00", systolic: 140, diastolic: 88, asleep: false },
  { time: "12:00", systolic: 142, diastolic: 90, asleep: false },
  { time: "14:00", systolic: 138, diastolic: 86, asleep: false },
  { time: "16:00", systolic: 141, diastolic: 89, asleep: false },
  { time: "18:00", systolic: 137, diastolic: 85, asleep: false },
  { time: "20:00", systolic: 132, diastolic: 82, asleep: false },
  { time: "22:00", systolic: 124, diastolic: 76, asleep: false },
  { time: "00:00", systolic: 116, diastolic: 70, asleep: true },
  { time: "02:00", systolic: 112, diastolic: 68, asleep: true },
  { time: "04:00", systolic: 114, diastolic: 69, asleep: true },
  { time: "06:00", systolic: 128, diastolic: 78, asleep: false },
].map((reading) => ({
  ...reading,
  pressure: [reading.diastolic, reading.systolic],
}))

const chartConfig = {
  pressure: {
    label: "Blood pressure",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

function meanSystolic(readings: typeof chartData) {
  return (
    readings.reduce((sum, { systolic }) => sum + systolic, 0) / readings.length
  )
}

// How far systolic pressure falls asleep. A fall of 10% or more is the usual
// pattern; less, a "non-dipper", is a cardiovascular risk marker.
const awake = meanSystolic(chartData.filter(({ asleep }) => !asleep))
const asleep = meanSystolic(chartData.filter(({ asleep }) => asleep))
const dip = Math.round(((awake - asleep) / awake) * 100)
const dipper = dip >= 10
const night = chartData.filter(({ asleep }) => asleep)

export function ChartBarBloodPressure() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ambulatory blood pressure</CardTitle>
        <CardDescription>Every two hours, over 24 hours</CardDescription>
        <CardAction className="flex flex-col items-end gap-1.5">
          <div className="text-2xl leading-none font-semibold">
            {dip}%{" "}
            <span className="text-sm font-normal text-muted-foreground">
              dip
            </span>
          </div>
          <Badge variant="outline">
            {dipper ? (
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
            {dipper ? "Dipper" : "Non-dipper"}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: -12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={2}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[60, 150]}
            />
            {/* The hours asleep, when pressure should fall. */}
            <ReferenceArea
              x1={night[0]!.time}
              x2={night.at(-1)!.time}
              fill="var(--muted-foreground)"
              fillOpacity={0.08}
            >
              <Label
                value="Asleep"
                position="insideTop"
                className="fill-muted-foreground"
                fontSize={11}
              />
            </ReferenceArea>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) =>
                    Array.isArray(value)
                      ? `${value[1]}/${value[0]} mmHg`
                      : String(value)
                  }
                />
              }
            />
            <Bar
              dataKey="pressure"
              fill="var(--color-pressure)"
              radius={4}
              maxBarSize={14}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Systolic averages {Math.round(awake)} awake, {Math.round(asleep)}{" "}
          asleep
        </div>
        <div className="leading-none text-muted-foreground">
          Each bar runs diastolic to systolic; a fictional patient
        </div>
      </CardFooter>
    </Card>
  )
}
