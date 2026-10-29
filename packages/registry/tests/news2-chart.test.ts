import { expect, test } from "bun:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  News2Chart,
  news2Score,
  type News2Observation,
} from "../registry/base-nova/news2-chart/news2-chart"

const normal = {
  respirationRate: 16,
  spo2: 97,
  onOxygen: false,
  systolic: 125,
  pulse: 72,
  consciousness: "alert",
  temperature: 36.8,
} as const

// Points for one parameter changed from an otherwise normal set.
const points = (change: Partial<typeof normal> | Record<string, unknown>) =>
  news2Score({ ...normal, ...change })

test("a normal set scores 0, low risk", () => {
  expect(news2Score(normal)).toMatchObject({ total: 0, risk: "low" })
})

test("respiration rate bands", () => {
  for (const [value, score] of <[number, number][]>[
    [8, 3],
    [9, 1],
    [11, 1],
    [12, 0],
    [20, 0],
    [21, 2],
    [24, 2],
    [25, 3],
  ])
    expect(points({ respirationRate: value }).points.respirationRate).toBe(
      score
    )
})

test("SpO2 scale 1 bands", () => {
  for (const [value, score] of <[number, number][]>[
    [91, 3],
    [92, 2],
    [93, 2],
    [94, 1],
    [95, 1],
    [96, 0],
  ])
    expect(points({ spo2: value }).points.spo2).toBe(score)
})

test("SpO2 scale 2 scores below target, and above it only on oxygen", () => {
  const scale2 = (spo2: number, onOxygen: boolean) =>
    news2Score({ ...normal, spo2, onOxygen }, 2).points.spo2
  for (const [value, score] of <[number, number][]>[
    [83, 3],
    [84, 2],
    [85, 2],
    [86, 1],
    [87, 1],
    [88, 0],
    [92, 0],
  ]) {
    expect(scale2(value, false)).toBe(score)
    expect(scale2(value, true)).toBe(score)
  }
  expect(scale2(93, false)).toBe(0)
  expect(scale2(99, false)).toBe(0)
  expect(scale2(93, true)).toBe(1)
  expect(scale2(94, true)).toBe(1)
  expect(scale2(95, true)).toBe(2)
  expect(scale2(96, true)).toBe(2)
  expect(scale2(97, true)).toBe(3)
})

test("oxygen, blood pressure, pulse, consciousness and temperature bands", () => {
  expect(points({ onOxygen: true }).points.onOxygen).toBe(2)
  for (const [value, score] of <[number, number][]>[
    [90, 3],
    [91, 2],
    [100, 2],
    [101, 1],
    [110, 1],
    [111, 0],
    [219, 0],
    [220, 3],
  ])
    expect(points({ systolic: value }).points.systolic).toBe(score)
  for (const [value, score] of <[number, number][]>[
    [40, 3],
    [41, 1],
    [50, 1],
    [51, 0],
    [90, 0],
    [91, 1],
    [110, 1],
    [111, 2],
    [130, 2],
    [131, 3],
  ])
    expect(points({ pulse: value }).points.pulse).toBe(score)
  expect(points({ consciousness: "confusion" }).points.consciousness).toBe(3)
  expect(points({ consciousness: "unresponsive" }).points.consciousness).toBe(3)
  for (const [value, score] of <[number, number][]>[
    [35, 3],
    [35.1, 1],
    [36, 1],
    [36.1, 0],
    [38, 0],
    [38.1, 1],
    [39, 1],
    [39.1, 2],
  ])
    expect(points({ temperature: value }).points.temperature).toBe(score)
})

test("risk follows the aggregate, and a single 3 raises it to low–medium", () => {
  expect(points({ respirationRate: 21, pulse: 95 })).toMatchObject({
    total: 3,
    risk: "low",
  })
  expect(points({ consciousness: "confusion" })).toMatchObject({
    total: 3,
    risk: "low-medium",
  })
  expect(
    points({ respirationRate: 22, onOxygen: true, pulse: 95 })
  ).toMatchObject({
    total: 5,
    risk: "medium",
  })
  expect(
    points({ respirationRate: 26, onOxygen: true, systolic: 105, pulse: 115 })
  ).toMatchObject({ total: 8, risk: "high" })
})

test("a missing parameter leaves the score incomplete", () => {
  const { temperature: _, ...partial } = normal
  expect(news2Score(partial)).toMatchObject({ total: null, risk: null })
  expect(news2Score(partial).points.temperature).toBeNull()
})

const observations: News2Observation[] = [
  {
    time: "2026-10-25T14:00:00Z",
    ...normal,
    respirationRate: 26,
    onOxygen: true,
    systolic: 105,
    pulse: 115,
  },
  { time: "2026-10-25T08:00:00Z", ...normal },
  { time: "2026-10-25T10:00:00Z", ...normal, temperature: undefined },
]

test("the chart runs newest first and summarises the latest set", () => {
  const html = renderToStaticMarkup(createElement(News2Chart, { observations }))
  const head = html.slice(html.indexOf("<thead"), html.indexOf("</thead>"))
  expect(head.indexOf("14:00")).toBeLessThan(head.indexOf("08:00"))
  // The day shows once, above its first column, and is read out on the rest.
  expect(head.match(/Oct 25/g)).toHaveLength(3)
  expect(head.match(/sr-only">Oct 25/g)).toHaveLength(2)
  expect(html).toContain(
    'aria-label="NEWS2 observations, Oct 25, 08:00 to Oct 25, 14:00"'
  )
  expect(html).toContain('data-risk="high"')
  expect(html).toContain("NEWS2 8 · High risk")
  expect(html).toContain("Monitoring: continuous.")
  expect(html).toContain("Incomplete")
  expect(html).toContain(", scores ")
})

test("a score of 0 asks only for routine monitoring", () => {
  const html = renderToStaticMarkup(
    createElement(News2Chart, { observations: [observations[1]!] })
  )
  expect(html).toContain("NEWS2 0 · Low risk")
  expect(html).toContain("Continue routine care.")
  expect(html).toContain("at least every 12 hours")
})
