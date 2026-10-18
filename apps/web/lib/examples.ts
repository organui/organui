import type { AnatomyNode } from "@workspace/registry/anatomy-tree"
import type { LabResult } from "@workspace/registry/lab-results"

// Original, simplified demo data shared by the docs page and the index preview.
export const anatomyExampleData: AnatomyNode[] = [
  {
    id: "heart",
    label: "Heart",
    children: [
      {
        id: "left",
        label: "Left heart",
        children: [
          { id: "la", label: "Left atrium" },
          { id: "lv", label: "Left ventricle" },
        ],
      },
      {
        id: "right",
        label: "Right heart",
        children: [
          { id: "ra", label: "Right atrium" },
          { id: "rv", label: "Right ventricle" },
        ],
      },
    ],
  },
]

// Illustrative values only: no patient data. Reference ranges vary by
// laboratory, so real ranges come from the reporting lab.
export const labResultsExampleData: LabResult[] = [
  {
    id: "glucose",
    name: "Glucose, fasting",
    value: 118,
    unit: "mg/dL",
    date: "2026-10-01",
    referenceRange: { low: 70, high: 99, criticalLow: 40, criticalHigh: 400 },
    history: [
      { value: 92, date: "2025-10-06" },
      { value: 97, date: "2026-01-12" },
      { value: 104, date: "2026-05-18" },
      { value: 118, date: "2026-10-01" },
    ],
  },
  {
    id: "hba1c",
    name: "Hemoglobin A1c",
    value: 6.1,
    unit: "%",
    decimals: 1,
    date: "2026-10-01",
    referenceRange: { low: 4, high: 5.6 },
    history: [
      { value: 5.4, date: "2025-10-06" },
      { value: 5.7, date: "2026-05-18" },
      { value: 6.1, date: "2026-10-01" },
    ],
  },
  {
    id: "sodium",
    name: "Sodium",
    value: 133,
    unit: "mmol/L",
    date: "2026-10-01",
    referenceRange: {
      low: 135,
      high: 145,
      criticalLow: 120,
      criticalHigh: 160,
    },
    history: [
      { value: 139, date: "2026-01-12" },
      { value: 136, date: "2026-05-18" },
      { value: 133, date: "2026-10-01" },
    ],
  },
  {
    id: "potassium",
    name: "Potassium",
    value: 6.4,
    unit: "mmol/L",
    decimals: 1,
    date: "2026-10-01",
    referenceRange: { low: 3.5, high: 5.1, criticalLow: 2.8, criticalHigh: 6 },
    history: [
      { value: 4.2, date: "2026-01-12" },
      { value: 4.8, date: "2026-05-18" },
      { value: 6.4, date: "2026-10-01" },
    ],
  },
  {
    id: "creatinine",
    name: "Creatinine",
    value: 0.9,
    unit: "mg/dL",
    decimals: 2,
    date: "2026-10-01",
    referenceRange: { low: 0.6, high: 1.2 },
    history: [
      { value: 0.88, date: "2026-01-12" },
      { value: 0.91, date: "2026-05-18" },
      { value: 0.9, date: "2026-10-01" },
    ],
  },
  {
    id: "hdl",
    name: "HDL cholesterol",
    value: 52,
    unit: "mg/dL",
    date: "2026-10-01",
    referenceRange: { low: 40 },
  },
  {
    id: "urine-protein",
    name: "Urine protein",
    value: "Negative",
    flag: "normal",
    date: "2026-10-01",
    referenceRange: { text: "Negative" },
  },
]
