"use client"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
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
          <div
            role="group"
            aria-label="Synthetic heart rate"
            className="flex gap-2"
          >
            {rates.map((rate) => (
              <Button
                key={rate.heartRate}
                variant={rate.heartRate === heartRate ? "secondary" : "outline"}
                size="sm"
                aria-pressed={rate.heartRate === heartRate}
                onClick={() => setHeartRate(rate.heartRate)}
              >
                {rate.label} {rate.heartRate}
              </Button>
            ))}
          </div>
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
