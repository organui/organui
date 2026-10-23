"use client"

import * as React from "react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { EcgTrace, syntheticEcgStream } from "@/components/ui/ecg-trace"
import { LabResultsTable, type LabResult } from "@/components/ui/lab-results"
import {
  MedicationSchedule,
  type DoseStatus,
  type Medication,
  type MedicationInteraction,
} from "@/components/ui/medication-schedule"
import { VitalSigns, type VitalReadings } from "@/components/ui/vital-signs"

export type Patient = {
  name: string
  /** Shown under the name, such as age, ward and bed. */
  details: string
  /** Shown as badges beside the name, such as allergies. */
  alerts?: readonly string[]
  vitals: VitalReadings
  /** When the vitals were taken. */
  vitalsTakenAt: string
  labs: readonly LabResult[]
  medications: readonly Medication[]
  interactions?: readonly MedicationInteraction[]
  /** The day the schedule opens on, as YYYY-MM-DD. */
  date: string
  /** The current time, as HH:mm, to mark doses due. */
  now?: string
}

/**
 * One patient at a glance: vitals, a live ECG, labs with trends and today's
 * medicines. Replace examplePatient with your own records.
 */
export function PatientDashboard({ patient }: { patient: Patient }) {
  const stream = React.useMemo(
    () => syntheticEcgStream({ heartRate: patient.vitals.heartRate ?? 72 }),
    [patient.vitals.heartRate]
  )
  const [date, setDate] = React.useState(patient.date)
  const [doseStatus, setDoseStatus] = React.useState<
    Record<string, DoseStatus>
  >({})

  return (
    // The page provides the main landmark, so the dashboard also fits
    // inside an app layout that has one.
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {patient.name}
          </h1>
          {patient.alerts?.map((alert) => (
            <Badge key={alert} variant="destructive">
              {alert}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{patient.details}</p>
      </header>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <VitalSigns
          readings={patient.vitals}
          description={`Taken ${patient.vitalsTakenAt}`}
        />
        <Card>
          <CardHeader>
            <CardTitle>Heart rhythm</CardTitle>
            <CardDescription>Live monitor, synthetic signal</CardDescription>
          </CardHeader>
          <CardContent>
            <EcgTrace stream={stream} label="Live ECG" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Lab results</CardTitle>
            <CardDescription>Latest values and their trend</CardDescription>
          </CardHeader>
          <CardContent>
            <LabResultsTable
              results={patient.labs}
              caption={`Lab results for ${patient.name}`}
            />
          </CardContent>
        </Card>
        <MedicationSchedule
          medications={patient.medications}
          interactions={patient.interactions}
          date={date}
          onDateChange={setDate}
          doseStatus={doseStatus}
          onDoseStatusChange={setDoseStatus}
          now={patient.now}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Fictional patient and synthetic ECG. Not for clinical use.
      </p>
    </div>
  )
}

// A fictional patient, so the page shows something before you connect your
// own records. Not a treatment plan or clinical guidance.
export const examplePatient: Patient = {
  name: "Sam Okafor",
  details: "64 years · Ward 4B, bed 12 · Admitted Oct 17",
  alerts: ["Penicillin allergy"],
  vitals: {
    heartRate: 88,
    systolic: 142,
    diastolic: 86,
    spo2: 95,
    temperature: 37.4,
  },
  vitalsTakenAt: "at 09:40",
  labs: [
    {
      id: "glucose",
      name: "Glucose, fasting",
      value: 118,
      unit: "mg/dL",
      date: "2026-10-19",
      referenceRange: { low: 70, high: 99, criticalLow: 40, criticalHigh: 400 },
      history: [
        { value: 104, date: "2026-10-17" },
        { value: 111, date: "2026-10-18" },
        { value: 118, date: "2026-10-19" },
      ],
    },
    {
      id: "potassium",
      name: "Potassium",
      value: 4.1,
      unit: "mmol/L",
      decimals: 1,
      date: "2026-10-19",
      referenceRange: {
        low: 3.5,
        high: 5.1,
        criticalLow: 2.5,
        criticalHigh: 6.5,
      },
      history: [
        { value: 3.6, date: "2026-10-17" },
        { value: 3.9, date: "2026-10-18" },
        { value: 4.1, date: "2026-10-19" },
      ],
    },
    {
      id: "creatinine",
      name: "Creatinine",
      value: 1.4,
      unit: "mg/dL",
      decimals: 1,
      date: "2026-10-19",
      referenceRange: { low: 0.7, high: 1.3 },
      history: [
        { value: 1.1, date: "2026-10-17" },
        { value: 1.2, date: "2026-10-18" },
        { value: 1.4, date: "2026-10-19" },
      ],
    },
    {
      id: "hemoglobin",
      name: "Hemoglobin",
      value: 13.2,
      unit: "g/dL",
      decimals: 1,
      date: "2026-10-19",
      referenceRange: { low: 13.5, high: 17.5, criticalLow: 7 },
      history: [
        { value: 13.9, date: "2026-10-17" },
        { value: 13.5, date: "2026-10-18" },
        { value: 13.2, date: "2026-10-19" },
      ],
    },
  ],
  // Each medication gets its own hue: a theme's chart colours can all be
  // shades of one, which would make the doses hard to tell apart.
  medications: [
    {
      id: "metformin",
      name: "Metformin",
      dose: "500 mg",
      instructions: "With breakfast and dinner",
      times: ["08:00", "18:00"],
      color: "oklch(0.62 0.13 160)",
    },
    {
      id: "lisinopril",
      name: "Lisinopril",
      dose: "10 mg",
      times: ["08:00"],
      color: "oklch(0.62 0.15 250)",
    },
    {
      id: "enoxaparin",
      name: "Enoxaparin",
      dose: "40 mg",
      instructions: "Under the skin",
      times: ["20:00"],
      color: "oklch(0.6 0.18 25)",
    },
    {
      id: "ibuprofen",
      name: "Ibuprofen",
      dose: "400 mg",
      instructions: "With food",
      times: ["12:00"],
      color: "oklch(0.6 0.14 310)",
    },
  ],
  interactions: [
    {
      id: "enoxaparin-ibuprofen",
      medicationIds: ["enoxaparin", "ibuprofen"],
      severity: "major",
      summary: "Taken together, these can raise the risk of bleeding.",
    },
  ],
  date: "2026-10-19",
  now: "10:15",
}
