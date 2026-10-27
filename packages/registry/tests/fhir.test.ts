import { expect, test } from "bun:test"
import {
  allergiesFromFhir,
  fhirResources,
  labResultsFromFhir,
  patientFromFhir,
  problemsFromFhir,
  type FhirBundle,
  type FhirPatient,
  type FhirResource,
} from "../registry/base-nova/fhir/fhir"
import type { AllergyRecord } from "../registry/base-nova/allergy-list/allergy-list"
import type { LabResult } from "../registry/base-nova/lab-results/lab-results"
import type { Patient } from "../registry/base-nova/patient-banner/patient-banner"
import type { Problem } from "../registry/base-nova/problem-list/problem-list"

const snomed = "http://snomed.info/sct"
const status = (system: string, code: string) => ({
  coding: [{ system: `http://terminology.hl7.org/CodeSystem/${system}`, code }],
})

const patient: FhirPatient = {
  resourceType: "Patient",
  name: [
    { use: "maiden", family: "Adeyemi", given: ["Grace"] },
    {
      use: "official",
      family: "Okafor",
      given: ["Grace", "Adaeze"],
      prefix: ["Mrs"],
    },
  ],
  birthDate: "1958-01-12",
  gender: "female",
  identifier: [
    {
      system: "https://example.org/mrn",
      value: "RX4118204",
      type: { text: "Hospital number" },
    },
    { system: "https://fhir.nhs.uk/Id/nhs-number", value: "9996543218" },
  ],
}

test("a Patient becomes the banner's patient", () => {
  const banner: Patient = patientFromFhir(patient)
  expect(banner).toEqual({
    name: { family: "Okafor", given: ["Grace", "Adaeze"], prefix: "Mrs" },
    birthDate: "1958-01-12",
    sex: "Female",
    identifiers: [
      { label: "NHS number", value: "999 654 3218" },
      { label: "Hospital number", value: "RX4118204" },
    ],
    deceasedDate: undefined,
  })
  // A name that has ended is passed over.
  expect(
    patientFromFhir({
      resourceType: "Patient",
      name: [
        { use: "official", family: "Old", period: { end: "2001-01-01" } },
        { use: "usual", family: "New" },
      ],
    }).name.family
  ).toBe("New")
})

const resources: FhirResource[] = [
  patient,
  {
    resourceType: "AllergyIntolerance",
    id: "pen",
    code: {
      coding: [{ system: snomed, code: "764146007", display: "Penicillin" }],
    },
    type: "allergy",
    clinicalStatus: status("allergyintolerance-clinical", "active"),
    verificationStatus: status("allergyintolerance-verification", "confirmed"),
    reaction: [
      { manifestation: [{ text: "Rash" }], severity: "mild" },
      { manifestation: [{ text: "Anaphylaxis" }], severity: "severe" },
    ],
    recordedDate: "2003-05-14",
  },
  {
    resourceType: "AllergyIntolerance",
    id: "egg",
    code: { text: "Egg" },
    clinicalStatus: status("allergyintolerance-clinical", "resolved"),
    verificationStatus: status(
      "allergyintolerance-verification",
      "unconfirmed"
    ),
  },
  {
    resourceType: "AllergyIntolerance",
    id: "error",
    code: { text: "Latex" },
    verificationStatus: status(
      "allergyintolerance-verification",
      "entered-in-error"
    ),
  },
  {
    resourceType: "Condition",
    id: "t2dm",
    code: {
      coding: [
        { system: "http://hl7.org/fhir/sid/icd-10", code: "E11.9" },
        {
          system: snomed,
          code: "44054006",
          display: "Type 2 diabetes mellitus",
        },
      ],
    },
    clinicalStatus: status("condition-clinical", "active"),
    onsetDateTime: "2012-03-06",
  },
  {
    resourceType: "Condition",
    id: "asthma",
    code: { text: "Asthma" },
    clinicalStatus: status("condition-clinical", "remission"),
    onsetString: "Childhood",
    abatementString: "2010",
  },
  {
    resourceType: "Condition",
    id: "refuted",
    code: { text: "Epilepsy" },
    verificationStatus: status("condition-ver-status", "refuted"),
  },
]

