"use client"
import { useState } from "react"
import { Field, FieldGroup, FieldLabel } from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import {
  ageInMonths,
  ageInYears,
  correctedAgeInMonths,
  formatAge,
} from "@workspace/registry/age"

// UTC midnight, so the result doesn't move with the reader's time zone.
const parse = (value: string) => new Date(`${value}T00:00:00Z`)

export function Example() {
  const [birth, setBirth] = useState("2025-02-10")
  const [measured, setMeasured] = useState("2026-01-20")
  const [weeks, setWeeks] = useState(32)
  const valid = birth && measured && parse(measured) >= parse(birth)
  return (
    <div className="flex flex-col gap-6">
      <FieldGroup className="grid gap-4 sm:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="age-birth">Date of birth</FieldLabel>
          <Input
            id="age-birth"
            type="date"
            value={birth}
            onChange={(event) => setBirth(event.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="age-measured">Measured on</FieldLabel>
          <Input
            id="age-measured"
            type="date"
            value={measured}
            onChange={(event) => setMeasured(event.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="age-weeks">Born at (weeks)</FieldLabel>
          <Input
            id="age-weeks"
            type="number"
            min={22}
            max={42}
            value={weeks}
            onChange={(event) => setWeeks(event.target.valueAsNumber || 40)}
          />
        </Field>
      </FieldGroup>
      <dl className="grid grid-cols-3 gap-4 text-sm">
        {[
          [
            "Chronological",
            valid ? formatAge(ageInMonths(parse(birth), parse(measured))) : "—",
          ],
          [
            "Corrected",
            valid
              ? formatAge(
                  correctedAgeInMonths(parse(birth), parse(measured), weeks)
                )
              : "—",
          ],
          [
            "Completed years",
            valid ? String(ageInYears(parse(birth), parse(measured))) : "—",
          ],
        ].map(([label, value]) => (
          <div key={label} className="flex flex-col gap-1">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-lg font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
