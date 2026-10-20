"use client"
import { useEffect, useState } from "react"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"
import {
  GrowthChart,
  type GrowthMeasure,
  type GrowthSex,
  type GrowthStandards,
} from "@workspace/registry/growth-chart"
import { loadWhoGrowthStandards } from "@/lib/who-growth-standards"

// A fictional child's visits, written for this example.
const ages = [0, 1, 2, 4, 6, 9, 12, 15, 18, 24]
const visits: Record<GrowthMeasure, number[]> = {
  weight: [3.2, 4.1, 5.0, 6.3, 7.1, 8.0, 8.8, 9.5, 10.1, 11.3],
  length: [49.5, 53.5, 57.2, 62.0, 65.5, 70.0, 73.8, 77.0, 80.2, 85.5],
  head: [34.0, 36.6, 38.4, 40.5, 42.0, 43.4, 44.6, 45.4, 46.0, 47.0],
}

function Choice<T extends string>(props: {
  label: string
  value: T
  onChange: (value: T) => void
  options: [T, string][]
}) {
  return (
    <ToggleGroup
      aria-label={props.label}
      variant="outline"
      size="sm"
      spacing={2}
      value={[props.value]}
      onValueChange={(values) => {
        if (values[0] !== undefined) props.onChange(values[0] as T)
      }}
    >
      {props.options.map(([value, label]) => (
        <ToggleGroupItem key={value} value={value}>
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export function Example() {
  const [standards, setStandards] = useState<GrowthStandards | null>(null)
  const [failed, setFailed] = useState(false)
  const [measure, setMeasure] = useState<GrowthMeasure>("weight")
  const [sex, setSex] = useState<GrowthSex>("female")
  const [range, setRange] = useState<"24" | "60">("24")
  // This site fetches WHO's tables from WHO's repository; the item has none.
  useEffect(() => {
    loadWhoGrowthStandards().then(setStandards, () => setFailed(true))
  }, [])
  return (
    <div className="flex flex-col gap-5 rounded-xl border p-5">
      <div className="flex flex-wrap gap-3">
        <Choice
          label="Measure"
          value={measure}
          onChange={setMeasure}
          options={[
            ["weight", "Weight"],
            ["length", "Length/height"],
            ["head", "Head"],
          ]}
        />
        <Choice
          label="Sex"
          value={sex}
          onChange={setSex}
          options={[
            ["female", "Girls"],
            ["male", "Boys"],
          ]}
        />
        <Choice
          label="Age range"
          value={range}
          onChange={setRange}
          options={[
            ["24", "0–2 years"],
            ["60", "0–5 years"],
          ]}
        />
      </div>
      {standards ? (
        <GrowthChart
          standards={standards}
          measure={measure}
          sex={sex}
          ageRange={[0, Number(range)]}
          measurements={visits[measure].map((value, i) => ({
            ageMonths: ages[i]!,
            value,
          }))}
        />
      ) : (
        <p
          role="status"
          className="py-24 text-center text-sm text-muted-foreground"
        >
          {failed
            ? "The WHO tables could not be loaded."
            : "Loading the WHO tables…"}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Fictional measurements on the WHO Child Growth Standards, © World Health
        Organization. Not for clinical use without your own validation.
      </p>
    </div>
  )
}
