"use client"
import { GrowthChart } from "@workspace/registry/growth-chart"
import { useWhoGrowthStandards } from "@/hooks/use-who-growth-standards"

// A fictional child's head circumference, on WHO's tables fetched by this site.
const measurements = [
  { ageMonths: 0, value: 34.0 },
  { ageMonths: 1, value: 36.6 },
  { ageMonths: 2, value: 38.4 },
  { ageMonths: 4, value: 40.5 },
  { ageMonths: 6, value: 42.0 },
  { ageMonths: 9, value: 43.4 },
  { ageMonths: 12, value: 44.6 },
  { ageMonths: 18, value: 46.0 },
  { ageMonths: 24, value: 47.0 },
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
      ageRange={[0, 24]}
      measurements={measurements}
    />
  )
}
