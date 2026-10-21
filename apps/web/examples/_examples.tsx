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
    title: "heartbeat",
    file: "heartbeat-demo.tsx",
    render: async () => {
      const { Example } = await import("./heartbeat-demo")
      return <Example />
    },
  },
  "ecg-grid-demo": {
    title: "ecg-grid",
    file: "ecg-grid-demo.tsx",
    render: async () => {
      const { Example } = await import("./ecg-grid-demo")
      return <Example />
    },
  },
  "severity-demo": {
    title: "severity",
    file: "severity-demo.tsx",
    render: async () => {
      const { Example } = await import("./severity-demo")
      return <Example />
    },
  },
  "ai-elements-demo": {
    title: "A clinical assistant",
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
  "clinical-citation-demo": {
    title: "Clinical citation",
    file: "clinical-citation-demo.tsx",
    render: async () => {
      const { Example } = await import("./clinical-citation-demo")
      return <Example />
    },
  },
  "clinical-sources-demo": {
    title: "Clinical sources",
    file: "clinical-sources-demo.tsx",
    render: async () => {
      const { Example } = await import("./clinical-sources-demo")
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
  "chart-growth-weight": {
    title: "chart-growth-weight",
    file: "chart-growth-weight.tsx",
    render: async () => {
      const { Example } = await import("./chart-growth-weight")
      return <Example />
    },
  },
  "chart-growth-length": {
    title: "chart-growth-length",
    file: "chart-growth-length.tsx",
    render: async () => {
      const { Example } = await import("./chart-growth-length")
      return <Example />
    },
  },
  "chart-growth-head": {
    title: "chart-growth-head",
    file: "chart-growth-head.tsx",
    render: async () => {
      const { Example } = await import("./chart-growth-head")
      return <Example />
    },
  },
  "chart-ecg-sinus": {
    title: "chart-ecg-sinus",
    file: "chart-ecg-sinus.tsx",
    render: async () => {
      const { Example } = await import("./chart-ecg-sinus")
      return <Example />
    },
  },
  "chart-ecg-live": {
    title: "chart-ecg-live",
    file: "chart-ecg-live.tsx",
    render: async () => {
      const { Example } = await import("./chart-ecg-live")
      return <Example />
    },
  },
  "chart-ecg-bradycardia": {
    title: "chart-ecg-bradycardia",
    file: "chart-ecg-bradycardia.tsx",
    render: async () => {
      const { Example } = await import("./chart-ecg-bradycardia")
      return <Example />
    },
  },
  "chart-ecg-tachycardia": {
    title: "chart-ecg-tachycardia",
    file: "chart-ecg-tachycardia.tsx",
    render: async () => {
      const { Example } = await import("./chart-ecg-tachycardia")
      return <Example />
    },
  },
  "chart-ecg-paper": {
    title: "chart-ecg-paper",
    file: "chart-ecg-paper.tsx",
    render: async () => {
      const { Example } = await import("./chart-ecg-paper")
      return <Example />
    },
  },
  "chart-lab-trends": {
    title: "chart-lab-trends",
    file: "chart-lab-trends.tsx",
    render: async () => {
      const { Example } = await import("./chart-lab-trends")
      return <Example />
    },
  },
  "chart-lab-sparkline": {
    title: "chart-lab-sparkline",
    file: "chart-lab-sparkline.tsx",
    render: async () => {
      const { Example } = await import("./chart-lab-sparkline")
      return <Example />
    },
  },
  "chart-vitals-adult": {
    title: "chart-vitals-adult",
    file: "chart-vitals-adult.tsx",
    render: async () => {
      const { Example } = await import("./chart-vitals-adult")
      return <Example />
    },
  },
  "chart-vitals-custom": {
    title: "chart-vitals-custom",
    file: "chart-vitals-custom.tsx",
    render: async () => {
      const { Example } = await import("./chart-vitals-custom")
      return <Example />
    },
  },
}
