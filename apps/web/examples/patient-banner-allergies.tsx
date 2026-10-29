import { PatientBanner } from "@workspace/registry/patient-banner"

const today = new Date("2026-10-25")

export function Example() {
  return (
    <div className="flex w-full flex-col gap-3">
      <PatientBanner
        patient={{
          name: { family: "Brennan", given: ["Tom"], prefix: "Mr" },
          birthDate: "1979-06-03",
          sex: "Male",
        }}
        today={today}
      />
      <PatientBanner
        patient={{
          name: { family: "Haddad", given: ["Leila"], prefix: "Ms" },
          birthDate: "1991-11-20",
          sex: "Female",
        }}
        allergies="none-known"
        today={today}
      />
      <PatientBanner
        patient={{
          name: { family: "Osei", given: ["Kwame"], prefix: "Mr" },
          birthDate: "1947-02-08",
          sex: "Male",
        }}
        allergies={["Codeine (vomiting)"]}
        today={today}
      />
    </div>
  )
}
