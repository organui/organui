"use client"
import { useState } from "react"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  TriangleAlertIcon,
} from "lucide-react"
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

// Red only for critical; high and low are bold with an arrow, as lab results
// show them, so the flag reads without colour.
const icons: Record<RangeFlag, typeof CheckIcon | null> = {
  "critical-low": TriangleAlertIcon,
  low: ArrowDownIcon,
  normal: CheckIcon,
  high: ArrowUpIcon,
  "critical-high": TriangleAlertIcon,
  abnormal: TriangleAlertIcon,
  unflagged: null,
}

const tone: Record<RangeFlag, string> = {
  "critical-low": "text-severity-critical",
  low: "",
  normal: "font-normal text-muted-foreground",
  high: "",
  "critical-high": "text-severity-critical",
  abnormal: "",
  unflagged: "font-normal text-muted-foreground",
}

export function Example() {
  const [value, setValue] = useState(5.6)
  const flag = flagValue(value, potassium)
  const Icon = icons[flag]
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
          <dd
            className={`flex items-center gap-1.5 text-lg font-semibold ${tone[flag]}`}
          >
            {Icon && <Icon aria-hidden="true" className="size-4 shrink-0" />}
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
