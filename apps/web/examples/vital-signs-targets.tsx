import { VitalSigns } from "@workspace/registry/vital-signs"

// Ranges merge over the adult defaults, such as a target SpO2 of 88–92%.
export function Example() {
  return (
    <VitalSigns
      title="COPD targets"
      description="SpO₂ target 88–92%"
      ranges={{ spo2: { low: 88, high: 92 } }}
      readings={{
        heartRate: 88,
        systolic: 128,
        diastolic: 80,
        spo2: 95,
        temperature: 36.9,
      }}
    />
  )
}
