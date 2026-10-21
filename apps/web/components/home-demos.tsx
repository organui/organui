"use client"

import { useMemo, useState } from "react"
import { BodyMap } from "@workspace/registry/body-map"
import { EcgTrace, syntheticEcgStream } from "@workspace/registry/ecg-trace"
import {
  MedicationSchedule,
  type DoseStatus,
} from "@workspace/registry/medication-schedule"
import {
  exampleDate,
  exampleInteractions,
  exampleMedications,
} from "@/lib/medication-example"

// The components alone, for the home page; the docs demos add panels that
// explain their state.

export function HomeEcg() {
  const stream = useMemo(() => syntheticEcgStream({ heartRate: 72 }), [])
  return <EcgTrace stream={stream} duration={3} label="Live ECG" />
}

export function HomeBodyMap() {
  const [value, setValue] = useState<string[]>(["right-knee", "left-shoulder"])
  return (
    <BodyMap
      value={value}
      onValueChange={setValue}
      label="Where does it hurt?"
    />
  )
}

export function HomeMedicationSchedule() {
  const [date, setDate] = useState(exampleDate)
  const [doseStatus, setDoseStatus] = useState<Record<string, DoseStatus>>({})
  return (
    <MedicationSchedule
      medications={exampleMedications}
      interactions={exampleInteractions}
      date={date}
      onDateChange={setDate}
      doseStatus={doseStatus}
      onDoseStatusChange={setDoseStatus}
      now="10:15"
    />
  )
}
