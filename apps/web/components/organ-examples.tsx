"use client"

import { useState } from "react"
import { ComponentViewer } from "@/components/component-viewer"
import { OrganExplorer } from "@workspace/registry/blocks/explorer-01/components/organ-explorer"
import {
  OrganViewer,
  type OrganModel,
} from "@workspace/registry/organ-viewer/organ-viewer"

function ControlledExample({ model }: { model: OrganModel }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = model.structures.find(({ id }) => id === selectedId)
  return (
    <div className="flex flex-col gap-3">
      <OrganViewer
        model={model}
        label={`${model.name} controlled selection example`}
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

type OrganExampleProps = { model: OrganModel; name: string; viewer?: boolean }

// Each recipe has a stable registry-style name and its own preview/source pair.
function organExamples({ model, name, viewer = false }: OrganExampleProps) {
  const exampleName = viewer ? "organ-viewer" : name
  const words = name.split("-")
  const pascal = words.map((word) => word[0]!.toUpperCase() + word.slice(1))
  const component = pascal.join("")
  const modelExport = `${words[0]}${pascal.slice(1).join("")}Model`
  const tag = viewer ? "OrganViewer" : component
  const modelProp = viewer ? ` model={${modelExport}}` : ""
  const imports = viewer
    ? `import { OrganViewer } from "@/components/organ-viewer"
import { ${modelExport} } from "@/components/${name}"`
    : `import { ${component} } from "@/components/${name}"`
  const defaultCode = `${imports}

export function DefaultExample() {
  return <${tag}${modelProp} label="${model.name} default example" className="h-[28rem]" />
}`
  const withoutControls = `${imports}

export function WithoutControlsExample() {
  return <${tag}${modelProp} label="${model.name} without controls example" controls={false} className="h-[28rem]" />
}`
  const controlledImports = viewer
    ? imports
    : `import { ${component}, ${modelExport} } from "@/components/${name}"`
  const controlled = `"use client"

import { useState } from "react"
${controlledImports}

export function ControlledExample() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = ${modelExport}.structures.find(({ id }) => id === selectedId)
  return (
    <div className="flex flex-col gap-3">
      <${tag}${modelProp}
        label="${model.name} controlled selection example"
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
  return [
    {
      name: `${exampleName}-demo`,
      title: viewer ? "Organ viewer" : model.name,
      preview: (
        <OrganViewer
          model={model}
          label={`${model.name} default example`}
          className="h-[28rem]"
        />
      ),
      code: defaultCode,
    },
    {
      name: `${exampleName}-without-controls`,
      title: "Without Controls",
      description:
        "Hide the built-in view, zoom, and reset controls while keeping camera interaction and attribution.",
      preview: (
        <OrganViewer
          model={model}
          label={`${model.name} without controls example`}
          controls={false}
          className="h-[28rem]"
        />
      ),
      code: withoutControls,
    },
    {
      name: `${exampleName}-controlled`,
      title: "Controlled Selection",
      description:
        "Connect selection to your application state with selectedId and onSelectionChange.",
      preview: <ControlledExample model={model} />,
      code: controlled,
    },
    {
      name: `${exampleName}-with-anatomy`,
      title: "With Anatomy Panel",
      description:
        "Install the Explorer 01 block to add a responsive anatomy panel with shared selection and visibility.",
      preview: <OrganExplorer model={model} />,
      code: anatomy,
    },
  ] as const
}

export function OrganDemo(props: OrganExampleProps) {
  const demo = organExamples(props)[0]
  return <ComponentViewer {...demo} lazy />
}

export function OrganExamples(props: OrganExampleProps) {
  const [, ...examples] = organExamples(props)
  return (
    <>
      {examples.map((example) => (
        <section
          key={example.name}
          id={example.title.toLowerCase().replaceAll(" ", "-")}
          className="flex min-w-0 flex-col gap-4"
        >
          <h2 className="text-2xl font-semibold">{example.title}</h2>
          <p className="text-sm text-muted-foreground">{example.description}</p>
          <ComponentViewer
            {...example}
            title={`${props.viewer ? "Organ viewer" : props.model.name} ${example.title}`}
            lazy
          />
        </section>
      ))}
    </>
  )
}
