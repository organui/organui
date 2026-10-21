import { VitalSigns } from "@workspace/registry/vital-signs"

// Fahrenheit, a chosen set of vitals, and a target SpO2 range of 88–92%.
export function Example() {
  return (
    <VitalSigns
      title="COPD target ranges"
      temperatureUnit="fahrenheit"
      vitals={["spo2", "respiratoryRate", "temperature"]}
      ranges={{ spo2: { low: 88, high: 92 } }}
      readings={{ spo2: 90, respiratoryRate: 22, temperature: 99.1 }}
    />
  )
}
