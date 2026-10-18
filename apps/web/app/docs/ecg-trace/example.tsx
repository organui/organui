"use client"
import { useMemo, useState } from "react"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"
import {
  EcgTrace,
  syntheticEcg,
  syntheticEcgStream,
} from "@workspace/registry/ecg-trace"

const rates = [
  { label: "Slow", heartRate: 50 },
  { label: "Normal", heartRate: 72 },
  { label: "Fast", heartRate: 110 },
]
const recording = syntheticEcg({ duration: 6 })

export function Example() {
  const [heartRate, setHeartRate] = useState(72)
  const stream = useMemo(() => syntheticEcgStream({ heartRate }), [heartRate])
  return (
    <div className="flex flex-col gap-6 rounded-xl border p-5">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-medium">Live monitor</h2>
          <ToggleGroup
            aria-label="Synthetic heart rate"
            variant="outline"
            size="sm"
            spacing={2}
            value={[String(heartRate)]}
            onValueChange={(values) => {
              if (values[0] !== undefined) setHeartRate(Number(values[0]))
            }}
          >
            {rates.map((rate) => (
              <ToggleGroupItem
                key={rate.heartRate}
                value={String(rate.heartRate)}
              >
                {rate.label} {rate.heartRate}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <EcgTrace stream={stream} label="Live ECG" />
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="font-medium">Recorded strip</h2>
        <EcgTrace samples={recording} label="Recorded ECG" />
      </div>
      <p className="text-xs text-muted-foreground">
        Original synthetic sinus rhythm generated in the browser. No patient
        data or clinical validation.
      </p>
    </div>
  )
}
