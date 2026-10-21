import type { ReactNode } from "react"
import { organExamples } from "./_organs"

// Every documentation example by name.
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
    // Generating the head phantom blocks the main thread for 70–170 ms on a
    // laptop, several times that on a phone, so index cards wait for a click.
    lazy: true,
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
  "age-demo": {
    title: "Age",
    file: "age-demo.tsx",
    render: async () => {
      const { Example } = await import("./age-demo")
      return <Example />
    },
  },
  "z-scores-demo": {
    title: "Z-scores",
    file: "z-scores-demo.tsx",
    render: async () => {
      const { Example } = await import("./z-scores-demo")
      return <Example />
    },
  },
  "reference-ranges-demo": {
    title: "Reference ranges",
    file: "reference-ranges-demo.tsx",
    render: async () => {
      const { Example } = await import("./reference-ranges-demo")
      return <Example />
    },
  },
  "clinical-units-demo": {
    title: "Clinical units",
    file: "clinical-units-demo.tsx",
    render: async () => {
      const { Example } = await import("./clinical-units-demo")
      return <Example />
    },
  },
  "body-measurements-demo": {
    title: "Body measurements",
    file: "body-measurements-demo.tsx",
    render: async () => {
      const { Example } = await import("./body-measurements-demo")
      return <Example />
    },
  },
  "heartbeat-demo": {
    title: "Heartbeat",
    file: "heartbeat-demo.tsx",
    render: async () => {
      const { Example } = await import("./heartbeat-demo")
      return <Example />
    },
  },
  "ecg-grid-demo": {
    title: "ECG grid",
    file: "ecg-grid-demo.tsx",
    render: async () => {
      const { Example } = await import("./ecg-grid-demo")
      return <Example />
    },
  },
  "severity-colors-demo": {
    title: "Severity colours",
    file: "severity-colors-demo.tsx",
    render: async () => {
      const { Example } = await import("./severity-colors-demo")
      return <Example />
    },
  },
  "ai-elements-demo": {
    title: "Review an AI-drafted note",
    file: "ai-elements-demo.tsx",
    render: async () => {
      const { Example } = await import("./ai-elements-demo")
      return <Example />
    },
  },
  "ai-disclaimer-demo": {
    title: "AI disclaimer",
    file: "ai-disclaimer-demo.tsx",
    render: async () => {
      const { Example } = await import("./ai-disclaimer-demo")
      return <Example />
    },
  },
  "ai-note-demo": {
    title: "AI note",
    file: "ai-note-demo.tsx",
    render: async () => {
      const { Example } = await import("./ai-note-demo")
      return <Example />
    },
  },
  "ai-sources-demo": {
    title: "AI sources",
    file: "ai-sources-demo.tsx",
    render: async () => {
      const { Example } = await import("./ai-sources-demo")
      return <Example />
    },
  },
  "ai-reasoning-demo": {
    title: "AI reasoning",
    file: "ai-reasoning-demo.tsx",
    render: async () => {
      const { Example } = await import("./ai-reasoning-demo")
      return <Example />
    },
  },
  "differential-list-demo": {
    title: "Differential list",
    file: "differential-list-demo.tsx",
    render: async () => {
      const { Example } = await import("./differential-list-demo")
      return <Example />
    },
  },
  "clinician-review-demo": {
    title: "Clinician review",
    file: "clinician-review-demo.tsx",
    render: async () => {
      const { Example } = await import("./clinician-review-demo")
      return <Example />
    },
  },
}
