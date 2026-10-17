import { expect, test } from "bun:test"
import {
  ageInMonths,
  formatPercentile,
  growthLms,
  growthValueAt,
  growthZScore,
  percentileToZ,
  zToPercentile,
} from "../registry/base-nova/growth-chart/growth-chart"
import { growthStandards } from "../registry/base-nova/growth-chart/growth-standards"

test("tables cover every month of the standards", () => {
  for (const sex of ["female", "male"] as const) {
    expect(growthStandards.weight[sex].lms).toHaveLength(61)
    expect(growthStandards.head[sex].lms).toHaveLength(61)
    expect(growthStandards.length[sex].lms).toHaveLength(25)
    expect(growthStandards.height[sex]).toMatchObject({ start: 24 })
    expect(growthStandards.height[sex].lms).toHaveLength(37)
  }
})

// Medians from WHO's published monthly LMS tables.
test.each([
  ["weight", "male", 0, 3.3464],
  ["weight", "male", 12, 9.6479],
  ["weight", "female", 60, 18.2193],
  ["length", "female", 23.99, 86.38],
  ["length", "male", 24, 87.1161],
  ["length", "male", 60, 109.9638],
  ["head", "male", 0, 34.4618],
] as const)("%s, %s, %d months: median %d", (measure, sex, age, median) => {
  expect(growthLms(measure, sex, age)![1]).toBeCloseTo(median, 1)
  expect(growthValueAt(measure, sex, age, 50)!).toBeCloseTo(median, 1)
})

test("length steps down to height at 24 months", () => {
  const length = growthStandards.length.female.lms.at(-1)![1]
  const height = growthStandards.height.female.lms[0]![1]
  expect(length).toBeCloseTo(86.4153, 2)
  expect(height).toBeCloseTo(85.7153, 2)
})

test("percentiles and z-scores convert both ways", () => {
  expect(zToPercentile(0)).toBeCloseTo(50, 6)
  expect(zToPercentile(1.959964)).toBeCloseTo(97.5, 4)
  expect(percentileToZ(97)).toBeCloseTo(1.8808, 3)
  expect(percentileToZ(3)).toBeCloseTo(-1.8808, 3)
  for (const percentile of [3, 15, 50, 85, 97]) {
    const value = growthValueAt("weight", "female", 9, percentile)!
    const z = growthZScore("weight", "female", 9, value)!
    expect(zToPercentile(z)).toBeCloseTo(percentile, 4)
  }
})

test("weight beyond 3 SD uses WHO's restricted extrapolation", () => {
  const [l, m, s] = growthLms("weight", "male", 12)!
  const at = (z: number) => m * (1 + l * s * z) ** (1 / l)
  expect(growthZScore("weight", "male", 12, at(3))).toBeCloseTo(3, 6)
  // Each SD past 3 is as wide as the step from 2 to 3 SD.
  expect(
    growthZScore("weight", "male", 12, at(3) + (at(3) - at(2)))
  ).toBeCloseTo(4, 6)
  expect(
    growthZScore("weight", "male", 12, at(-3) - (at(-2) - at(-3)))
  ).toBeCloseTo(-4, 6)
})

test("out of range ages and values have no score", () => {
  expect(growthLms("weight", "male", -1)).toBeNull()
  expect(growthLms("weight", "male", 61)).toBeNull()
  expect(growthLms("weight", "male", Number.NaN)).toBeNull()
  expect(growthZScore("head", "female", 6, 0)).toBeNull()
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
