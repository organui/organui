import type { ReactNode } from "react"
import { conditionExamples } from "./_conditions"
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
  "condition-viewer-demo": {
    title: "Condition viewer",
    file: "condition-viewer-demo.tsx",
    lazy: true,
    render: async () => {
      const { Example } = await import("./condition-viewer-demo")
      return <Example />
    },
  },
  ...Object.fromEntries(
    Object.entries({ ...organExamples, ...conditionExamples }).map(
      ([name, item]) => [name, { ...item, lazy: true }]
    )
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
  "anatomy-tree-state": {
    title: "Selection and Visibility",
    file: "anatomy-tree-state.tsx",
    render: async () => {
      const { Example } = await import("./anatomy-tree-state")
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
  "body-map-value": {
    title: "Selected Regions",
    file: "body-map-value.tsx",
    render: async () => {
      const { Example } = await import("./body-map-value")
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
  "scan-viewer-demo": {
    title: "Scan viewer",
    file: "scan-viewer-demo.tsx",
    // Generating the head phantom blocks the main thread for 70–170 ms on a
    // laptop, several times that on a phone, so index cards wait for a click.
    lazy: true,
    render: async () => {
      const { Example } = await import("./scan-viewer-demo")
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
  "medication-schedule-tracking": {
    title: "Dose Tracking",
    file: "medication-schedule-tracking.tsx",
    render: async () => {
      const { Example } = await import("./medication-schedule-tracking")
      return <Example />
    },
  },
  "medication-schedule-interactions": {
    title: "Interactions",
    file: "medication-schedule-interactions.tsx",
    render: async () => {
      const { Example } = await import("./medication-schedule-interactions")
      return <Example />
    },
  },
  "medication-schedule-date-picker": {
    title: "With a Date Picker",
    file: "medication-schedule-date-picker.tsx",
    render: async () => {
      const { Example } = await import("./medication-schedule-date-picker")
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
  "patient-banner-demo": {
    title: "Patient banner",
    file: "patient-banner-demo.tsx",
    render: async () => {
      const { Example } = await import("./patient-banner-demo")
      return <Example />
    },
  },
  "patient-banner-allergies": {
    title: "Allergy States",
    file: "patient-banner-allergies.tsx",
    render: async () => {
      const { Example } = await import("./patient-banner-allergies")
      return <Example />
    },
  },
  "patient-banner-baby": {
    title: "A Baby",
    file: "patient-banner-baby.tsx",
    render: async () => {
      const { Example } = await import("./patient-banner-baby")
      return <Example />
    },
  },
  "allergy-list-demo": {
    title: "Allergy list",
    file: "allergy-list-demo.tsx",
    render: async () => {
      const { Example } = await import("./allergy-list-demo")
      return <Example />
    },
  },
  "allergy-list-states": {
    title: "Not Recorded and None Known",
    file: "allergy-list-states.tsx",
    render: async () => {
      const { Example } = await import("./allergy-list-states")
      return <Example />
    },
  },
  "allergy-list-banner": {
    title: "With the Patient Banner",
    file: "allergy-list-banner.tsx",
    render: async () => {
      const { Example } = await import("./allergy-list-banner")
      return <Example />
    },
  },
  "problem-list-demo": {
    title: "Problem list",
    file: "problem-list-demo.tsx",
    render: async () => {
      const { Example } = await import("./problem-list-demo")
      return <Example />
    },
  },
  "problem-list-no-codes": {
    title: "Without Codes",
    file: "problem-list-no-codes.tsx",
    render: async () => {
      const { Example } = await import("./problem-list-no-codes")
      return <Example />
    },
  },
  "problem-list-text-dates": {
    title: "Dates as Recorded",
    file: "problem-list-text-dates.tsx",
    render: async () => {
      const { Example } = await import("./problem-list-text-dates")
      return <Example />
    },
  },
  "news2-chart-demo": {
    title: "NEWS2 chart",
    file: "news2-chart-demo.tsx",
    render: async () => {
      const { Example } = await import("./news2-chart-demo")
      return <Example />
    },
  },
  "news2-chart-scale-2": {
    title: "SpO₂ Scale 2",
    file: "news2-chart-scale-2.tsx",
    render: async () => {
      const { Example } = await import("./news2-chart-scale-2")
      return <Example />
    },
  },
  "news2-chart-incomplete": {
    title: "An Incomplete Set",
    file: "news2-chart-incomplete.tsx",
    render: async () => {
      const { Example } = await import("./news2-chart-incomplete")
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
  "fhir-demo": {
    title: "FHIR",
    file: "fhir-demo.tsx",
    render: async () => {
      const { Example } = await import("./fhir-demo")
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
  "anatomy-tree-groups": {
    title: "Groups and Colours",
    file: "anatomy-tree-groups.tsx",
    render: async () => {
      const { Example } = await import("./anatomy-tree-groups")
      return <Example />
    },
  },
  "anatomy-tree-hidden": {
    title: "Hidden Structures",
    file: "anatomy-tree-hidden.tsx",
    render: async () => {
      const { Example } = await import("./anatomy-tree-hidden")
      return <Example />
    },
  },
  "body-map-front": {
    title: "One View",
    file: "body-map-front.tsx",
    render: async () => {
      const { Example } = await import("./body-map-front")
      return <Example />
    },
  },
  "form-rhf-demo": {
    title: "Pain assessment form",
    file: "form-rhf-demo.tsx",
    render: async () => {
      const { Example } = await import("./form-rhf-demo")
      return <Example />
    },
  },
  "body-map-form": {
    title: "In a Form",
    file: "body-map-form.tsx",
    render: async () => {
      const { Example } = await import("./body-map-form")
      return <Example />
    },
  },
  "dermatome-map-results": {
    title: "Examination Results",
    file: "dermatome-map-results.tsx",
    render: async () => {
      const { Example } = await import("./dermatome-map-results")
      return <Example />
    },
  },
  "dermatome-map-back": {
    title: "Back Only",
    file: "dermatome-map-back.tsx",
    render: async () => {
      const { Example } = await import("./dermatome-map-back")
      return <Example />
    },
  },
  "dna-helix-still": {
    title: "Still",
    file: "dna-helix-still.tsx",
    lazy: true,
    render: async () => {
      const { Example } = await import("./dna-helix-still")
      return <Example />
    },
  },
  "dna-helix-controlled": {
    title: "Controlled Selection",
    file: "dna-helix-controlled.tsx",
    lazy: true,
    render: async () => {
      const { Example } = await import("./dna-helix-controlled")
      return <Example />
    },
  },
  "ecg-trace-rate": {
    title: "Heart Rate",
    file: "ecg-trace-rate.tsx",
    render: async () => {
      const { Example } = await import("./ecg-trace-rate")
      return <Example />
    },
  },
  "ecg-trace-recorded": {
    title: "Recorded Strip",
    file: "ecg-trace-recorded.tsx",
    render: async () => {
      const { Example } = await import("./ecg-trace-recorded")
      return <Example />
    },
  },
  "ecg-trace-paper": {
    title: "Paper Speed and Gain",
    file: "ecg-trace-paper.tsx",
    render: async () => {
      const { Example } = await import("./ecg-trace-paper")
      return <Example />
    },
  },
  "scan-viewer-controlled": {
    title: "Controlled Slice and Window",
    file: "scan-viewer-controlled.tsx",
    render: async () => {
      const { Example } = await import("./scan-viewer-controlled")
      return <Example />
    },
  },
  "scan-viewer-dicom": {
    title: "Open DICOM Files",
    file: "scan-viewer-dicom.tsx",
    render: async () => {
      const { Example } = await import("./scan-viewer-dicom")
      return <Example />
    },
  },
  "scan-viewer-no-controls": {
    title: "Without Controls",
    file: "scan-viewer-no-controls.tsx",
    render: async () => {
      const { Example } = await import("./scan-viewer-no-controls")
      return <Example />
    },
  },
  "lab-results-flags": {
    title: "Text Results and Lab Flags",
    file: "lab-results-flags.tsx",
    render: async () => {
      const { Example } = await import("./lab-results-flags")
      return <Example />
    },
  },
  "lab-results-no-trend": {
    title: "Without Trends",
    file: "lab-results-no-trend.tsx",
    render: async () => {
      const { Example } = await import("./lab-results-no-trend")
      return <Example />
    },
  },
  "medication-schedule-simple": {
    title: "One Medication",
    file: "medication-schedule-simple.tsx",
    render: async () => {
      const { Example } = await import("./medication-schedule-simple")
      return <Example />
    },
  },
  "medication-schedule-read-only": {
    title: "Read-only",
    file: "medication-schedule-read-only.tsx",
    render: async () => {
      const { Example } = await import("./medication-schedule-read-only")
      return <Example />
    },
  },
  "molecule-viewer-spacefill": {
    title: "Spacefill",
    file: "molecule-viewer-spacefill.tsx",
    lazy: true,
    render: async () => {
      const { Example } = await import("./molecule-viewer-spacefill")
      return <Example />
    },
  },
  "molecule-viewer-no-controls": {
    title: "Without Controls",
    file: "molecule-viewer-no-controls.tsx",
    lazy: true,
    render: async () => {
      const { Example } = await import("./molecule-viewer-no-controls")
      return <Example />
    },
  },
  "vital-signs-fahrenheit": {
    title: "Fahrenheit and Chosen Vitals",
    file: "vital-signs-fahrenheit.tsx",
    render: async () => {
      const { Example } = await import("./vital-signs-fahrenheit")
      return <Example />
    },
  },
  "vital-signs-targets": {
    title: "Target Ranges",
    file: "vital-signs-targets.tsx",
    render: async () => {
      const { Example } = await import("./vital-signs-targets")
      return <Example />
    },
  },
}