test("AllergyIntolerance resources become the allergy list", () => {
  const allergies: AllergyRecord | undefined = allergiesFromFhir(resources)
  expect(allergies).toEqual([
    {
      id: "pen",
      substance: "Penicillin",
      type: "allergy",
      reactions: ["Rash", "Anaphylaxis"],
      severity: "severe",
      verification: "confirmed",
      status: "active",
      recordedDate: "2003-05-14",
    },
    {
      id: "egg",
      substance: "Egg",
      type: undefined,
      reactions: [],
      severity: undefined,
      verification: "unconfirmed",
      status: "resolved",
      recordedDate: undefined,
    },
  ])
})

test("no known allergy, and no records at all, stay apart", () => {
  const nka: FhirResource = {
    resourceType: "AllergyIntolerance",
    code: {
      coding: [
        { system: snomed, code: "716186003", display: "No known allergy" },
      ],
    },
  }
  expect(allergiesFromFhir([nka])).toBe("none-known")
  expect(allergiesFromFhir([patient])).toBeUndefined()
  // A real allergy outweighs an older "no known allergy".
  expect(allergiesFromFhir([nka, resources[1]!])).toHaveLength(1)
})

test("Condition resources become the problem list", () => {
  const problems: Problem[] = problemsFromFhir(resources)
  expect(problems).toEqual([
    {
      id: "t2dm",
      name: "Type 2 diabetes mellitus",
      // SNOMED CT wins over ICD-10, listed first.
      code: { system: "SNOMED CT", value: "44054006" },
      status: "active",
      onset: "2012-03-06",
      resolved: undefined,
    },
    {
      id: "asthma",
      name: "Asthma",
      code: undefined,
      status: "resolved",
      onset: "Childhood",
      resolved: "2010",
    },
  ])
})

const potassium = (id: string, value: number, date: string, code?: string) => ({
  resourceType: "Observation" as const,
  id,
  status: "final",
  code: {
    coding: [
      { system: "http://loinc.org", code: "2823-3", display: "Potassium" },
    ],
  },
  effectiveDateTime: date,
  valueQuantity: { value, unit: "mmol/L" },
  referenceRange: [{ low: { value: 3.5 }, high: { value: 5.1 } }],
  interpretation: code
    ? [
        {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
              code,
            },
          ],
        },
      ]
    : undefined,
})

test("Observations become one lab result per test, with history", () => {
  const bundle: FhirBundle = {
    resourceType: "Bundle",
    entry: [
      { resource: potassium("k2", 6.4, "2026-10-01", "HH") },
      { resource: potassium("k1", 4.2, "2026-01-12") },
      {
        resource: {
          ...potassium("k0", 9.9, "2026-02-01"),
          status: "entered-in-error",
        },
      },
      {
        resource: {
          resourceType: "Observation",
          id: "urine",
          code: { text: "Urine protein" },
          valueString: "Negative",
        },
      },
    ],
  }
  const results: LabResult[] = labResultsFromFhir(bundle)
  expect(results).toEqual([
    {
      id: "k2",
      name: "Potassium",
      value: 6.4,
      unit: "mmol/L",
      date: "2026-10-01",
      referenceRange: { low: 3.5, high: 5.1, text: undefined },
      flag: "critical-high",
      history: [
        { value: 4.2, date: "2026-01-12" },
        { value: 6.4, date: "2026-10-01" },
      ],
    },
    {
      id: "urine",
      name: "Urine protein",
      value: "Negative",
      unit: undefined,
      date: undefined,
      referenceRange: undefined,
      flag: undefined,
      history: undefined,
    },
  ])
})

test("resources are picked out of a list or a Bundle by type", () => {
  expect(fhirResources(resources, "Condition")).toHaveLength(3)
  expect(
    fhirResources(
      { resourceType: "Bundle", entry: [{ resource: patient }, {}] },
      "Patient"
    )
  ).toEqual([patient])
})
