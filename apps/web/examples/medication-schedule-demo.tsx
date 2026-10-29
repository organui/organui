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
    <div className="flex w-full flex-col gap-3">
      <MedicationSchedule
        medications={exampleMedications}
        interactions={exampleInteractions}
        date={date}
        onDateChange={setDate}
        doseStatus={doseStatus}
        onDoseStatusChange={setDoseStatus}
        now="10:15"
      />
      <p className="text-xs text-muted-foreground">
        Illustrative example data, not a treatment plan or a complete list of
        interactions.
      </p>
    </div>
  )
}
