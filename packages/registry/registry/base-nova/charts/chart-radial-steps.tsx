"use client"

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"

export const description =
  "Daily steps toward a goal, as a radial chart with text"

const goal = 8000
// Today's steps for a fictional patient after surgery.
const chartData = [{ day: "today", steps: 5640, fill: "var(--color-steps)" }]

const chartConfig = {
  steps: {
    label: "Steps",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartRadialSteps() {
  const steps = chartData[0]!.steps
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Steps</CardTitle>
        <CardDescription>
          Today, toward a goal of {goal.toLocaleString("en-US")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={90 - (steps / goal) * 360}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="steps" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                          className="fill-foreground text-4xl font-bold"
                        >
                          {steps.toLocaleString("en-US")}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          steps
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {Math.round((steps / goal) * 100)}% of the daily goal
        </div>
        <div className="leading-none text-muted-foreground">
          {steps < goal
            ? `${(goal - steps).toLocaleString("en-US")} steps to go`
            : "Goal reached"}
          ; a fictional patient
        </div>
      </CardFooter>
    </Card>
  )
}
