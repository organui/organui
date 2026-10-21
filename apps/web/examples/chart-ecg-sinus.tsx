"use client"
import { EcgTrace, syntheticEcg } from "@workspace/registry/ecg-trace"

// A synthetic rhythm at 72 bpm.
const samples = syntheticEcg({ heartRate: 72, duration: 6 })

export function Example() {
  return <EcgTrace samples={samples} label="Sinus rhythm, 72 bpm" />
}
