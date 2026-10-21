"use client"
import { useMemo } from "react"
import { EcgTrace, syntheticEcgStream } from "@workspace/registry/ecg-trace"

// A live stream sweeps like a monitor and always offers Pause.
export function Example() {
  const stream = useMemo(() => syntheticEcgStream({ heartRate: 84 }), [])
  return <EcgTrace stream={stream} duration={4} label="Bedside monitor" />
}
