import type { ItemDoc } from "@/components/item-docs"

// The content of each helper's page: how to use it, what it exports, and
// what to know before relying on it.
export const helperDocs: Record<string, ItemDoc> = {
  age: {
    usageLang: "tsx",
    usage: `import { ageInMonths, correctedAgeInMonths, formatAge } from "@/lib/age"

const birth = new Date("2025-02-10")
const measured = new Date("2026-01-20")

formatAge(ageInMonths(birth, measured)) // "11.3 months"
// Born at 32 weeks: eight weeks come off.
formatAge(correctedAgeInMonths(birth, measured, 32)) // "9.5 months"`,
    reference: [
      {
        name: "ageInMonths(birth, measured)",
        description:
          "Age in months, counting the average month of 30.4375 days as the WHO standards do.",
      },
      {
        name: "ageInYears(birth, on)",
        description: "Completed years, as a birthday counts them, in UTC.",
      },
      {
        name: "correctedAgeInMonths(birth, measured, gestationalWeeks)",
        description:
          "Age less the weeks born before 40, never below zero. Growth charts use it for babies born before 37 weeks, usually until 24 months.",
      },
      {
        name: "formatAge(ageMonths)",
        description:
          'Months to one decimal under 24 months, such as "9.5 months", then years and months, such as "3 y 2 mo".',
      },
    ],
    notes: [
      "Pass dates at UTC midnight, such as new Date(\"2025-02-10\"), so ages don't shift with the reader's time zone.",
      "The growth chart uses this file for its ages.",
    ],
  },
  "z-scores": {
    usageLang: "tsx",
    usage: `import { formatPercentile, lmsZScore, zToPercentile } from "@/lib/z-scores"

// L, M and S for the child's age and sex, from your reference tables.
const z = lmsZScore(10.6, [0.2, 9.4, 0.11], { restricted: true }) // 1.11
formatPercentile(zToPercentile(z!)) // "87th"`,
    reference: [
      {
        name: "lmsZScore(value, lms, { restricted? })",
        description:
          "The z-score of a measurement. restricted applies WHO's extrapolation beyond ±3 SD, which WHO uses for weight-based indicators. Null for a non-positive value.",
      },
      {
        name: "lmsValue(lms, z)",
        description: "The measurement at a z-score, for drawing curves.",
      },
      {
        name: "zToPercentile(z)",
        description:
          "The standard normal cumulative distribution as a percentile, accurate to 1.5e-7.",
      },
      {
        name: "percentileToZ(percentile)",
        description: "The z-score of a percentile between 0 and 100.",
      },
      {
        name: "formatPercentile(percentile)",
        description:
          'Ordinals such as "34th", with "<0.1st" and ">99.9th" at the ends.',
      },
    ],
    notes: [
      "The file ships no reference data. Take L, M and S from the standard you use, such as WHO or CDC, under its terms; the growth chart's page says where to get them.",
      "The growth chart uses this file for its z-scores and percentiles.",
    ],
  },
  "reference-ranges": {
    usageLang: "tsx",
    usage: `import {
  flagValue,
  formatReferenceRange,
  rangeFlagLabels,
} from "@/lib/reference-ranges"

const potassium = { low: 3.5, high: 5.1, criticalHigh: 6 }

flagValue(6.4, potassium) // "critical-high"
rangeFlagLabels[flagValue(5.5, potassium)] // "High"
formatReferenceRange(potassium, 1) // "3.5–5.1"`,
    reference: [
      {
        name: "flagValue(value, range)",
        description:
          "critical-low, low, normal, high or critical-high, checking critical limits first. Text values and ranges without limits are unflagged.",
      },
      {
        name: "formatReferenceRange(range, decimals?)",
        description:
          'The range as a report prints it: "70–99", "≤ 200", "≥ 60", or the range\'s own text.',
      },
      {
        name: "rangeFlagLabels",
        description: 'A label for each flag, such as "Critical high".',
      },
      {
        name: "ReferenceRange",
        description:
          "low and high, inclusive; criticalLow and criticalHigh; and text, shown instead of the numbers.",
      },
    ],
    notes: [
      "Limits are inclusive: a value equal to low or high is normal.",
      "Use the ranges your laboratory reports. The lab results table uses this file for its flags.",
    ],
  },
  "clinical-units": {
    usageLang: "tsx",
    usage: `import {
  celsiusToFahrenheit,
  convertAnalyte,
  roundTo,
} from "@/lib/clinical-units"

roundTo(convertAnalyte("glucose", 100, "conventional", "si"), 1) // 5.6 mmol/L
roundTo(convertAnalyte("creatinine", 88, "si", "conventional"), 2) // 1 mg/dL
roundTo(celsiusToFahrenheit(38.5), 1) // 101.3`,
    reference: [
      {
        name: "convertAnalyte(analyte, value, from, to)",
        description:
          'Converts between "conventional" and "si" units for glucose, cholesterol, triglycerides, creatinine, urea nitrogen, calcium, magnesium, phosphate, bilirubin, uric acid, hemoglobin and 25-hydroxyvitamin D.',
      },
      {
        name: "analyteUnit(analyte, system)",
        description: 'The unit for a system, such as "mmol/L".',
      },
      {
        name: "analytes",
        description:
          "Each analyte's name, units and the SI value of one conventional unit. Add your own in the same shape.",
      },
      {
        name: "celsiusToFahrenheit, fahrenheitToCelsius",
        description: "Temperature.",
      },
      {
        name: "kilogramsToPounds, poundsToKilograms",
        description: "Weight.",
      },
      {
        name: "centimetresToInches, inchesToCentimetres",
        description: "Length.",
      },
      {
        name: "roundTo(value, decimals)",
        description: "Rounds for display; convert first, round last.",
      },
    ],
    notes: [
      "Factors follow the AMA Manual of Style's SI conversion table. Laboratories can differ, for example in reporting urea rather than urea nitrogen, so check each factor against yours before clinical use.",
    ],
  },
  "body-measurements": {
    usageLang: "tsx",
    usage: `import {
  bmiCategory,
  bodyMassIndex,
  bodySurfaceArea,
} from "@/lib/body-measurements"

const bmi = bodyMassIndex(70, 175) // 22.86
bmiCategory(bmi) // "normal"
bodySurfaceArea(70, 175) // 1.84 m², Mosteller
bodySurfaceArea(20, 110, "haycock") // 0.78 m²`,
    reference: [
      {
        name: "bodyMassIndex(weightKg, heightCm)",
        description: "Weight in kilograms over height in metres squared.",
      },
      {
        name: "bmiCategory(bmi)",
        description:
          "The WHO adult category: underweight, normal, overweight, or obesity class I, II or III.",
      },
      {
        name: "bmiCategoryLabels",
        description: 'A label for each category, such as "Obesity class I".',
      },
      {
        name: "bodySurfaceArea(weightKg, heightCm, formula?)",
        description:
          'Square metres by "mosteller" (the default), "du-bois" or "haycock", which is often used in children.',
      },
    ],
    notes: [
      "BMI categories apply to adults. Children and adolescents are assessed with BMI-for-age percentiles instead.",
      "Doses calculated from body surface area need clinical review; the formulas differ by a few percent.",
    ],
  },
}
