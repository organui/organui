"use client"
import { EcgTrace, syntheticEcg } from "@workspace/registry/ecg-trace"

// A synthetic rhythm at 72 bpm, on paper at 50 mm/s and 20 mm/mV.
const samples = syntheticEcg({ heartRate: 72, duration: 3 })

export function Example() {
  return (
    <EcgTrace
      samples={samples}
      label="Sinus rhythm at 50 mm/s"
      speed={50}
      gain={20}
    />
  )
}
