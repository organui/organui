"use client"
import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { VitalSigns, type VitalReadings } from "@workspace/registry/vital-signs"

// Original example readings, not patient data.
const scenarios: { name: string; readings: VitalReadings }[] = [
  {
    name: "Resting",
    readings: {
      heartRate: 72,
      systolic: 118,
      diastolic: 76,
      spo2: 98,
      temperature: 36.8,
    },
  },
  {
    name: "Fever",
    readings: {
      heartRate: 112,
      systolic: 116,
      diastolic: 74,
      spo2: 96,
      temperature: 38.6,
    },
  },
  {
    name: "Low oxygen",
    readings: {
      heartRate: 104,
      systolic: 122,
      diastolic: 78,
      spo2: 89,
      temperature: 37,
    },
  },
  {
    name: "Hypertension",
    readings: {
      heartRate: 84,
      systolic: 158,
      diastolic: 78,
      spo2: 97,
      temperature: 36.7,
    },
  },
  {
    name: "No reading",
    readings: {
      heartRate: 66,
      systolic: 112,
      diastolic: 70,
      spo2: null,
      temperature: 36.4,
    },
  },
]

export function Example() {
  const [scenario, setScenario] = useState(scenarios[0]!)
  return (
    <div className="flex flex-col gap-4">
      <div
        role="group"
        aria-label="Example readings"
        className="flex flex-wrap gap-2"
      >
        {scenarios.map((entry) => (
          <Button
            key={entry.name}
            variant={entry === scenario ? "default" : "outline"}
            size="sm"
            aria-pressed={entry === scenario}
            onClick={() => setScenario(entry)}
          >
            {entry.name}
          </Button>
        ))}
      </div>
      <VitalSigns
        readings={scenario.readings}
        description={`${scenario.name} example`}
      />
      <p className="text-xs text-muted-foreground">
        Original example readings and common adult ranges. Not patient data or
        clinical guidance.
      </p>
    </div>
  )
}
