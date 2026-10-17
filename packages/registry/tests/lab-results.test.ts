import { expect, test } from "bun:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  describeTrend,
  formatReferenceRange,
  labFlag,
  LabResultsTable,
  type LabResult,
} from "../registry/base-nova/lab-results/lab-results"

const range = { low: 70, high: 99, criticalLow: 40, criticalHigh: 400 }

test("values are flagged against inclusive limits and critical limits first", () => {
  expect(labFlag(70, range)).toBe("normal")
  expect(labFlag(99, range)).toBe("normal")
  expect(labFlag(69.9, range)).toBe("low")
  expect(labFlag(100, range)).toBe("high")
  expect(labFlag(39, range)).toBe("critical-low")
  expect(labFlag(401, range)).toBe("critical-high")
  expect(labFlag(150, { high: 200 })).toBe("normal")
  expect(labFlag(35, { low: 40 })).toBe("low")
})

test("text values and missing ranges are not flagged", () => {
  expect(labFlag("Negative", range)).toBe("unflagged")
  expect(labFlag(5)).toBe("unflagged")
  expect(labFlag(Number.NaN, range)).toBe("unflagged")
})

test("ranges print like a report", () => {
  expect(formatReferenceRange({ low: 70, high: 99 })).toBe("70–99")
  expect(formatReferenceRange({ high: 200 })).toBe("≤ 200")
  expect(formatReferenceRange({ low: 40 })).toBe("≥ 40")
  expect(formatReferenceRange({ low: 4, high: 5.6 }, 1)).toBe("4.0–5.6")
  expect(formatReferenceRange({ text: "Negative", low: 1 })).toBe("Negative")
  expect(formatReferenceRange({})).toBeNull()
  expect(formatReferenceRange(undefined)).toBeNull()
})

const glucose: LabResult = {
  id: "glucose",
  name: "Glucose",
  value: 118,
  unit: "mg/dL",
  date: "2026-10-01",
  referenceRange: range,
  history: [
    { value: 118, date: "2026-10-01" },
    { value: 92, date: "2026-01-03" },
    { value: 104, date: "2026-05-12" },
  ],
}

test("the trend is described in date order", () => {
  expect(describeTrend(glucose)).toBe(
    "Glucose trend, 3 results from Jan 3, 2026 to Oct 1, 2026: 92 to 118 mg/dL, rising"
  )
  expect(describeTrend({ ...glucose, history: [] })).toBeNull()
})

test("flags render as text with an icon, and a lab flag overrides", () => {
  const html = renderToStaticMarkup(
    createElement(LabResultsTable, {
      caption: "Results",
      results: [
        glucose,
        {
          id: "k",
          name: "Potassium",
          value: 6.9,
          unit: "mmol/L",
          referenceRange: { low: 3.5, high: 5.1, criticalHigh: 6.0 },
        },
        {
          id: "hcg",
          name: "hCG",
          value: "Positive",
          flag: "abnormal",
          referenceRange: { text: "Negative" },
        },
      ],
    })
  )
  expect(html).toContain("<caption")
  expect(html).toMatch(
    /data-flag="high"[^>]*><svg aria-hidden="true"[\s\S]*?<\/svg>High<\/span>/
  )
  expect(html).toContain(">Critical high</span>")
  expect(html).toContain(">Abnormal</span>")
  expect(html).toContain("Range: Negative<")
  expect(html).toContain("Range: 3.5–5.1 mmol/L<")
  expect(html).toContain('role="img" aria-label="Glucose trend, 3 results')
  expect(html).toContain("No earlier results")
})
