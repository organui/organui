"use client"

import { useState } from "react"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"
import {
  AcuteAppendicitis,
  acuteAppendicitis,
} from "@workspace/registry/acute-appendicitis"
import { diseaseModel } from "@workspace/registry/disease-model"

const stages = acuteAppendicitis.stages ?? []

export function Example() {
  const [stage, setStage] = useState(stages[0]!.id)
  const [scale, setScale] = useState(acuteAppendicitis.scales[0]!.id)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = diseaseModel(
    acuteAppendicitis,
    scale,
    stage
  ).structures.find(({ id }) => id === selectedId)
  return (
    <div className="flex flex-col gap-3">
      {/* Your own control, such as a patient's timeline, drives the stage. */}
      <ToggleGroup
        aria-label="Patient timeline"
        variant="outline"
        size="sm"
        spacing={2}
        value={[stage]}
        onValueChange={(values) => {
          if (values[0]) setStage(values[0])
        }}
      >
        {stages.map(({ id, label }) => (
          <ToggleGroupItem key={id} value={id}>
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <AcuteAppendicitis
        label="Acute appendicitis controlled example"
        stage={stage}
        onStageChange={setStage}
        scale={scale}
        onScaleChange={setScale}
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
      />
      <p role="status" className="text-sm text-muted-foreground">
        {selected
          ? `${selected.label}: ${selected.group.toLowerCase()}`
          : "Select a structure in 3D or in the panel."}
      </p>
    </div>
  )
}
