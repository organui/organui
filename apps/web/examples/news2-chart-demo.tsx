import {
  News2Chart,
  type News2Observation,
} from "@workspace/registry/news2-chart"

// A fictional patient developing a fever over an afternoon.
const observations: News2Observation[] = [
  {
    time: "2026-10-25T08:00:00Z",
    respirationRate: 16,
    spo2: 97,
    onOxygen: false,
    systolic: 128,
    pulse: 78,
    consciousness: "alert",
    temperature: 37.1,
  },
  {
    time: "2026-10-25T12:00:00Z",
    respirationRate: 18,
    spo2: 96,
    onOxygen: false,
    systolic: 122,
    pulse: 88,
    consciousness: "alert",
    temperature: 37.8,
  },
  {
    time: "2026-10-25T14:00:00Z",
    respirationRate: 20,
    spo2: 96,
    onOxygen: false,
    systolic: 118,
    pulse: 92,
    consciousness: "alert",
    temperature: 38.1,
  },
  {
    time: "2026-10-25T16:00:00Z",
    respirationRate: 23,
    spo2: 94,
    onOxygen: false,
    systolic: 106,
    pulse: 108,
    consciousness: "alert",
    temperature: 38.7,
  },
  {
    time: "2026-10-25T17:00:00Z",
    respirationRate: 24,
    spo2: 95,
    onOxygen: true,
    systolic: 104,
    pulse: 112,
    consciousness: "alert",
    temperature: 38.6,
  },
]

export function Example() {
  return (
    <div role="region" aria-label="NEWS2 chart example" className="w-full">
      <News2Chart
        observations={observations}
        caption="Fictional observations, not patient data"
      />
    </div>
  )
}
