import { AllergyList, allergySummary } from "@workspace/registry/allergy-list"
import {
  allergiesFromFhir,
  fhirResources,
  patientFromFhir,
  problemsFromFhir,
  type FhirBundle,
  type FhirPatient,
} from "@workspace/registry/fhir"
import { PatientBanner } from "@workspace/registry/patient-banner"
import { ProblemList } from "@workspace/registry/problem-list"

const snomed = "http://snomed.info/sct"
const clinical = (system: string, code: string) => ({
  coding: [{ system: `http://terminology.hl7.org/CodeSystem/${system}`, code }],
})

// A fictional patient's record, as a FHIR server returns it.
const bundle: FhirBundle = {
  resourceType: "Bundle",
  entry: [
    {
      resource: {
        resourceType: "Patient",
        name: [
          {
            use: "official",
            family: "Brennan",
            given: ["Tom"],
            prefix: ["Mr"],
          },
        ],
        birthDate: "1979-06-03",
        gender: "male",
        identifier: [
          { system: "https://fhir.nhs.uk/Id/nhs-number", value: "9991002014" },
        ],
      } satisfies FhirPatient,
    },
    {
      resource: {
        resourceType: "AllergyIntolerance",
        id: "codeine",
        code: {
          coding: [{ system: snomed, code: "387494007", display: "Codeine" }],
        },
        type: "intolerance",
        clinicalStatus: clinical("allergyintolerance-clinical", "active"),
        reaction: [{ manifestation: [{ text: "Vomiting" }], severity: "mild" }],
        recordedDate: "2019-02-20",
      },
    },
    {
      resource: {
        resourceType: "Condition",
        id: "asthma",
        code: {
          coding: [{ system: snomed, code: "195967001", display: "Asthma" }],
        },
        clinicalStatus: clinical("condition-clinical", "active"),
        onsetString: "Childhood",
      },
    },
    {
      resource: {
        resourceType: "Condition",
        id: "fracture",
        code: { text: "Fracture of left wrist" },
        clinicalStatus: clinical("condition-clinical", "resolved"),
        onsetDateTime: "2021-12-04",
        abatementDateTime: "2022-02-10",
      },
    },
  ],
}

export function Example() {
  const [patient] = fhirResources<FhirPatient>(bundle, "Patient")
  const allergies = allergiesFromFhir(bundle)
  return (
    <div className="flex w-full flex-col gap-6">
      <PatientBanner
        patient={patientFromFhir(patient!)}
        allergies={allergySummary(allergies)}
        today={new Date("2026-10-25")}
      />
      <AllergyList allergies={allergies} caption="Allergies" />
      <ProblemList problems={problemsFromFhir(bundle)} caption="Problems" />
    </div>
  )
}
