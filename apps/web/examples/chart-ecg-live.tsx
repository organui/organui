"use client"
import { useMemo } from "react"
import { EcgTrace, syntheticEcgStream } from "@workspace/registry/ecg-trace"

// A live synthetic stream; the trace sweeps as samples arrive.
export function Example() {
  const stream = useMemo(() => syntheticEcgStream({ heartRate: 84 }), [])
  return <EcgTrace stream={stream} duration={4} label="Live ECG, 84 bpm" />
}
