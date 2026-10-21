import { expect, test } from "bun:test"
import { readFile } from "node:fs/promises"
import {
  ageInMonths,
  ageInYears,
  correctedAgeInMonths,
  formatAge,
} from "../registry/base-nova/age/age"
import {
  bmiCategory,
  bodyMassIndex,
  bodySurfaceArea,
} from "../registry/base-nova/body-measurements/body-measurements"
import {
  analyteUnit,
  celsiusToFahrenheit,
  convertAnalyte,
  fahrenheitToCelsius,
  inchesToCentimetres,
  kilogramsToPounds,
  roundTo,
} from "../registry/base-nova/clinical-units/clinical-units"
import {
  flagValue,
  formatReferenceRange,
} from "../registry/base-nova/reference-ranges/reference-ranges"
import {
  formatPercentile,
  lmsValue,
  lmsZScore,
  percentileToZ,
  zToPercentile,
} from "../registry/base-nova/z-scores/z-scores"
import { utilitiesCss } from "../scripts/utilities-css"

test("utilities.css matches the registry's css and cssVars", async () => {
  expect(
    await readFile(new URL("../utilities.css", import.meta.url), "utf8")
  ).toBe(utilitiesCss())
})

test("ages count months as WHO does and birthdays as people do", () => {
  const birth = new Date("2024-03-15T00:00:00Z")
  expect(ageInMonths(birth, new Date("2025-03-15T00:00:00Z"))).toBeCloseTo(
    12,
    1
  )
  expect(ageInYears(birth, new Date("2026-03-14T00:00:00Z"))).toBe(1)
  expect(ageInYears(birth, new Date("2026-03-15T00:00:00Z"))).toBe(2)
  // Born at 32 weeks: eight weeks, about 1.84 months, come off.
  expect(
    correctedAgeInMonths(birth, new Date("2024-09-15T00:00:00Z"), 32)
  ).toBeCloseTo(6.02 - 1.84, 1)
  expect(correctedAgeInMonths(birth, birth, 30)).toBe(0)
  expect(formatAge(9.5)).toBe("9.5 months")
  expect(formatAge(38)).toBe("3 y 2 mo")
})

test("z-scores and percentiles invert each other", () => {
  const lms = [0.1, 9.6, 0.11] as const
  expect(lmsZScore(9.6, lms)).toBeCloseTo(0, 6)
  expect(lmsZScore(lmsValue(lms, 1.5), lms)!).toBeCloseTo(1.5, 6)
  expect(lmsZScore(0, lms)).toBeNull()
  // Restricted extrapolation only changes values beyond 3 SD.
  const far = lmsValue(lms, 4)
  expect(lmsZScore(far, lms)!).toBeCloseTo(4, 6)
  expect(lmsZScore(far, lms, { restricted: true })!).not.toBeCloseTo(4, 2)
  expect(zToPercentile(0)).toBeCloseTo(50, 6)
  expect(zToPercentile(1.96)).toBeCloseTo(97.5, 2)
  expect(percentileToZ(97.5)).toBeCloseTo(1.96, 2)
  expect(formatPercentile(34.2)).toBe("34th")
  expect(formatPercentile(0.05)).toBe("<0.1st")
})

test("reference ranges flag critical limits first and print like a report", () => {
  const potassium = { low: 3.5, high: 5.1, criticalLow: 2.5, criticalHigh: 6 }
  expect(flagValue(6.4, potassium)).toBe("critical-high")
  expect(flagValue(5.5, potassium)).toBe("high")
  expect(flagValue(3.5, potassium)).toBe("normal")
  expect(flagValue("Negative", potassium)).toBe("unflagged")
  expect(flagValue(1, {})).toBe("unflagged")
  expect(formatReferenceRange(potassium, 1)).toBe("3.5–5.1")
  expect(formatReferenceRange({ high: 200 })).toBe("≤ 200")
})

test("units convert both ways with the published factors", () => {
  expect(roundTo(convertAnalyte("glucose", 100, "conventional", "si"), 1)).toBe(
    5.6
  )
  expect(
    roundTo(convertAnalyte("creatinine", 88.42, "si", "conventional"), 2)
  ).toBe(1)
  expect(convertAnalyte("cholesterol", 5, "si", "si")).toBe(5)
  expect(analyteUnit("bilirubin", "si")).toBe("µmol/L")
  expect(celsiusToFahrenheit(37)).toBeCloseTo(98.6, 6)
  expect(fahrenheitToCelsius(98.6)).toBeCloseTo(37, 6)
  expect(roundTo(kilogramsToPounds(70), 1)).toBe(154.3)
  expect(inchesToCentimetres(1)).toBe(2.54)
})

test("BMI and body surface area match worked examples", () => {
  const bmi = bodyMassIndex(70, 175)
  expect(roundTo2(bmi)).toBe(22.86)
  expect(bmiCategory(bmi)).toBe("normal")
  expect(bmiCategory(30)).toBe("obesity-1")
  expect(bmiCategory(18.4)).toBe("underweight")
  expect(roundTo2(bodySurfaceArea(70, 175))).toBe(1.84)
  expect(roundTo2(bodySurfaceArea(70, 175, "du-bois"))).toBe(1.85)
  expect(roundTo2(bodySurfaceArea(70, 175, "haycock"))).toBe(1.85)
})

function roundTo2(value: number) {
  return Math.round(value * 100) / 100
}
