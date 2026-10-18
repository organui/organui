import { cache, type ReactNode } from "react"
import { organExamples } from "./_organs"

type ExampleDefinition = {
  title: string
  lazy?: boolean
  file: string
  render: () => Promise<ReactNode>
}

const examples: Record<string, ExampleDefinition> = {
  "organ-viewer-demo": {
    title: "Organ viewer",
    file: "organ-viewer-demo.tsx",
    lazy: true,
    render: async () => {
      const { Example } = await import("./organ-viewer-demo")
      return <Example />
    },
  },
  "organ-viewer-without-controls": {
    title: "Organ viewer Without Controls",
    file: "organ-viewer-without-controls.tsx",
    lazy: true,
    render: async () => {
      const { Example } = await import("./organ-viewer-without-controls")
      return <Example />
    },
  },
  "organ-viewer-controlled": {
    title: "Organ viewer Controlled Selection",
    file: "organ-viewer-controlled.tsx",
    lazy: true,
    render: async () => {
      const { Example } = await import("./organ-viewer-controlled")
      return <Example />
    },
  },
  "organ-viewer-with-anatomy": {
    title: "Organ viewer With Anatomy Panel",
    file: "organ-viewer-with-anatomy.tsx",
    lazy: true,
    render: async () => {
      const { Example } = await import("./organ-viewer-with-anatomy")
      return <Example />
    },
  },
  ...Object.fromEntries(
    Object.entries(organExamples).map(([name, item]) => [
      name,
      { ...item, lazy: true },
    ])
  ),
  "anatomy-tree-demo": {
    title: "Anatomy tree",
    file: "anatomy-tree-demo.tsx",
    render: async () => {
      const { Example } = await import("./anatomy-tree-demo")
      return <Example />
    },
  },
  "ecg-trace-demo": {
    title: "ECG trace",
    file: "ecg-trace-demo.tsx",
    render: async () => {
      const { Example } = await import("./ecg-trace-demo")
      return <Example />
    },
  },
  "vital-signs-demo": {
    title: "Vital signs",
    file: "vital-signs-demo.tsx",
    render: async () => {
      const { Example } = await import("./vital-signs-demo")
      return <Example />
    },
  },
  "medication-schedule-demo": {
    title: "Medication schedule",
    file: "medication-schedule-demo.tsx",
    render: async () => {
      const { Example } = await import("./medication-schedule-demo")
      return <Example />
    },
  },
  "dna-helix-demo": {
    title: "DNA helix",
    file: "dna-helix-demo.tsx",
    render: async () => {
      const { Example } = await import("./dna-helix-demo")
      return <Example />
    },
  },
  "molecule-viewer-demo": {
    title: "Molecule viewer",
    file: "molecule-viewer-demo.tsx",
    render: async () => {
      const { Example } = await import("./molecule-viewer-demo")
      return <Example />
    },
  },
  "lab-results-demo": {
    title: "Lab results table",
    file: "lab-results-demo.tsx",
    render: async () => {
      const { Example } = await import("./lab-results-demo")
      return <Example />
    },
  },
}

export const organExampleVariants = [
  {
    suffix: "without-controls",
    title: "Without Controls",
    description:
      "Hide the built-in view, zoom, and reset controls while keeping camera interaction and attribution.",
  },
  {
    suffix: "controlled",
    title: "Controlled Selection",
    description:
      "Connect selection to your application state with selectedId and onSelectionChange.",
  },
  {
    suffix: "with-anatomy",
    title: "With Anatomy Panel",
    description:
      "Pair this component with AnatomyTree for shared selection and visibility. For a complete layout with a mobile sheet, see the Explorer 01 block.",
  },
] as const

// Private documentation examples, separate from installable registry components.
export const getRegistryExample = cache(async (name: string) => {
  const definition = Object.hasOwn(examples, name) ? examples[name] : undefined
  if (definition)
    return {
      name,
      title: definition.title,
      file: definition.file,
      component: await definition.render(),
      lazy: definition.lazy ?? false,
    }

  return null
})
