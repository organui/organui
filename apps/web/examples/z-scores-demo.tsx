"use client"
import { useState } from "react"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { Slider } from "@workspace/ui/components/slider"
import {
  formatPercentile,
  lmsValue,
  lmsZScore,
  zToPercentile,
  type Lms,
} from "@workspace/registry/z-scores"

// Illustrative LMS parameters, not a published reference.
const lms: Lms = [0.2, 9.4, 0.11]

export function Example() {
  const [weight, setWeight] = useState(10.6)
  const z = lmsZScore(weight, lms, { restricted: true })
  return (
    <div className="flex flex-col gap-6">
      <Field>
        <FieldLabel id="z-weight">Weight: {weight.toFixed(1)} kg</FieldLabel>
        <Slider
          aria-labelledby="z-weight"
          min={6}
          max={14}
          step={0.1}
          value={[weight]}
          onValueChange={(next) =>
            setWeight(Array.isArray(next) ? next[0]! : next)
          }
        />
      </Field>
      <dl className="grid grid-cols-3 gap-4 text-sm">
        <div className="flex flex-col gap-1">
          <dt className="text-muted-foreground">Z-score</dt>
          <dd className="text-lg font-semibold tabular-nums">
            {z === null ? "—" : z.toFixed(2)}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-muted-foreground">Percentile</dt>
          <dd className="text-lg font-semibold tabular-nums">
            {z === null ? "—" : formatPercentile(zToPercentile(z))}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-muted-foreground">Median</dt>
          <dd className="text-lg font-semibold tabular-nums">
            {lmsValue(lms, 0).toFixed(1)} kg
          </dd>
        </div>
      </dl>
      <p className="text-xs text-muted-foreground">
        Illustrative LMS parameters (L 0.2, M 9.4, S 0.11), not a published
        growth reference.
      </p>
    </div>
  )
}
