import type { ComponentExample } from "@/components/component-examples"
import { showComingSoon } from "@/lib/registry"

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
      name: "ecg-trace-rate",
      title: "Heart Rate",
      description:
        "Change the synthetic rate and the trace, heart rate and labels follow.",
    },
    {
      name: "ecg-trace-recorded",
      title: "Recorded Strip",
      description:
        "Samples you already have are drawn once, with no sweep and no Pause.",
    },
    {
      name: "ecg-trace-paper",
      title: "Paper Speed and Gain",
      description:
        "Faster paper and more gain, without wave labels, for a closer look.",
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
  "allergy-list": [
    {
      name: "allergy-list-states",
      title: "Not Recorded and None Known",
      description:
        "Not asking and finding no allergies are different records, and read differently.",
    },
    // The patient banner is coming soon.
    ...(showComingSoon
      ? [
          {
            name: "allergy-list-banner",
            title: "With the Patient Banner",
            description:
              "allergySummary turns the list into the banner's allergies, leaving out resolved ones.",
          },
        ]
      : []),
  ],
  "problem-list": [
    {
      name: "problem-list-no-codes",
      title: "Without Codes",
      description: "Hide the coded terms for a summary view.",
    },
    {
      name: "problem-list-text-dates",
      title: "Dates as Recorded",
      description:
        'Onsets such as "Childhood" or a year read as written; only full dates are formatted.',
    },
  ],
  "news2-chart": [
    {
      name: "news2-chart-scale-2",
      title: "SpO₂ Scale 2",
      description:
        "For hypercapnic respiratory failure with a target of 88–92%: saturation above the target on oxygen scores too.",
    },
    {
      name: "news2-chart-incomplete",
      title: "An Incomplete Set",
      description:
        "A set missing a parameter shows what was recorded but no total.",
    },
  ],
  "patient-banner": [
    {
      name: "patient-banner-allergies",
      title: "Allergy States",
      description:
        "Not recorded, no known allergies, and a recorded allergy each read differently.",
    },
    {
      name: "patient-banner-baby",
      title: "A Baby",
      description:
        "Age in months under two years, and in days under four weeks, with an alert.",
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
