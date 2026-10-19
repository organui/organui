"use client"
import { useState } from "react"
import {
  MedicationSchedule,
  type DoseStatus,
} from "@workspace/registry/medication-schedule"
import {
  exampleDate,
  exampleInteractions,
  exampleMedications,
} from "@/lib/medication-example"

export function Example() {
  const [date, setDate] = useState(exampleDate)
  const [doseStatus, setDoseStatus] = useState<Record<string, DoseStatus>>({})
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <MedicationSchedule
        medications={exampleMedications}
        interactions={exampleInteractions}
        date={date}
        onDateChange={setDate}
        doseStatus={doseStatus}
        onDoseStatusChange={setDoseStatus}
        now="10:15"
      />
      <div className="rounded-xl border bg-muted/30 p-5">
        <h2 className="mb-3 font-medium">Your app state</h2>
        <p className="text-sm text-muted-foreground">
          Step through the days or mark doses taken or skipped. These callbacks
          can save to your own records.
        </p>
        <p className="mt-5 text-sm" role="status">
          Date: {date}
        </p>
        <pre
          tabIndex={0}
          role="region"
          className="mt-4 overflow-auto rounded-md bg-background p-3 text-xs focus-visible:outline-2 focus-visible:outline-ring"
          aria-label="Dose status"
        >
          {JSON.stringify(doseStatus, null, 2)}
        </pre>
        <p className="mt-4 text-xs text-muted-foreground">
          Illustrative example data, not a treatment plan or a complete list of
          interactions.
        </p>
      </div>
    </div>
  )
}
