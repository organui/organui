"use client"
import { useMemo } from "react"
import { EcgTrace, syntheticEcgStream } from "@workspace/registry/ecg-trace"

export function Example() {
  const stream = useMemo(() => syntheticEcgStream(), [])
  return (
    <div className="flex w-full flex-col gap-3">
      <EcgTrace stream={stream} />
      <p className="text-xs text-muted-foreground">
        Original synthetic sinus rhythm generated in the browser. No patient
        data or clinical validation.
      </p>
    </div>
  )
}
