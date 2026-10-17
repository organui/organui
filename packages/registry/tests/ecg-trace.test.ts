import { expect, test } from "bun:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  EcgTrace,
  detectEcgWaves,
  ecgHeartRate,
  syntheticEcg,
  syntheticEcgStream,
  syntheticEcgValue,
} from "../registry/base-nova/ecg-trace/ecg-trace.js"

test("the synthetic rhythm peaks at R and starts its first beat at 0.3 s", () => {
  const samples = syntheticEcg({ duration: 2 })
  expect(samples).toHaveLength(500)
  expect(syntheticEcgValue(0.3)).toBeGreaterThan(1)
  const r = samples.indexOf(Math.max(...samples.slice(0, 200)))
  expect(r).toBe(75)
})

test("detection labels each beat in P, QRS, T order at the right rate", () => {
  for (const heartRate of [50, 72, 120]) {
    const annotations = detectEcgWaves(syntheticEcg({ heartRate }), 250)
    const beats = annotations.filter(({ wave }) => wave === "QRS")
    expect(beats.length).toBe(Math.floor((10 - 0.3) / (60 / heartRate)) + 1)
    expect(ecgHeartRate(annotations)).toBe(heartRate)
    const first = annotations.slice(0, 3).map(({ wave }) => wave)
    expect(first).toEqual(["P", "QRS", "T"])
    for (let i = 1; i < annotations.length; i++)
      expect(annotations[i]!.time).toBeGreaterThan(annotations[i - 1]!.time)
  }
  const [p, qrs, t] = detectEcgWaves(syntheticEcg(), 250)
  expect(qrs!.time).toBeCloseTo(0.3, 2)
  expect(qrs!.time - p!.time).toBeCloseTo(0.16, 1)
  expect(t!.time - qrs!.time).toBeGreaterThan(0.2)
})

test("flat or cut-off signals produce no labels or rate", () => {
  expect(detectEcgWaves(new Array(2500).fill(0), 250)).toEqual([])
  expect(ecgHeartRate([])).toBeNull()
  // A complex at the very end has no T wave to label yet.
  const cut = syntheticEcg({ duration: 0.45 })
  expect(detectEcgWaves(cut, 250).map(({ wave }) => wave)).toEqual(["P", "QRS"])
})

test("the stream continues the same synthetic trace in chunks", async () => {
  const received: number[] = []
  const unsubscribe = syntheticEcgStream({ interval: 10 }).subscribe((chunk) =>
    received.push(...chunk)
  )
  await Bun.sleep(150)
  unsubscribe()
  const count = received.length
  expect(count).toBeGreaterThan(10)
  expect(received).toEqual(syntheticEcg({ duration: count / 250 }))
  await Bun.sleep(50)
  expect(received.length).toBe(count)
})

test("a recorded strip renders the grid, labels and its summary", () => {
  const html = renderToStaticMarkup(
    createElement(EcgTrace, { samples: syntheticEcg() })
  )
  expect(html).toContain('viewBox="0 0 260 35"')
  expect(html).toContain(
    'aria-label="ECG, lead II, 10 seconds at 25 mm/s and 10 mm/mV, about 72 beats per minute"'
  )
  expect(html.match(/>QRS</g)).toHaveLength(12)
  expect(html).toContain("Not for diagnostic use.")
  expect(html).not.toContain("Pause")
  const hidden = renderToStaticMarkup(
    createElement(EcgTrace, {
      samples: syntheticEcg(),
      annotations: false,
      calibration: false,
      gain: 20,
      speed: 50,
    })
  )
  expect(hidden).toContain('viewBox="0 0 500 70"')
  expect(hidden).not.toContain(">QRS<")
  const given = renderToStaticMarkup(
    createElement(EcgTrace, {
      samples: syntheticEcg(),
      annotations: [
        { wave: "QRS", time: 0.3 },
        { wave: "QRS", time: 1.3 },
      ],
    })
  )
  expect(given.match(/>QRS</g)).toHaveLength(2)
  expect(given).toContain("about 60 beats per minute")
})

test("a stream renders an empty live strip with a pause control", () => {
  const html = renderToStaticMarkup(
    createElement(EcgTrace, { stream: syntheticEcgStream() })
  )
  expect(html).toContain('viewBox="0 0 160 35"')
  expect(html).toContain("heart rate not measured, live")
  expect(html).toContain("Pause")
})
