import {
  formatNhsNumber,
  PatientBanner,
} from "@workspace/registry/patient-banner"

export function Example() {
  return (
    <div role="region" aria-label="Patient banner example" className="w-full">
      <PatientBanner
        patient={{
          name: { family: "Okafor", given: ["Grace", "Adaeze"], prefix: "Mrs" },
          birthDate: "1958-01-12",
          sex: "Female",
          identifiers: [
            { label: "NHS number", value: formatNhsNumber("9996543218") },
            { label: "Hospital number", value: "RX4 118204" },
          ],
        }}
        allergies={["Penicillin (anaphylaxis)", "Latex"]}
        alerts={["Falls risk"]}
        today={new Date("2026-10-25")}
      />
    </div>
  )
}
