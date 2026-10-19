import type { ReactNode } from "react"
import { organExamples } from "./_organs"

// Every documentation example by name. Plain data, so the server preview and
// the client's load-on-request preview read the same definitions.
export type ExampleDefinition = {
  title: string
  lazy?: boolean
  file: string
  render: () => Promise<ReactNode>
}

export const examples: Record<string, ExampleDefinition> = {
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
  // The cell is built on the organ viewer but is not an organ.
  "cell-demo": {
    title: "Cell",
    file: "cell-demo.tsx",
    lazy: true,
    render: async () => {
      const { Example } = await import("./cell-demo")
      return <Example />
    },
  },
  "cell-without-controls": {
    title: "Cell Without Controls",
    file: "cell-without-controls.tsx",
    lazy: true,
    render: async () => {
      const { Example } = await import("./cell-without-controls")
      return <Example />
    },
  },
  "cell-controlled": {
    title: "Cell Controlled Selection",
    file: "cell-controlled.tsx",
    lazy: true,
    render: async () => {
      const { Example } = await import("./cell-controlled")
      return <Example />
    },
  },
  "cell-with-anatomy": {
    title: "Cell With Anatomy Panel",
    file: "cell-with-anatomy.tsx",
    lazy: true,
    render: async () => {
      const { Example } = await import("./cell-with-anatomy")
      return <Example />
    },
  },
  "anatomy-tree-demo": {
    title: "Anatomy tree",
    file: "anatomy-tree-demo.tsx",
    render: async () => {
      const { Example } = await import("./anatomy-tree-demo")
      return <Example />
    },
  },
  "body-map-demo": {
    title: "Body map",
    file: "body-map-demo.tsx",
    render: async () => {
      const { Example } = await import("./body-map-demo")
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
  "image-viewer-demo": {
    title: "Medical image viewer",
    file: "image-viewer-demo.tsx",
    render: async () => {
      const { Example } = await import("./image-viewer-demo")
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
    lazy: true,
    render: async () => {
      const { Example } = await import("./dna-helix-demo")
      return <Example />
    },
  },
  "molecule-viewer-demo": {
    title: "Molecule viewer",
    file: "molecule-viewer-demo.tsx",
    lazy: true,
    render: async () => {
      const { Example } = await import("./molecule-viewer-demo")
      return <Example />
    },
  },
  "dermatome-map-demo": {
    title: "Dermatome map",
    file: "dermatome-map-demo.tsx",
    render: async () => {
      const { Example } = await import("./dermatome-map-demo")
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
  "growth-chart-demo": {
    title: "Growth chart",
    file: "growth-chart-demo.tsx",
    render: async () => {
      const { Example } = await import("./growth-chart-demo")
      return <Example />
    },
  },
}
