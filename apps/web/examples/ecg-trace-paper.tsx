"use client"
import { EcgTrace, syntheticEcg } from "@workspace/registry/ecg-trace"

const samples = syntheticEcg({ heartRate: 64, duration: 3 })

// Faster paper and more gain, without wave labels, for a closer look.
export function Example() {
  return (
    <EcgTrace
      samples={samples}
      speed={50}
      gain={20}
      annotations={false}
      label="ECG at 50 mm/s"
    />
  )
}
