import { News2Chart } from "@workspace/registry/news2-chart"

export function Example() {
  return (
    <News2Chart
      observations={[
        {
          time: "2026-10-25T09:00:00Z",
          respirationRate: 14,
          spo2: 98,
          onOxygen: false,
          systolic: 136,
          pulse: 64,
          consciousness: "alert",
          temperature: 36.6,
        },
        {
          time: "2026-10-25T13:00:00Z",
          respirationRate: 15,
          spo2: 97,
          onOxygen: false,
          systolic: 131,
          pulse: 70,
          temperature: 36.9,
        },
      ]}
      className="w-full"
    />
  )
}
