"use client"

import { useState } from "react"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"
import { brainModel } from "@workspace/registry/brain"
import { heartModel } from "@workspace/registry/heart"
import { kidneysModel } from "@workspace/registry/kidneys"
import { lungsModel } from "@workspace/registry/lungs"
import { OrganViewer } from "@workspace/registry/organ-viewer"

// One viewer, any model: each organ is a GLB and a list of its structures.
const models = [heartModel, brainModel, lungsModel, kidneysModel]

export function Example() {
  const [name, setName] = useState(models[0]!.name)
  const model = models.find((model) => model.name === name)!
  return (
    <div className="flex flex-col gap-3">
      <ToggleGroup
        aria-label="Model"
        variant="outline"
        size="sm"
        spacing={2}
        value={[name]}
        onValueChange={(values) => {
          if (values[0]) setName(values[0])
        }}
      >
        {models.map(({ name }) => (
          <ToggleGroupItem key={name} value={name}>
            {name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <OrganViewer
        // A new model is a new file to load.
        key={model.name}
        model={model}
        label={`${model.name} in the organ viewer`}
      />
    </div>
  )
}
