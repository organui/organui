import { allergySummary } from "@workspace/registry/allergy-list"
import {
  formatNhsNumber,
  PatientBanner,
} from "@workspace/registry/patient-banner"
import { allergyExampleData } from "@/lib/examples"

export function Example() {
  return (
    <PatientBanner
      patient={{
        name: { family: "Okafor", given: ["Grace", "Adaeze"], prefix: "Mrs" },
        birthDate: "1958-01-12",
        sex: "Female",
        identifiers: [
          { label: "NHS number", value: formatNhsNumber("9996543218") },
        ],
      }}
      allergies={allergySummary(allergyExampleData)}
      today={new Date("2026-10-25")}
      className="w-full"
    />
  )
}
