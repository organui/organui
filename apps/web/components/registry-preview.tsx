"use client"

import { useState, type ComponentType } from "react"
import { anatomyExampleData as data } from "@/lib/examples"
import { AnatomyTree } from "@workspace/registry/anatomy-tree"
import { GrowthChart } from "@workspace/registry/growth-chart"
import { OrganPreview } from "@/components/organ-preview"

function AnatomyTreePreview() {
  const [selectedId, setSelectedId] = useState<string | null>("lv")
  const [visibility, setVisibility] = useState<Record<string, boolean>>({})
  return (
    <AnatomyTree
      data={data}
      selectedId={selectedId}
      onSelectionChange={setSelectedId}
      visibility={visibility}
      onVisibilityChange={setVisibility}
      defaultExpandedIds={["heart", "left", "right"]}
      className="mx-auto max-w-md"
    />
  )
}

function OrganViewerPreview() {
  return <OrganPreview name="heart" organ="Heart" />
}

function GrowthChartPreview() {
  return (
    <GrowthChart
      measure="weight"
      sex="female"
      measurements={[
        { ageMonths: 0, value: 3.2 },
        { ageMonths: 4, value: 6.3 },
        { ageMonths: 9, value: 8.0 },
        { ageMonths: 15, value: 9.5 },
        { ageMonths: 24, value: 11.3 },
      ]}
      className="mx-auto max-w-2xl"
    />
  )
}

// Live previews on the registry index, keyed by registry item name. The
// browser suite requires one for every catalog item.
const previews: Record<string, ComponentType> = {
  "anatomy-tree": AnatomyTreePreview,
  "growth-chart": GrowthChartPreview,
  "organ-viewer": OrganViewerPreview,
}

export function RegistryPreview({
  name,
  title,
  organ,
}: {
  name: string
  title: string
  organ: boolean
}) {
  const Preview = previews[name]
  if (!organ && !Preview) return null
  return (
    <div
      role="region"
      aria-label={`${title} preview`}
      className="rounded-lg border bg-muted/30 p-4"
    >
      {organ ? (
        <OrganPreview name={name} organ={title} />
      ) : (
        Preview && <Preview />
      )}
    </div>
  )
}
