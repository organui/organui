export const catalog = [
  { slug: "patient-status-badge", title: "Patient Status Badge", category: "Patient context", description: "Text-first workflow status labels for patient records.", states: ["active", "inactive", "critical", "pending", "unknown"] },
  { slug: "lab-result-card", title: "Lab Result Card", category: "Laboratory", description: "Structured results with units, ranges, timestamps, and review states.", states: ["normal", "abnormal", "critical", "pending", "unavailable"] },
  { slug: "lab-results-panel", title: "Lab Results Panel", category: "Laboratory", description: "A complete results workflow with summaries, explicit states, and an accessible table.", states: ["normal", "abnormal", "critical", "pending", "unavailable", "empty"] },
  { slug: "vital-sign-card", title: "Vital Sign Card", category: "Patient context", description: "Compact measurements with units, timestamps, and review states.", states: ["recorded", "attention", "unavailable"] },
  { slug: "medication-status", title: "Medication Status", category: "Medication", description: "Consistent medication workflow labels.", states: ["active", "held", "completed", "discontinued", "unknown"] },
  { slug: "specimen-status", title: "Specimen Status", category: "Laboratory", description: "Collection and transport states for specimen workflows.", states: ["collected", "in-transit", "received", "rejected", "unavailable"] },
  { slug: "clinical-alert", title: "Clinical Alert", category: "Feedback", description: "Semantic notices for informational, warning, and critical messages.", states: ["information", "warning", "critical"] },
  { slug: "study-phase-badge", title: "Study Phase Badge", category: "Clinical research", description: "Readable labels for common interventional study phases.", states: ["early-phase-1", "phase-1", "phase-2", "phase-3", "phase-4", "not-applicable"] },
  { slug: "patient-summary-header", title: "Patient Summary Header", category: "Patient context", description: "A privacy-conscious identity and record context header.", states: ["with-details", "without-details", "with-status"] },
] as const

export function getCatalogItem(slug: string) {
  return catalog.find((item) => item.slug === slug)
}
