"use client"
import { EcgTrace, syntheticEcg } from "@workspace/registry/ecg-trace"

// A synthetic rhythm at 46 bpm, below 60.
const samples = syntheticEcg({ heartRate: 46, duration: 6 })

export function Example() {
  return <EcgTrace samples={samples} label="Sinus bradycardia, 46 bpm" />
}
