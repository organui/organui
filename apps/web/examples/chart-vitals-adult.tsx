import { VitalSigns } from "@workspace/registry/vital-signs"

// Original example readings, flagged against common adult ranges.
export function Example() {
  return (
    <VitalSigns
      readings={{
        heartRate: 104,
        systolic: 142,
        diastolic: 88,
        spo2: 93,
        temperature: 37.9,
      }}
      description="Example readings"
    />
  )
}
