"use client"
import { useState } from "react"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import {
  bmiCategory,
  bmiCategoryLabels,
  bodyMassIndex,
  bodySurfaceArea,
} from "@workspace/registry/body-measurements"

export function Example() {
  const [weight, setWeight] = useState(70)
  const [height, setHeight] = useState(175)
  const valid = weight > 0 && height > 0
  const bmi = valid ? bodyMassIndex(weight, height) : null
  return (
    <div className="flex flex-col gap-6">
      <FieldGroup className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="body-weight">Weight (kg)</FieldLabel>
          <Input
            id="body-weight"
            type="number"
            min={1}
            step="any"
            value={weight}
            onChange={(event) => setWeight(event.target.valueAsNumber || 0)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="body-height">Height (cm)</FieldLabel>
          <Input
            id="body-height"
            type="number"
            min={1}
            step="any"
            value={height}
            onChange={(event) => setHeight(event.target.valueAsNumber || 0)}
          />
        </Field>
      </FieldGroup>
      <dl className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <div className="flex flex-col gap-1">
          <dt className="text-muted-foreground">BMI</dt>
          <dd className="text-lg font-semibold tabular-nums">
            {bmi === null ? "—" : bmi.toFixed(1)}
          </dd>
          <dd className="text-xs text-muted-foreground">
            {bmi === null ? "" : bmiCategoryLabels[bmiCategory(bmi)]}
          </dd>
        </div>
        {(["mosteller", "du-bois", "haycock"] as const).map((formula) => (
          <div key={formula} className="flex flex-col gap-1">
            <dt className="text-muted-foreground capitalize">
              BSA, {formula.replace("-", " ")}
            </dt>
            <dd className="text-lg font-semibold tabular-nums">
              {valid
                ? bodySurfaceArea(weight, height, formula).toFixed(2)
                : "—"}{" "}
              m²
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
