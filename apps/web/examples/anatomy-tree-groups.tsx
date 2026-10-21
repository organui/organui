"use client"
import { useState } from "react"
import { AnatomyTree, type AnatomyNode } from "@workspace/registry/anatomy-tree"

// Groupings that aren't one structure open instead of selecting, and each
// structure shows its colour in the viewer.
const data: AnatomyNode[] = [
  {
    id: "chambers",
    label: "Chambers",
    selectable: false,
    children: [
      { id: "la", label: "Left atrium", color: "#b77c76" },
      { id: "lv", label: "Left ventricle", color: "#ab6159" },
      { id: "ra", label: "Right atrium", color: "#a96d70" },
      { id: "rv", label: "Right ventricle", color: "#b86661" },
    ],
  },
  {
    id: "vessels",
    label: "Great vessels",
    selectable: false,
    children: [
      { id: "aorta", label: "Aorta", color: "#c9706a" },
      { id: "pulmonary", label: "Pulmonary trunk", color: "#7d93b8" },
    ],
  },
]

export function Example() {
  const [selectedId, setSelectedId] = useState<string | null>("lv")
  const [visibility, setVisibility] = useState<Record<string, boolean>>({})
  return (
    <AnatomyTree
      data={data}
      selectedId={selectedId}
      onSelectionChange={setSelectedId}
      visibility={visibility}
      onVisibilityChange={setVisibility}
      defaultExpandedIds={["chambers", "vessels"]}
      label="Heart structures"
      className="w-full max-w-sm"
    />
  )
}
