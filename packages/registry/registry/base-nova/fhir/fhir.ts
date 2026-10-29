// FHIR R4 resources turned into the props of OrganUI's clinical components.
// Only the elements read here are typed; the results match the components'
// types by shape, so this file depends on none of them.

export type FhirCoding = { system?: string; code?: string; display?: string }
export type FhirCodeableConcept = { coding?: FhirCoding[]; text?: string }
type Quantity = { value?: number; unit?: string }

export type FhirPatient = {
  resourceType: "Patient"
  id?: string
  name?: {
    use?: string
    family?: string
    given?: string[]
    prefix?: string[]
    period?: { end?: string }
  }[]
  birthDate?: string
  gender?: "male" | "female" | "other" | "unknown"
  identifier?: {
    system?: string
    value?: string
    type?: FhirCodeableConcept
  }[]
  deceasedDateTime?: string
}

export type FhirAllergyIntolerance = {
  resourceType: "AllergyIntolerance"
  id?: string
  code?: FhirCodeableConcept
  type?: "allergy" | "intolerance"
  clinicalStatus?: FhirCodeableConcept
  verificationStatus?: FhirCodeableConcept
  reaction?: {
    manifestation?: FhirCodeableConcept[]
    severity?: "mild" | "moderate" | "severe"
  }[]
  recordedDate?: string
}

export type FhirCondition = {
  resourceType: "Condition"
  id?: string
  code?: FhirCodeableConcept
  clinicalStatus?: FhirCodeableConcept
  verificationStatus?: FhirCodeableConcept
  onsetDateTime?: string
  onsetString?: string
  onsetPeriod?: { start?: string }
  abatementDateTime?: string
  abatementString?: string
  abatementPeriod?: { end?: string }
}

export type FhirObservation = {
  resourceType: "Observation"
  id?: string
  status?: string
  code?: FhirCodeableConcept
  effectiveDateTime?: string
  valueQuantity?: Quantity
  valueString?: string
  valueCodeableConcept?: FhirCodeableConcept
  referenceRange?: { low?: Quantity; high?: Quantity; text?: string }[]
  interpretation?: FhirCodeableConcept[]
}

export type FhirResource =
  | FhirPatient
  | FhirAllergyIntolerance
  | FhirCondition
  | FhirObservation
  | { resourceType: string }

export type FhirBundle = {
  resourceType: "Bundle"
  entry?: { resource?: FhirResource }[]
}

/** Code systems shown by name; any other shows its URL. */
export const fhirSystemNames: Record<string, string> = {
  "http://snomed.info/sct": "SNOMED CT",
  "http://hl7.org/fhir/sid/icd-10": "ICD-10",
  "http://loinc.org": "LOINC",
}

const nhsNumberSystem = "https://fhir.nhs.uk/Id/nhs-number"
// SNOMED CT 716186003 |No known allergy|.
const noKnownAllergy = "716186003"

/** The resources of one type, from a list or a Bundle. */
export function fhirResources<T extends FhirResource>(
  source: readonly FhirResource[] | FhirBundle,
  resourceType: T["resourceType"]
): T[] {
  const resources = Array.isArray(source)
    ? source
    : ((source as FhirBundle).entry ?? []).flatMap(({ resource }) =>
        resource ? [resource] : []
      )
  return resources.filter(
    (resource): resource is T => resource.resourceType === resourceType
  )
}

/** A concept's text, or its first coding's display. */
export function conceptText(concept?: FhirCodeableConcept) {
  return (
    concept?.text ?? concept?.coding?.find(({ display }) => display)?.display
  )
}

function statusCode(concept?: FhirCodeableConcept) {
  return concept?.coding?.find(({ code }) => code)?.code
}

// Entered in error, or found not to be true: not part of the record.
function withdrawn(verification?: FhirCodeableConcept) {
  const code = statusCode(verification)
  return code === "entered-in-error" || code === "refuted"
}

/**
 * A Patient for the patient banner: the official name (else the first still
 * in use), date of birth, administrative gender, identifiers with the NHS
 * number first and spaced 3-3-4, and any date of death.
 */
export function patientFromFhir(patient: FhirPatient) {
  const names = patient.name ?? []
  const current = names.filter(({ period }) => !period?.end)
  const name =
    current.find(({ use }) => use === "official") ??
    current.find(({ use }) => use === "usual") ??
    current[0] ??
    names[0]
  const identifiers = (patient.identifier ?? [])
    .filter(({ value }) => value)
    .map(({ system, value, type }) =>
      system === nhsNumberSystem
        ? {
            label: "NHS number",
            value: value!.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1 $2 $3"),
          }
        : { label: conceptText(type) ?? "Identifier", value: value! }
    )
    .sort(
      (a, b) =>
        Number(b.label === "NHS number") - Number(a.label === "NHS number")
    )
  return {
    name: {
      family: name?.family ?? "Unknown",
      given: name?.given ?? [],
      prefix: name?.prefix?.[0],
    },
    birthDate: patient.birthDate ?? "",
    sex: patient.gender
      ? patient.gender[0]!.toUpperCase() + patient.gender.slice(1)
      : undefined,
    identifiers,
    deceasedDate: patient.deceasedDateTime,
  }
}

const severityRank = { mild: 1, moderate: 2, severe: 3 } as const

/**
 * AllergyIntolerance resources for the allergy list: substance, type, every
 * reaction, the worst severity, verification, status and date. Records
 * entered in error or refuted are left out. A "No known allergy" record
 * (SNOMED CT 716186003) with nothing else becomes `"none-known"`; no records
 * at all stay undefined, as not recorded.
 */
