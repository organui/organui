import {
  examplePatient,
  PatientDashboard,
} from "@/components/patient-dashboard"

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-7xl p-4 md:p-6">
      <PatientDashboard patient={examplePatient} />
    </main>
  )
}
