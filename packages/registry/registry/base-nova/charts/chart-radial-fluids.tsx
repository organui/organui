"use client"

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "Fluid intake and output, as a stacked radial chart"

// Millilitres over 24 hours, a fictional patient.
const chartData = [{ day: "today", intake: 2150, output: 1680 }]

const chartConfig = {
  intake: {
    label: "Intake (mL)",
    color: "var(--chart-2)",
  },
  output: {
    label: "Output (mL)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartRadialFluids() {
  const { intake, output } = chartData[0]!
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Fluid balance</CardTitle>
        <CardDescription>Intake and output, last 24 hours</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          +{(intake - output).toLocaleString("en-US")} mL
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          net balance
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="intake"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-intake)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="output"
              fill="var(--color-output)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Illustrative; check your own unit&apos;s charting rules.
      </CardFooter>
    </Card>
  )
}
