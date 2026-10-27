import {
  examplePatientRecord,
  PatientRecord,
} from "@/components/patient-record"

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-7xl p-4 md:p-6">
      <PatientRecord record={examplePatientRecord} />
    </main>
  )
}
