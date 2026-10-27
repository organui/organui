import { expect, test } from "bun:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  formatBannerDate,
  formatNhsNumber,
  formatPatientAge,
  formatPatientName,
  isValidNhsNumber,
  PatientBanner,
  type Patient,
} from "../registry/base-nova/patient-banner/patient-banner"

test("names read family name first, in capitals, then the title", () => {
  expect(
    formatPatientName({
      family: "Okafor",
      given: ["Grace", "Adaeze"],
      prefix: "Mrs",
    })
  ).toBe("OKAFOR, Grace Adaeze (Mrs)")
  expect(formatPatientName({ family: "Novak", given: ["Ella"] })).toBe(
    "NOVAK, Ella"
  )
  expect(formatPatientName({ family: "Unknown" })).toBe("UNKNOWN")
})

test("dates print day, month and year so they can't be swapped", () => {
  expect(formatBannerDate("1958-01-12")).toBe("12-Jan-1958")
  expect(formatBannerDate("2026-10-03T23:30:00Z")).toBe("03-Oct-2026")
  expect(formatBannerDate("not a date")).toBe("not a date")
})

test("age is in days, then months, then years", () => {
  const on = new Date("2026-10-25")
  expect(formatPatientAge("2026-10-24", on)).toBe("1 day")
  expect(formatPatientAge("2026-10-01", on)).toBe("24 days")
  expect(formatPatientAge("2026-09-25", on)).toBe("1 month")
  expect(formatPatientAge("2026-01-19", on)).toBe("9 months")
  expect(formatPatientAge("2024-10-26", on)).toBe("23 months")
  expect(formatPatientAge("2024-10-25", on)).toBe("2 years")
  // A birthday not yet reached this year is not counted.
  expect(formatPatientAge("1958-10-26", on)).toBe("67 years")
  expect(formatPatientAge("1958-10-25", on)).toBe("68 years")
  expect(formatPatientAge("2027-01-01", on)).toBeNull()
})

test("NHS numbers are checked with modulus 11 and spaced 3-3-4", () => {
  expect(isValidNhsNumber("9996543218")).toBe(true)
  expect(isValidNhsNumber("999 100 2014")).toBe(true)
  expect(isValidNhsNumber("9996543217")).toBe(false)
  expect(isValidNhsNumber("99965432")).toBe(false)
  // A check digit of 10 is never issued.
  expect(isValidNhsNumber("9991234560")).toBe(false)
  expect(formatNhsNumber("9996543218")).toBe("999 654 3218")
  expect(formatNhsNumber("12345")).toBe("12345")
})

const patient: Patient = {
  name: { family: "Brennan", given: ["Tom"], prefix: "Mr" },
  birthDate: "1979-06-03",
  sex: "Male",
  identifiers: [{ label: "NHS number", value: "999 654 3218" }],
}
const today = new Date("2026-10-25")
const render = (props: Partial<Parameters<typeof PatientBanner>[0]>) =>
  renderToStaticMarkup(
    createElement(PatientBanner, { patient, today, ...props })
  )

test("the banner names its section for the patient", () => {
  const html = render({})
  expect(html).toContain('aria-label="Patient: BRENNAN, Tom (Mr)"')
  expect(html).toContain("03-Jun-1979")
  expect(html).toContain("(47 years)")
  expect(html).toContain("<dt")
  expect(html).toContain("999 654 3218")
})

test("allergies not recorded, none known and recorded read differently", () => {
  expect(render({})).toContain("Allergies not recorded")
  expect(render({ allergies: [] })).toContain("Allergies not recorded")
  expect(render({ allergies: "none-known" })).toContain("No known allergies")
  const recorded = render({ allergies: ["Codeine", "Latex"] })
  expect(recorded).toContain('data-state="recorded"')
  expect(recorded).toContain("Codeine, Latex")
})

test("a date of death replaces the age", () => {
  const html = render({
    patient: { ...patient, deceasedDate: "2026-03-03" },
  })
  expect(html).toContain("Died 03-Mar-2026")
  expect(html).not.toContain("years)")
})
