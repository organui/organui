import { expect, test } from "bun:test"
import {
  activeInteractions,
  addDays,
  doseConflicts,
  dosesOn,
  nextDoseStatus,
  parseTime,
  type Medication,
  type MedicationInteraction,
} from "../registry/base-nova/medication-schedule/medication-schedule.js"

const medications: Medication[] = [
  { id: "levo", name: "Levothyroxine", times: ["07:00"] },
  { id: "calcium", name: "Calcium", times: ["08:00", "20:00"] },
  // Saturdays only, during October.
  {
    id: "mtx",
    name: "Methotrexate",
    times: ["09:00"],
    days: [6],
    start: "2026-10-01",
    end: "2026-10-31",
  },
  { id: "folic", name: "Folic acid", times: ["09:00"], days: [0] },
]
const interactions: MedicationInteraction[] = [
  {
    id: "levo-calcium",
    medicationIds: ["levo", "calcium"],
    severity: "moderate",
    summary: "Calcium reduces absorption.",
    separationHours: 4,
  },
  {
    id: "mtx-folic",
    medicationIds: ["mtx", "folic"],
    severity: "minor",
    summary: "Example only.",
  },
  {
    id: "mtx-levo",
    medicationIds: ["mtx", "levo"],
    severity: "major",
    summary: "Example only.",
  },
  {
    id: "unknown",
    medicationIds: ["levo", "missing"],
    severity: "major",
    summary: "Not scheduled.",
  },
]

test("times and dates are validated", () => {
  expect(parseTime("00:00")).toBe(0)
  expect(parseTime("23:59")).toBe(1439)
  for (const time of ["24:00", "7:00", "07:60", ""])
    expect(() => parseTime(time)).toThrow('Dose times must be "HH:MM"')
  expect(() => dosesOn(medications, "2026-02-30")).toThrow(
    'Dates must be "YYYY-MM-DD"'
  )
  expect(() =>
    dosesOn(
      [...medications, { id: "levo", name: "Again", times: [] }],
      "2026-10-17"
    )
  ).toThrow("Medication IDs must be nonempty and unique")
})

test("doses follow weekdays and date ranges, in time order", () => {
  // 2026-10-17 is a Saturday.
  const saturday = dosesOn(medications, "2026-10-17")
  expect(saturday.map(({ key }) => key)).toEqual([
    "levo@2026-10-17T07:00",
    "calcium@2026-10-17T08:00",
    "mtx@2026-10-17T09:00",
    "calcium@2026-10-17T20:00",
  ])
  expect(
    dosesOn(medications, "2026-10-18").map(({ medication }) => medication.id)
  ).toEqual(["levo", "calcium", "folic", "calcium"])
  // Outside the range, the Saturday dose is not due.
  expect(
    dosesOn(medications, "2026-11-07").some(
      ({ medication }) => medication.id === "mtx"
    )
  ).toBe(false)
})

test("dates step across month and year boundaries", () => {
  expect(addDays("2026-10-31", 1)).toBe("2026-11-01")
  expect(addDays("2027-01-01", -1)).toBe("2026-12-31")
  expect(addDays("2028-02-28", 1)).toBe("2028-02-29")
})

test("interactions show when all their medications dose, most severe first", () => {
  const saturday = activeInteractions(
    dosesOn(medications, "2026-10-17"),
    interactions
  )
  expect(saturday.map(({ id }) => id)).toEqual(["mtx-levo", "levo-calcium"])
  const sunday = activeInteractions(
    dosesOn(medications, "2026-10-18"),
    interactions
  )
  expect(sunday.map(({ id }) => id)).toEqual(["levo-calcium"])
})

test("doses inside a separation window are flagged in pairs", () => {
  const conflicts = doseConflicts(
    dosesOn(medications, "2026-10-17"),
    interactions
  )
  expect(
    conflicts.map(({ interaction, doses }) => [
      interaction.id,
      doses.map(({ key }) => key),
    ])
  ).toEqual([
    ["levo-calcium", ["levo@2026-10-17T07:00", "calcium@2026-10-17T08:00"]],
  ])
})

test("dose status cycles through taken and skipped", () => {
  const key = "levo@2026-10-17T07:00"
  const taken = nextDoseStatus({}, key)
  expect(taken).toEqual({ [key]: "taken" })
  const skipped = nextDoseStatus(taken, key)
  expect(skipped).toEqual({ [key]: "skipped" })
  expect(nextDoseStatus(skipped, key)).toEqual({})
  // Keys are data, not object properties.
  expect(nextDoseStatus({}, "__proto__")).toEqual(
    JSON.parse('{"__proto__":"taken"}')
  )
})
