"use client"
import { useState } from "react"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import {
  NativeSelect,
  NativeSelectOption,
} from "@workspace/ui/components/native-select"
import {
  analytes,
  analyteUnit,
  convertAnalyte,
  roundTo,
  type Analyte,
} from "@workspace/registry/clinical-units"

export function Example() {
  const [analyte, setAnalyte] = useState<Analyte>("glucose")
  const [value, setValue] = useState(100)
  const si = convertAnalyte(analyte, value, "conventional", "si")
  return (
    <div className="flex flex-col gap-6">
      <FieldGroup className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="units-analyte">Analyte</FieldLabel>
          <NativeSelect
            id="units-analyte"
            value={analyte}
            onChange={(event) => setAnalyte(event.target.value as Analyte)}
          >
            {Object.entries(analytes).map(([key, { name }]) => (
              <NativeSelectOption key={key} value={key}>
                {name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
        <Field>
          <FieldLabel htmlFor="units-value">
            Value ({analyteUnit(analyte, "conventional")})
          </FieldLabel>
          <Input
            id="units-value"
            type="number"
            min={0}
            step="any"
            value={value}
            onChange={(event) => setValue(event.target.valueAsNumber || 0)}
          />
        </Field>
      </FieldGroup>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        <span className="text-2xl font-semibold text-foreground tabular-nums">
          {roundTo(si, 2)}
        </span>{" "}
        {analyteUnit(analyte, "si")}
      </p>
    </div>
  )
}
