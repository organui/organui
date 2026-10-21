/**
 * Laboratory analytes with their conventional (US) and SI units, and the SI
 * value of one conventional unit. Factors follow the AMA Manual of Style's
 * SI conversion table.
 */
export const analytes = {
  glucose: {
    name: "Glucose",
    conventional: "mg/dL",
    si: "mmol/L",
    factor: 0.0555,
  },
  cholesterol: {
    name: "Cholesterol",
    conventional: "mg/dL",
    si: "mmol/L",
    factor: 0.02586,
  },
  triglycerides: {
    name: "Triglycerides",
    conventional: "mg/dL",
    si: "mmol/L",
    factor: 0.01129,
  },
  creatinine: {
    name: "Creatinine",
    conventional: "mg/dL",
    si: "µmol/L",
    factor: 88.42,
  },
  urea: {
    name: "Urea nitrogen",
    conventional: "mg/dL",
    si: "mmol/L",
    factor: 0.357,
  },
  calcium: {
    name: "Calcium",
    conventional: "mg/dL",
    si: "mmol/L",
    factor: 0.2495,
  },
  magnesium: {
    name: "Magnesium",
    conventional: "mg/dL",
    si: "mmol/L",
    factor: 0.4114,
  },
  phosphate: {
    name: "Phosphate",
    conventional: "mg/dL",
    si: "mmol/L",
    factor: 0.3229,
  },
  bilirubin: {
    name: "Bilirubin",
    conventional: "mg/dL",
    si: "µmol/L",
    factor: 17.1,
  },
  uricAcid: {
    name: "Uric acid",
    conventional: "mg/dL",
    si: "µmol/L",
    factor: 59.48,
  },
  hemoglobin: {
    name: "Hemoglobin",
    conventional: "g/dL",
    si: "g/L",
    factor: 10,
  },
  vitaminD: {
    name: "25-hydroxyvitamin D",
    conventional: "ng/mL",
    si: "nmol/L",
    factor: 2.496,
  },
} as const

export type Analyte = keyof typeof analytes
export type UnitSystem = "conventional" | "si"

/** Converts an analyte's value from one unit system to the other. */
export function convertAnalyte(
  analyte: Analyte,
  value: number,
  from: UnitSystem,
  to: UnitSystem
) {
  if (from === to) return value
  const { factor } = analytes[analyte]
  return to === "si" ? value * factor : value / factor
}

/** The unit an analyte is reported in for a unit system, such as "mmol/L". */
export function analyteUnit(analyte: Analyte, system: UnitSystem) {
  return analytes[analyte][system]
}

export function celsiusToFahrenheit(celsius: number) {
  return (celsius * 9) / 5 + 32
}

export function fahrenheitToCelsius(fahrenheit: number) {
  return ((fahrenheit - 32) * 5) / 9
}

const poundsPerKilogram = 2.204_622_621_8
const centimetresPerInch = 2.54

export function kilogramsToPounds(kilograms: number) {
  return kilograms * poundsPerKilogram
}

export function poundsToKilograms(pounds: number) {
  return pounds / poundsPerKilogram
}

export function centimetresToInches(centimetres: number) {
  return centimetres / centimetresPerInch
}

export function inchesToCentimetres(inches: number) {
  return inches * centimetresPerInch
}

/** Rounds to a number of decimal places, for display. */
export function roundTo(value: number, decimals: number) {
  const scale = 10 ** decimals
  return Math.round(value * scale) / scale
}
