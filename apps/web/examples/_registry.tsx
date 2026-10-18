import { cache, type ReactNode } from "react"
import { organModels } from "@/lib/organ-models"
import { registryItems } from "@/lib/registry"

type ExampleDefinition = {
  title: string
  file: string
  render: () => Promise<ReactNode>
}

const examples: Record<string, ExampleDefinition> = {
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
    load: () => import("./organ-without-controls"),
  },
  {
    suffix: "controlled",
    title: "Controlled Selection",
    description:
      "Connect selection to your application state with selectedId and onSelectionChange.",
    load: () => import("./organ-controlled"),
  },
  {
    suffix: "with-anatomy",
    title: "With Anatomy Panel",
    description:
      "Install the Explorer 01 block to add a responsive anatomy panel with shared selection and visibility.",
    load: () => import("./organ-with-anatomy"),
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
      lazy: false,
    }

  const variants = [
    { suffix: "demo", title: "", load: () => import("./organ-demo") },
    ...organExampleVariants,
  ]
  const variant = variants.find(({ suffix }) => name.endsWith(`-${suffix}`))
  if (!variant) return null
  const itemName = name.slice(0, -variant.suffix.length - 1)
  const organ = itemName === "organ-viewer" ? "heart" : itemName
  if (!registryItems.some((item) => item.organ && item.name === organ))
    return null
  const load = organModels[organ]
  if (!load) return null
  const [model, { Example }] = await Promise.all([load(), variant.load()])
  const title = itemName === "organ-viewer" ? "Organ viewer" : model.name
  return {
    name,
    title: variant.title ? `${title} ${variant.title}` : title,
    file: `organ-${variant.suffix}.tsx`,
    component: <Example model={model} />,
    lazy: true,
  }
})
