"use client"

import { dermatomeColor, dermatomes } from "@workspace/registry/dermatome-map"
import { ColorSwatch } from "@/components/color-swatch"

// The dermatome map's default fill for each region, at its first level.
// A client component: the map's helpers live in its client module.
export function DermatomeSwatches() {
  const regions = new Map(
    dermatomes.map((dermatome) => [
      dermatome.region,
      dermatomeColor(dermatome.id),
    ])
  )
  return [...regions].map(([region, color]) => (
    <ColorSwatch key={region} name={region} value={color} />
  ))
}
