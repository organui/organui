import { expect, test } from "bun:test"
import {
  adultVitalRanges,
  assessVital,
  bloodPressureStatus,
  resolveVitalRanges,
  vitalStatus,
} from "../registry/base-nova/vital-signs/vital-signs.js"

test("ranges are inclusive and missing readings are not normal", () => {
  const range = { low: 60, high: 100 }
  expect(vitalStatus(60, range)).toBe("normal")
  expect(vitalStatus(100, range)).toBe("normal")
  expect(vitalStatus(59, range)).toBe("low")
  expect(vitalStatus(101, range)).toBe("high")
  expect(vitalStatus(null, range)).toBe("missing")
  expect(vitalStatus(undefined, range)).toBe("missing")
  expect(vitalStatus(Number.NaN, range)).toBe("missing")
})

test("blood pressure takes the worse part, high before low", () => {
  expect(bloodPressureStatus("normal", "normal")).toBe("normal")
  expect(bloodPressureStatus("high", "normal")).toBe("high")
  expect(bloodPressureStatus("normal", "low")).toBe("low")
  expect(bloodPressureStatus("low", "high")).toBe("high")
  expect(bloodPressureStatus("missing", "normal")).toBe("missing")
})

test("blood pressure text names the part out of range", () => {
  const ranges = resolveVitalRanges()
  const bp = (systolic: number, diastolic: number) =>
    assessVital("bloodPressure", { systolic, diastolic }, ranges)
  expect(bp(118, 76)).toMatchObject({
    value: "118/76",
    status: "normal",
    statusLabel: "Normal",
    range: "90–120 / 60–80",
  })
  expect(bp(150, 76).statusLabel).toBe("High systolic")
  expect(bp(150, 95).statusLabel).toBe("High")
  expect(bp(130, 55).statusLabel).toBe("High systolic, low diastolic")
  expect(assessVital("bloodPressure", { systolic: 120 }, ranges)).toMatchObject(
    { value: null, status: "missing", statusLabel: "No reading" }
  )
})

test("overrides replace one vital and keep the other defaults", () => {
  const ranges = resolveVitalRanges({ spo2: { low: 88, high: 92 } })
  expect(ranges.spo2).toEqual({ low: 88, high: 92 })
  expect(ranges.heartRate).toEqual(adultVitalRanges.heartRate)
  expect(assessVital("spo2", { spo2: 90 }, ranges).status).toBe("normal")
  expect(assessVital("spo2", { spo2: 94 }, ranges).status).toBe("high")
})

test("fahrenheit converts the default temperature range only", () => {
  expect(resolveVitalRanges({}, "fahrenheit").temperature).toEqual({
    low: 97,
    high: 99,
  })
  const custom = { low: 96, high: 100 }
  expect(
    resolveVitalRanges({ temperature: custom }, "fahrenheit").temperature
  ).toEqual(custom)
  const ranges = resolveVitalRanges({}, "fahrenheit")
  expect(
    assessVital("temperature", { temperature: 100.4 }, ranges, "fahrenheit")
  ).toMatchObject({ value: "100.4", unit: "°F", status: "high" })
})

test("values format with the given locale", () => {
  expect(
    assessVital(
      "temperature",
      { temperature: 37 },
      resolveVitalRanges(),
      "celsius",
      "de-DE"
    )
  ).toMatchObject({ value: "37,0", range: "36,1–37,2", unit: "°C" })
})
