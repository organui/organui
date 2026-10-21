"use client"
import { GrowthChart } from "@workspace/registry/growth-chart"
import { useWhoGrowthStandards } from "@/hooks/use-who-growth-standards"

// A fictional child's weight, on WHO's tables fetched by this site.
const measurements = [
  { ageMonths: 0, value: 3.2 },
  { ageMonths: 2, value: 5.0 },
  { ageMonths: 4, value: 6.3 },
  { ageMonths: 6, value: 7.1 },
  { ageMonths: 9, value: 8.0 },
  { ageMonths: 12, value: 8.8 },
  { ageMonths: 18, value: 10.1 },
  { ageMonths: 24, value: 11.3 },
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
      measure="weight"
      sex="female"
      ageRange={[0, 24]}
      measurements={measurements}
    />
  )
}
