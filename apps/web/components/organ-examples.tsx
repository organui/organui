"use client"

import { useState } from "react"
import { ComponentViewer } from "@/components/component-viewer"
import { OrganExplorer } from "@workspace/registry/blocks/explorer-01/components/organ-explorer"
import {
  OrganViewer,
  type OrganModel,
} from "@workspace/registry/organ-viewer/organ-viewer"

function InteractiveExample({ model }: { model: OrganModel }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = model.structures.find(({ id }) => id === selectedId)
  return (
    <div className="flex flex-col gap-3">
      <OrganViewer
        model={model}
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
        className="h-[28rem]"
      />
      <p role="status" className="text-sm text-muted-foreground">
        {selected ? `Selected: ${selected.label}` : "Select a structure in 3D."}
      </p>
    </div>
  )
}

// Organ-specific examples use the same documentation shell as other components.
export function OrganExamples({
  model,
  name,
}: {
  model: OrganModel
  name: string
}) {
  const words = name.split("-")
  const pascal = words.map((word) => word[0]!.toUpperCase() + word.slice(1))
  const component = pascal.join("")
  const modelExport = `${words[0]}${pascal.slice(1).join("")}Model`
  const basic = `import { ${component} } from "@/components/${name}"

export function BasicExample() {
  return <${component} controls={false} className="h-[28rem]" />
}`
  const interactive = `"use client"

import { useState } from "react"
import { ${component}, ${modelExport} } from "@/components/${name}"

export function InteractiveExample() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = ${modelExport}.structures.find(({ id }) => id === selectedId)
  return (
    <div className="flex flex-col gap-3">
      <${component}
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
        className="h-[28rem]"
      />
      <p role="status">
        {selected ? \`Selected: \${selected.label}\` : "Select a structure in 3D."}
      </p>
    </div>
  )
}`
  const anatomy = `// Also install the Explorer 01 composition:
// bunx shadcn@4.21.0 add @organui/explorer-01
import { OrganExplorer } from "@/components/organ-explorer"
import { ${modelExport} } from "@/components/${name}"

export function AnatomyExample() {
  return <OrganExplorer model={${modelExport}} />
}`

  return (
    <ComponentViewer
      title={model.name}
      examples={[
        {
          id: "basic",
          label: "Basic",
          description:
            "A 3D stage with camera interaction and model attribution.",
          preview: (
            <OrganViewer model={model} controls={false} className="h-[28rem]" />
          ),
          code: basic,
        },
        {
          id: "interactive",
          label: "Interactive",
          description:
            "Select structures and use the built-in view, zoom, and reset controls.",
          preview: <InteractiveExample model={model} />,
          code: interactive,
        },
        {
          id: "anatomy",
          label: "With Anatomy Panel",
          description:
            "The Explorer 01 composition adds a responsive anatomy panel with shared selection and visibility.",
          preview: <OrganExplorer model={model} />,
          code: anatomy,
        },
      ]}
    />
  )
}
