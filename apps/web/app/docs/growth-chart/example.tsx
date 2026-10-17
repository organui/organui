"use client"
import { useState } from "react"
import {
  GrowthChart,
  formatAge,
  formatPercentile,
  growthMeasures,
  growthZScore,
  zToPercentile,
  type GrowthMeasure,
  type GrowthMeasurement,
  type GrowthSex,
} from "@workspace/registry/growth-chart"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

// A fictional child's visits, written for this example.
const visits = [0, 1, 2, 4, 6, 9, 12, 15, 18, 24]
const sample: Record<GrowthMeasure, number[]> = {
  weight: [3.2, 4.1, 5.0, 6.3, 7.1, 8.0, 8.8, 9.5, 10.1, 11.3],
  length: [49.5, 53.5, 57.2, 62.0, 65.5, 70.0, 73.8, 77.0, 80.2, 85.5],
  head: [34.0, 36.6, 38.4, 40.5, 42.0, 43.4, 44.6, 45.4, 46.0, 47.0],
}
const initial = Object.fromEntries(
  Object.entries(sample).map(([measure, values]) => [
    measure,
    values.map((value, i) => ({ ageMonths: visits[i]!, value })),
  ])
) as Record<GrowthMeasure, GrowthMeasurement[]>

function Choice<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1">
      {options.map((option) => (
        <Button
          key={option.value}
          size="sm"
          variant={option.value === value ? "secondary" : "ghost"}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}

export function Example() {
  const [measure, setMeasure] = useState<GrowthMeasure>("weight")
  const [sex, setSex] = useState<GrowthSex>("female")
  const [range, setRange] = useState<"24" | "60">("24")
  const [measurements, setMeasurements] = useState(initial)
  const [age, setAge] = useState("")
  const [value, setValue] = useState("")
  const { unit } = growthMeasures[measure]
  const rows = measurements[measure]
  const add = (event: React.FormEvent) => {
    event.preventDefault()
    const entry = { ageMonths: Number(age), value: Number(value) }
    if (growthZScore(measure, sex, entry.ageMonths, entry.value) === null)
      return
    setMeasurements({
      ...measurements,
      [measure]: [...rows, entry].sort((a, b) => a.ageMonths - b.ageMonths),
    })
    setAge("")
    setValue("")
  }
  return (
    <div className="flex flex-col gap-5 rounded-xl border p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <Choice
          label="Measure"
          value={measure}
          onChange={setMeasure}
          options={[
            { value: "weight", label: "Weight" },
            { value: "length", label: "Length/height" },
            { value: "head", label: "Head" },
          ]}
        />
        <Choice
          label="Sex"
          value={sex}
          onChange={setSex}
          options={[
            { value: "female", label: "Girls" },
            { value: "male", label: "Boys" },
          ]}
        />
        <Choice
          label="Age range"
          value={range}
          onChange={setRange}
          options={[
            { value: "24", label: "0–2 years" },
            { value: "60", label: "0–5 years" },
          ]}
        />
      </div>
      <GrowthChart
        measure={measure}
        sex={sex}
        measurements={rows}
        ageRange={[0, Number(range)]}
      />
      <form
        onSubmit={add}
        className="flex flex-wrap items-end gap-2"
        aria-label="Add a measurement"
      >
        <label className="flex flex-col gap-1 text-sm">
          Age (months)
          <Input
            type="number"
            min={0}
            max={60}
            step="any"
            required
            value={age}
            onChange={(event) => setAge(event.target.value)}
            className="w-32"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Value ({unit})
          <Input
            type="number"
            min={0}
            step="any"
            required
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="w-32"
          />
        </label>
        <Button type="submit" variant="outline">
          Add measurement
        </Button>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full text-sm tabular-nums">
          <caption className="sr-only">Plotted measurements</caption>
          <thead className="text-left text-muted-foreground">
            <tr className="border-b">
              <th scope="col" className="py-2 font-medium">
                Age
              </th>
              <th scope="col" className="py-2 font-medium">
                {unit}
              </th>
              <th scope="col" className="py-2 font-medium">
                Percentile
              </th>
              <th scope="col" className="py-2 font-medium">
                Z-score
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const z = growthZScore(measure, sex, row.ageMonths, row.value)
              return (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-1.5">{formatAge(row.ageMonths)}</td>
                  <td className="py-1.5">{row.value}</td>
                  <td className="py-1.5">
                    {z === null ? "—" : formatPercentile(zToPercentile(z))}
                  </td>
                  <td className="py-1.5">{z === null ? "—" : z.toFixed(2)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Fictional example measurements. Not for clinical use without your own
        validation.
      </p>
    </div>
  )
}
