"use client"
import { useState } from "react"
import {
  MedicationSchedule,
  type DoseStatus,
} from "@workspace/registry/medication-schedule"

// One medication twice a day, with no interactions and no disclaimer.
export function Example() {
  const [doseStatus, setDoseStatus] = useState<Record<string, DoseStatus>>({})
  return (
    <MedicationSchedule
      medications={[
        {
          id: "amoxicillin",
          name: "Amoxicillin",
          dose: "500 mg",
          times: ["08:00", "20:00"],
        },
      ]}
      date="2026-10-22"
      doseStatus={doseStatus}
      onDoseStatusChange={setDoseStatus}
      now="12:00"
      disclaimer={null}
      label="Amoxicillin schedule"
    />
  )
}
