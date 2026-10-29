"use client"
import { EcgTrace, syntheticEcg } from "@workspace/registry/ecg-trace"

// A recording is drawn once, with no sweep and no Pause.
const recording = syntheticEcg({ duration: 6 })

export function Example() {
  return <EcgTrace samples={recording} label="Recorded ECG" />
}
