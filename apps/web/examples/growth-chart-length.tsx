"use client"
import { GrowthChart } from "@workspace/registry/growth-chart"
import { useWhoGrowthStandards } from "@/hooks/use-who-growth-standards"

// Lying length to 24 months, then standing height, for a fictional boy.
const measurements = [
  { ageMonths: 0, value: 50.1 },
  { ageMonths: 6, value: 67.2 },
  { ageMonths: 12, value: 75.4 },
  { ageMonths: 24, value: 87 },
  { ageMonths: 36, value: 95.6 },
  { ageMonths: 48, value: 103.1 },
  { ageMonths: 60, value: 110.2 },
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
      measure="length"
      sex="male"
      ageRange={[0, 60]}
      measurements={measurements}
    />
  )
}
