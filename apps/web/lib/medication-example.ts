import type {
  Medication,
  MedicationInteraction,
} from "@workspace/registry/medication-schedule"

// Illustrative demo data for the docs page and the index preview. It is not
// a treatment plan or a complete interaction list.
export const exampleDate = "2026-10-19"

export const exampleMedications: Medication[] = [
  {
    id: "levothyroxine",
    name: "Levothyroxine",
    dose: "75 mcg",
    instructions: "On an empty stomach",
    times: ["07:00"],
    color: "oklch(0.62 0.15 250)",
  },
  {
    id: "calcium",
    name: "Calcium carbonate",
    dose: "500 mg",
    instructions: "With meals",
    times: ["08:30", "19:00"],
    color: "oklch(0.7 0.14 75)",
  },
  {
    id: "metformin",
    name: "Metformin",
    dose: "500 mg",
    instructions: "With breakfast and dinner",
    times: ["08:30", "19:00"],
    color: "oklch(0.62 0.13 160)",
  },
  {
    id: "warfarin",
    name: "Warfarin",
    dose: "5 mg",
    times: ["18:00"],
    color: "oklch(0.6 0.18 25)",
  },
  {
    id: "ibuprofen",
    name: "Ibuprofen",
    dose: "200 mg",
    instructions: "Mondays and Thursdays, for 2 weeks",
    times: ["12:00"],
    days: [1, 4],
    start: "2026-10-19",
    end: "2026-11-01",
    color: "oklch(0.6 0.14 310)",
  },
]

export const exampleInteractions: MedicationInteraction[] = [
  {
    id: "warfarin-ibuprofen",
    medicationIds: ["warfarin", "ibuprofen"],
    severity: "major",
    summary: "Taken together, these can raise the risk of bleeding.",
  },
  {
    id: "levothyroxine-calcium",
    medicationIds: ["levothyroxine", "calcium"],
    severity: "moderate",
    summary: "Calcium can reduce how much levothyroxine is absorbed.",
    separationHours: 4,
  },
]
