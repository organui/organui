import { expect, test } from "bun:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  ageInMonths,
  formatPercentile,
  GrowthChart,
  growthLms,
  growthStandardsFromAnthro,
  growthValueAt,
  growthZScore,
  percentileToZ,
  zToPercentile,
  type GrowthStandards,
} from "../registry/base-nova/growth-chart/growth-chart.js"

// Made-up tables in WHO's anthro layout: one row per sex and day, with medians
// that rise linearly so sampled months are easy to check. No WHO data.
function anthro(median: (day: number) => number, l = 1, loh = false) {
  const lines = [`sex\tage\tl\tm\ts${loh ? "\tloh" : ""}`]
  for (const sex of [1, 2])
    for (let day = 0; day <= 1856; day++) {
      const row: (number | string)[] = [
        sex,
        day,
        l,
        median(day) + (sex === 2 ? -1 : 0),
        0.1,
      ]
      if (loh) row.push(day < 731 ? "L" : "H")
      lines.push(row.join("\t"))
    }
  return lines.join("\r\n")
}
const standards = growthStandardsFromAnthro({
  weight: anthro((day) => 3 + day / 100, 0.2),
  length: anthro((day) => 50 + day / 30 - (day < 731 ? 0 : 0.7), 1, true),
  head: anthro((day) => 34 + day / 200),
})

test("anthro tables are sampled by month, splitting length and height", () => {
  for (const sex of ["female", "male"] as const) {
    expect(standards.weight![sex].lms).toHaveLength(61)
    expect(standards.head![sex].lms).toHaveLength(61)
    expect(standards.length![sex]).toMatchObject({ start: 0 })
    expect(standards.length![sex].lms).toHaveLength(25)
    expect(standards.height![sex]).toMatchObject({ start: 24 })
    expect(standards.height![sex].lms).toHaveLength(37)
  }
  // One month is 30.4375 days, so month 12 falls at day 365.25.
  expect(standards.weight!.male.lms[12]![1]).toBeCloseTo(3 + 365.25 / 100, 6)
  expect(standards.weight!.female.lms[12]![1]).toBeCloseTo(2 + 365.25 / 100, 6)
  // Month 24 is half a day past the last length row and before the first
  // height row; each is extrapolated from its own segment.
  expect(standards.length!.male.lms[24]![1]).toBeCloseTo(50 + 730.5 / 30, 6)
  expect(standards.height!.male.lms[0]![1]).toBeCloseTo(
    50 + 730.5 / 30 - 0.7,
    6
  )
})

test("length uses the length table before 24 months and height from 24", () => {
  expect(growthLms(standards, "length", "male", 23.99)![1]).toBeCloseTo(
    50 + (23.99 * 30.4375) / 30,
    3
  )
  expect(growthLms(standards, "length", "male", 24)![1]).toBeCloseTo(
    50 + 730.5 / 30 - 0.7,
    6
  )
})

test("percentiles and z-scores convert both ways", () => {
  expect(zToPercentile(0)).toBeCloseTo(50, 6)
  expect(zToPercentile(1.959964)).toBeCloseTo(97.5, 4)
  expect(percentileToZ(97)).toBeCloseTo(1.8808, 3)
  expect(percentileToZ(3)).toBeCloseTo(-1.8808, 3)
  const median = growthLms(standards, "head", "female", 6)![1]
  expect(growthZScore(standards, "head", "female", 6, median)).toBeCloseTo(0, 9)
  // With L = 1, one SD is M × S.
  expect(
    growthZScore(standards, "head", "female", 6, median * 1.1)
  ).toBeCloseTo(1, 9)
  for (const percentile of [3, 15, 50, 85, 97]) {
    const value = growthValueAt(standards, "weight", "female", 9, percentile)!
    const z = growthZScore(standards, "weight", "female", 9, value)!
    expect(zToPercentile(z)).toBeCloseTo(percentile, 4)
  }
})

test("weight beyond 3 SD uses WHO's restricted extrapolation", () => {
  const [l, m, s] = growthLms(standards, "weight", "male", 12)!
  const at = (z: number) => m * (1 + l * s * z) ** (1 / l)
  const z = (value: number) =>
    growthZScore(standards, "weight", "male", 12, value)
  expect(z(at(3))).toBeCloseTo(3, 6)
  // Each SD past 3 is as wide as the step from 2 to 3 SD.
  expect(z(at(3) + (at(3) - at(2)))).toBeCloseTo(4, 6)
  expect(z(at(-3) - (at(-2) - at(-3)))).toBeCloseTo(-4, 6)
})

test("ages, values and measures the standards do not cover have no score", () => {
  expect(growthLms(standards, "weight", "male", -1)).toBeNull()
  expect(growthLms(standards, "weight", "male", 61)).toBeNull()
  expect(growthLms(standards, "weight", "male", Number.NaN)).toBeNull()
  expect(growthZScore(standards, "head", "female", 6, 0)).toBeNull()
  expect(growthLms({}, "weight", "male", 6)).toBeNull()
  // Without a height table, length carries on past 24 months while it lasts.
  const lengthOnly: GrowthStandards = { length: standards.length }
  expect(growthLms(lengthOnly, "length", "male", 24)).not.toBeNull()
  expect(growthLms(lengthOnly, "length", "male", 25)).toBeNull()
})

test("formats percentiles and ages", () => {
  expect(formatPercentile(50)).toBe("50th")
  expect(formatPercentile(1)).toBe("1st")
  expect(formatPercentile(22.4)).toBe("22nd")
  expect(formatPercentile(13)).toBe("13th")
  expect(formatPercentile(0.04)).toBe("<0.1st")
  expect(formatPercentile(99.95)).toBe(">99.9th")
  expect(formatPercentile(0.5)).toBe("0.5th")
  expect(
    ageInMonths(new Date("2024-01-01"), new Date("2025-01-01"))
  ).toBeCloseTo(12.02, 2)
})

test("the chart plots measurements, or says when no standard covers them", () => {
  const html = renderToStaticMarkup(
    createElement(GrowthChart, {
      standards,
      measure: "weight",
      sex: "female",
      measurements: [
        { ageMonths: 6, value: 4.8 },
        { ageMonths: 30, value: 9 },
      ],
    })
  )
  expect(html).toContain("Weight-for-age, girls")
  // The 30-month point is outside the default 0 to 24 month range.
  expect(html.match(/role="img"/g)).toHaveLength(1)
  expect(html).toContain('aria-label="6 months: 4.8 kg, ')
  const empty = renderToStaticMarkup(
    createElement(GrowthChart, { standards: {}, measure: "head", sex: "male" })
  )
  expect(empty).toContain("No growth standard covers this measure")
})
