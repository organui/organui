import {
  AllergyList,
  allergySummary,
  type AllergyRecord,
} from "@/components/ui/allergy-list"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LabResultsTable, type LabResult } from "@/components/ui/lab-results"
import { News2Chart, type News2Observation } from "@/components/ui/news2-chart"
import {
  formatBannerDate,
  formatNhsNumber,
  PatientBanner,
  type Patient,
} from "@/components/ui/patient-banner"
import { ProblemList, type Problem } from "@/components/ui/problem-list"

export type PatientRecordData = {
  patient: Patient
  alerts?: readonly string[]
  allergies?: AllergyRecord
  problems: readonly Problem[]
  observations: readonly News2Observation[]
  labs: readonly LabResult[]
  /** The day ages are counted on. */
  today?: Date
}

// Every date on the record in the banner's unambiguous form, such as
// "25-Oct-2026", and times as "25-Oct 10:00".
const formatTime = (time: string) =>
  `${formatBannerDate(time).slice(0, 6)} ${time.slice(11, 16)}`

/**
 * One patient's record on a ward: who they are, their early warning score
 * over time, the latest labs, and their allergies and problems. Replace
 * examplePatientRecord with your own records, such as from the fhir helper.
 */
export function PatientRecord({ record }: { record: PatientRecordData }) {
  return (
    // The page provides the main landmark, so the record also fits inside an
    // app layout that has one.
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Patient record</h1>
      <PatientBanner
        patient={record.patient}
        allergies={allergySummary(record.allergies)}
        alerts={record.alerts}
        today={record.today}
      />
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Observations</CardTitle>
              <CardDescription>NEWS2, newest first</CardDescription>
            </CardHeader>
            <CardContent>
              <News2Chart
                observations={record.observations}
                formatTime={formatTime}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Lab results</CardTitle>
              <CardDescription>Latest values and their trend</CardDescription>
            </CardHeader>
            <CardContent>
              <LabResultsTable
                results={record.labs}
                caption="Lab results this admission"
                formatDate={formatBannerDate}
              />
            </CardContent>
          </Card>
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Allergies</CardTitle>
              <CardDescription>And adverse reactions</CardDescription>
            </CardHeader>
            <CardContent>
              <AllergyList
                allergies={record.allergies}
                caption="Allergies and adverse reactions"
                formatDate={formatBannerDate}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Problems</CardTitle>
              <CardDescription>Active and past</CardDescription>
            </CardHeader>
            <CardContent>
              <ProblemList
                problems={record.problems}
                caption="Problem list"
                formatDate={formatBannerDate}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Fictional patient. Not for clinical use.
      </p>
    </div>
  )
}

const observation = (
  time: string,
  respirationRate: number,
  spo2: number,
  onOxygen: boolean,
  systolic: number,
  pulse: number,
  temperature: number
): News2Observation => ({
  time,
  respirationRate,
  spo2,
  onOxygen,
  systolic,
  pulse,
  consciousness: "alert",
  temperature,
})

// A fictional patient admitted with sepsis from a urinary infection, settling
// overnight on antibiotics, so the page shows something before you connect
// your own records. Not a treatment plan or clinical guidance.
export const examplePatientRecord: PatientRecordData = {
  patient: {
    name: { family: "Okafor", given: ["Grace", "Adaeze"], prefix: "Mrs" },
    birthDate: "1958-01-12",
    sex: "Female",
    identifiers: [
      { label: "NHS number", value: formatNhsNumber("9996543218") },
      { label: "Hospital number", value: "RX4 118204" },
    ],
  },
  alerts: ["Falls risk"],
  allergies: [
    {
      id: "penicillin",
      substance: "Penicillin",
      reactions: ["Anaphylaxis"],
      severity: "severe",
      verification: "confirmed",
      recordedDate: "2003-05-14",
    },
    {
      id: "codeine",
      substance: "Codeine",
      type: "intolerance",
      reactions: ["Vomiting"],
      severity: "mild",
      recordedDate: "2019-02-20",
    },
  ],
  problems: [
    {
      id: "sepsis",
      name: "Sepsis from a urinary tract infection",
      significance: "major",
      onset: "2026-10-24",
    },
    {
      id: "diabetes",
      name: "Type 2 diabetes mellitus",
      code: { system: "SNOMED CT", value: "44054006" },
      significance: "major",
      onset: "2012-03-06",
    },
    {
      id: "ckd",
      name: "Chronic kidney disease stage 3A",
      code: { system: "SNOMED CT", value: "700378005" },
      significance: "major",
      onset: "2023-06-02",
    },
    {
      id: "hypertension",
      name: "Essential hypertension",
      code: { system: "SNOMED CT", value: "59621000" },
      onset: "2009-11-17",
    },
    {
      id: "pneumonia",
      name: "Community acquired pneumonia",
      code: { system: "SNOMED CT", value: "385093006" },
      status: "resolved",
      onset: "2024-01-08",
      resolved: "2024-02-01",
    },
  ],
  observations: [
    observation("2026-10-24T18:00:00Z", 24, 93, false, 98, 112, 38.9),
    observation("2026-10-24T22:00:00Z", 22, 95, true, 108, 102, 38.2),
    observation("2026-10-25T02:00:00Z", 20, 96, true, 114, 96, 37.8),
    observation("2026-10-25T06:00:00Z", 18, 95, false, 118, 92, 37.6),
    observation("2026-10-25T10:00:00Z", 18, 96, false, 122, 88, 37.4),
  ],
  labs: [
    {
      id: "crp",
      name: "C-reactive protein",
      value: 186,
      unit: "mg/L",
      date: "2026-10-25",
      referenceRange: { high: 5 },
      history: [
        { value: 212, date: "2026-10-24" },
        { value: 186, date: "2026-10-25" },
      ],
    },
    {
      id: "wcc",
      name: "White cell count",
      value: 14.2,
      unit: "×10⁹/L",
      decimals: 1,
      date: "2026-10-25",
      referenceRange: { low: 4, high: 11 },
      history: [
        { value: 16.8, date: "2026-10-24" },
        { value: 14.2, date: "2026-10-25" },
      ],
    },
    {
      id: "creatinine",
      name: "Creatinine",
      value: 142,
      unit: "µmol/L",
      date: "2026-10-25",
      referenceRange: { low: 45, high: 84 },
      history: [
        { value: 118, date: "2026-09-02" },
        { value: 156, date: "2026-10-24" },
        { value: 142, date: "2026-10-25" },
      ],
    },
    {
      id: "potassium",
      name: "Potassium",
      value: 4.8,
      unit: "mmol/L",
      decimals: 1,
      date: "2026-10-25",
      referenceRange: {
        low: 3.5,
        high: 5.3,
        criticalLow: 2.5,
        criticalHigh: 6.5,
      },
    },
  ],
  today: new Date("2026-10-25"),
}
