import {
  formatNhsNumber,
  PatientBanner,
} from "@workspace/registry/patient-banner"

export function Example() {
  return (
    <PatientBanner
      patient={{
        name: { family: "Novak", given: ["Ella"] },
        birthDate: "2026-01-19",
        sex: "Female",
        identifiers: [
          { label: "NHS number", value: formatNhsNumber("9991002014") },
        ],
      }}
      allergies="none-known"
      alerts={["Safeguarding"]}
      today={new Date("2026-10-25")}
      className="w-full"
    />
  )
}
