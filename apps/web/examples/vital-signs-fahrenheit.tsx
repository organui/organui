import { VitalSigns } from "@workspace/registry/vital-signs"

// Fahrenheit, and only the vitals you choose, in your order.
export function Example() {
  return (
    <VitalSigns
      title="Triage"
      temperatureUnit="fahrenheit"
      vitals={["temperature", "heartRate", "respiratoryRate"]}
      readings={{ temperature: 100.9, heartRate: 104, respiratoryRate: 20 }}
    />
  )
}
