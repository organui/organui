import { News2Chart } from "@workspace/registry/news2-chart"

// A fictional patient with COPD and a prescribed target of 88–92%.
export function Example() {
  return (
    <News2Chart
      spo2Scale={2}
      observations={[
        {
          time: "2026-10-25T02:00:00Z",
          respirationRate: 20,
          spo2: 90,
          onOxygen: true,
          systolic: 132,
          pulse: 88,
          consciousness: "alert",
          temperature: 37.0,
        },
        {
          time: "2026-10-25T06:00:00Z",
          respirationRate: 21,
          spo2: 94,
          onOxygen: true,
          systolic: 128,
          pulse: 86,
          consciousness: "alert",
          temperature: 37.1,
        },
      ]}
      className="w-full"
    />
  )
}
