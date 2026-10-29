"use client"
import { useMemo, useState } from "react"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"
import { EcgTrace, syntheticEcgStream } from "@workspace/registry/ecg-trace"

const rates = [
  { label: "Slow", heartRate: 50 },
  { label: "Normal", heartRate: 72 },
  { label: "Fast", heartRate: 110 },
]

// A new rate redraws the stream; the heart rate and labels follow it.
export function Example() {
  const [heartRate, setHeartRate] = useState(72)
  const stream = useMemo(() => syntheticEcgStream({ heartRate }), [heartRate])
  return (
    <div className="flex w-full flex-col gap-3">
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
          <ToggleGroupItem key={rate.heartRate} value={String(rate.heartRate)}>
            {rate.label} {rate.heartRate}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <EcgTrace stream={stream} label="Live ECG" />
    </div>
  )
}
