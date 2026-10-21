"use client"
import { GrowthChart } from "@workspace/registry/growth-chart"
import { useWhoGrowthStandards } from "@/hooks/use-who-growth-standards"

// Head circumference with only the 3rd, 50th and 97th curves.
const measurements = [
  { ageMonths: 0, value: 34 },
  { ageMonths: 2, value: 38.4 },
  { ageMonths: 6, value: 42 },
  { ageMonths: 12, value: 44.6 },
  { ageMonths: 24, value: 47 },
]

export function Example() {
  const { standards, failed } = useWhoGrowthStandards()
  if (!standards)
    return (
      <p
        role="status"
        className="py-16 text-center text-sm text-muted-foreground"
      >
        {failed
          ? "The WHO tables could not be loaded."
          : "Loading the WHO tables…"}
      </p>
    )
  return (
    <GrowthChart
      standards={standards}
      measure="head"
      sex="female"
      percentiles={[3, 50, 97]}
      measurements={measurements}
    />
  )
}
