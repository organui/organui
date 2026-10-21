"use client"
import { useState } from "react"
import { Field, FieldLabel } from "@workspace/ui/components/field"
import { Slider } from "@workspace/ui/components/slider"
import {
  flagValue,
  formatReferenceRange,
  rangeFlagLabels,
  type RangeFlag,
} from "@workspace/registry/reference-ranges"

// A common adult range for serum potassium, for illustration only.
const potassium = { low: 3.5, high: 5.1, criticalLow: 2.5, criticalHigh: 6 }

const tone: Record<RangeFlag, string> = {
  "critical-low": "text-severity-critical",
  low: "text-severity-warning",
  normal: "text-severity-normal",
  high: "text-severity-warning",
  "critical-high": "text-severity-critical",
  abnormal: "text-severity-warning",
  unflagged: "text-muted-foreground",
}

export function Example() {
  const [value, setValue] = useState(5.6)
  const flag = flagValue(value, potassium)
  return (
    <div className="flex flex-col gap-6">
      <Field>
        <FieldLabel id="potassium">
          Potassium: {value.toFixed(1)} mmol/L
        </FieldLabel>
        <Slider
          aria-labelledby="potassium"
          min={2}
          max={7}
          step={0.1}
          value={[value]}
          onValueChange={(next) =>
            setValue(Array.isArray(next) ? next[0]! : next)
          }
        />
      </Field>
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex flex-col gap-1">
          <dt className="text-muted-foreground">Flag</dt>
          <dd className={`text-lg font-semibold ${tone[flag]}`}>
            {rangeFlagLabels[flag]}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-muted-foreground">Reference range</dt>
          <dd className="text-lg font-semibold tabular-nums">
            {formatReferenceRange(potassium, 1)} mmol/L
          </dd>
        </div>
      </dl>
      <p className="text-xs text-muted-foreground">
        A common adult range for illustration. Use the range your laboratory
        reports.
      </p>
    </div>
  )
}
