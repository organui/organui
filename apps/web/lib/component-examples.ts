import type { ComponentExample } from "@/components/component-examples"

// The examples each component page shows after its usage.
export const componentExamples: Record<string, ComponentExample[]> = {
  "anatomy-tree": [
    {
      name: "anatomy-tree-groups",
      title: "Groups and Colours",
      description:
        "Groupings that aren't one structure open instead of selecting, and each structure shows its colour in the viewer.",
    },
    {
      name: "anatomy-tree-hidden",
      title: "Hidden Structures",
      description:
        "Visibility starts with the right heart hidden, so its branch shows as partly visible.",
    },
  ],
  "body-map": [
    {
      name: "body-map-front",
      title: "One View",
      description: "Show only the front, for forms that ask about one side.",
    },
    {
      name: "body-map-form",
      title: "In a Form",
      description:
        "Give it a name and it submits one value per selected region, like checkboxes.",
    },
  ],
  "dermatome-map": [
    {
      name: "dermatome-map-results",
      title: "Examination Results",
      description:
        "Colour levels by finding, such as reduced or absent sensation.",
    },
    {
      name: "dermatome-map-back",
      title: "Back Only",
      description: "One view without labels, for a compact layout.",
    },
  ],
  "dna-helix": [
    {
      name: "dna-helix-still",
      title: "Still",
      description: "Without rotation or the strands below, as an illustration.",
    },
    {
      name: "dna-helix-controlled",
      title: "Controlled Selection",
      description: "Move the selected pair from your own controls.",
    },
  ],
  "ecg-trace": [
    {
      name: "ecg-trace-live",
      title: "Live Stream",
      description: "A stream sweeps like a monitor and always offers Pause.",
    },
    {
      name: "ecg-trace-paper",
      title: "Paper Speed and Gain",
      description:
        "Faster paper and more gain, without wave labels, for a closer look.",
    },
  ],
  "growth-chart": [
    {
      name: "growth-chart-length",
      title: "Length and Height",
      description:
        "Lying length to 24 months, then standing height, which steps down by about 0.7 cm.",
    },
    {
      name: "growth-chart-head",
      title: "Chosen Percentiles",
      description:
        "Head circumference with only the 3rd, 50th and 97th curves.",
    },
  ],
  "image-viewer": [
    {
      name: "image-viewer-controlled",
      title: "Controlled Slice and Window",
      description:
        "Slice and window come from your state, so your own controls can drive them.",
    },
    {
      name: "image-viewer-no-controls",
      title: "Without Controls",
      description:
        "No toolbar or slider; the image still scrolls, zooms and windows.",
    },
  ],
  "lab-results": [
    {
      name: "lab-results-flags",
      title: "Text Results and Lab Flags",
      description:
        "Text results print their own range, and a flag from the laboratory wins over the computed one.",
    },
    {
      name: "lab-results-no-trend",
      title: "Without Trends",
      description: "Hide the trend column for narrow layouts.",
    },
  ],
  "medication-schedule": [
    {
      name: "medication-schedule-simple",
      title: "One Medication",
      description: "Twice a day, with no interactions and no disclaimer.",
    },
    {
      name: "medication-schedule-read-only",
      title: "Read-only",
      description:
        "Without callbacks there are no day buttons and dose status is text.",
    },
  ],
  "molecule-viewer": [
    {
      name: "molecule-viewer-spacefill",
      title: "Spacefill",
      description: "Atoms as spheres, coloured by element.",
    },
    {
      name: "molecule-viewer-no-controls",
      title: "Without Controls",
      description:
        "Only the structure, coloured as a rainbow. It still rotates.",
    },
  ],
  "vital-signs": [
    {
      name: "vital-signs-fahrenheit",
      title: "Fahrenheit and Chosen Vitals",
      description: "Show the vitals you need, in your order, in Fahrenheit.",
    },
    {
      name: "vital-signs-targets",
      title: "Target Ranges",
      description:
        "Ranges merge over the adult defaults, such as a target SpO₂ of 88–92%.",
    },
  ],
}