export function allergiesFromFhir(
  source: readonly FhirResource[] | FhirBundle
) {
  const records = fhirResources<FhirAllergyIntolerance>(
    source,
    "AllergyIntolerance"
  ).filter(({ verificationStatus }) => !withdrawn(verificationStatus))
  if (!records.length) return undefined
  const allergies = records.filter(
    ({ code }) =>
      !code?.coding?.some(
        ({ system, code }) =>
          system === "http://snomed.info/sct" && code === noKnownAllergy
      )
  )
  if (!allergies.length) return "none-known" as const
  return allergies.map((record, index) => {
    const reactions = [
      ...new Set(
        (record.reaction ?? []).flatMap(({ manifestation }) =>
          (manifestation ?? []).flatMap((concept) => {
            const text = conceptText(concept)
            return text ? [text] : []
          })
        )
      ),
    ]
    const severity = (record.reaction ?? [])
      .map(({ severity }) => severity)
      .filter((value) => value !== undefined)
      .sort((a, b) => severityRank[b] - severityRank[a])[0]
    const verification = statusCode(record.verificationStatus)
    const status = statusCode(record.clinicalStatus)
    return {
      id: record.id ?? `allergy-${index}`,
      substance: conceptText(record.code) ?? "Unknown substance",
      type: record.type,
      reactions,
      severity,
      verification:
        verification === "confirmed"
          ? ("confirmed" as const)
          : verification === "unconfirmed" || verification === "presumed"
            ? ("unconfirmed" as const)
            : undefined,
      status:
        status === "inactive"
          ? ("inactive" as const)
          : status === "resolved"
            ? ("resolved" as const)
            : ("active" as const),
      recordedDate: record.recordedDate,
    }
  })
}

/**
 * Condition resources for the problem list: the name, its SNOMED CT code
 * (else another), active or past status, and onset and resolution as dates or text.
 * Records entered in error or refuted are left out.
 */
export function problemsFromFhir(source: readonly FhirResource[] | FhirBundle) {
  return fhirResources<FhirCondition>(source, "Condition")
    .filter(({ verificationStatus }) => !withdrawn(verificationStatus))
    .map((condition, index) => {
      // SNOMED CT first, as problem lists are coded, then another named
      // system, then any code.
      const codings = condition.code?.coding?.filter(({ code }) => code) ?? []
      const coding =
        codings.find(({ system }) => system === "http://snomed.info/sct") ??
        codings.find(({ system }) => system && fhirSystemNames[system]) ??
        codings[0]
      const status = statusCode(condition.clinicalStatus)
      return {
        id: condition.id ?? `problem-${index}`,
        name: conceptText(condition.code) ?? "Unnamed problem",
        code: coding?.code
          ? {
              system:
                (coding.system && fhirSystemNames[coding.system]) ??
                coding.system ??
                "Code",
              value: coding.code,
            }
          : undefined,
        status:
          status === "inactive"
            ? ("inactive" as const)
            : status === "resolved" || status === "remission"
              ? ("resolved" as const)
              : ("active" as const),
        onset:
          condition.onsetDateTime ??
          condition.onsetPeriod?.start ??
          condition.onsetString,
        resolved:
          condition.abatementDateTime ??
          condition.abatementPeriod?.end ??
          condition.abatementString,
      }
    })
}

// HL7 v3 ObservationInterpretation codes, as the lab results table's flags.
const interpretationFlags: Record<
  string,
  "low" | "high" | "critical-low" | "critical-high" | "abnormal" | "normal"
> = {
  L: "low",
  H: "high",
  LL: "critical-low",
  HH: "critical-high",
  A: "abnormal",
  AA: "abnormal",
  N: "normal",
}

/**
 * Observation resources for the lab results table: one row per test, the
 * latest result with the laboratory's flag, range and unit, and every
 * numeric result of the same code as its history. Cancelled and
 * entered-in-error results are left out.
 */
export function labResultsFromFhir(
  source: readonly FhirResource[] | FhirBundle
) {
  const observations = fhirResources<FhirObservation>(source, "Observation")
    .filter(
      ({ status }) => status !== "cancelled" && status !== "entered-in-error"
    )
    .sort(
      (a, b) =>
        Date.parse(a.effectiveDateTime ?? "") -
        Date.parse(b.effectiveDateTime ?? "")
    )
  const byTest = new Map<string, FhirObservation[]>()
  for (const observation of observations) {
    const coding = observation.code?.coding?.find(({ code }) => code)
    const key = coding
      ? `${coding.system}|${coding.code}`
      : (conceptText(observation.code) ?? observation.id ?? "")
    byTest.set(key, [...(byTest.get(key) ?? []), observation])
  }
  return [...byTest.entries()].map(([key, results]) => {
    const latest = results.at(-1)!
    const range = latest.referenceRange?.[0]
    const flag = latest.interpretation
      ?.flatMap(({ coding }) => coding ?? [])
      .map(({ code }) => code && interpretationFlags[code])
      .find(Boolean)
    const history = results.flatMap(({ valueQuantity, effectiveDateTime }) =>
      valueQuantity?.value !== undefined && effectiveDateTime
        ? [{ value: valueQuantity.value, date: effectiveDateTime }]
        : []
    )
    return {
      id: latest.id ?? key,
      name: conceptText(latest.code) ?? "Unnamed test",
      value:
        latest.valueQuantity?.value ??
        latest.valueString ??
        conceptText(latest.valueCodeableConcept) ??
        "",
      unit: latest.valueQuantity?.unit,
      date: latest.effectiveDateTime,
      referenceRange: range
        ? { low: range.low?.value, high: range.high?.value, text: range.text }
        : undefined,
      flag: flag || undefined,
      history: history.length > 1 ? history : undefined,
    }
  })
}
