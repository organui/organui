export const componentApi: Record<string, string[]> = {
  "patient-status-badge": ["status (required)", "label", "Badge props"],
  "lab-result-card": ["name and status (required)", "value", "unit", "referenceRange", "collectedAt", "statusLabel", "Card props"],
  "lab-results-panel": ["results (required)", "title", "description", "Card props"],
  "vital-sign-card": ["label (required)", "value", "unit", "measuredAt", "status", "Card props"],
  "medication-status": ["status (required)", "label", "Badge props"],
  "specimen-status": ["status (required)", "label", "Badge props"],
  "clinical-alert": ["severity, title, and description (required)", "Alert props"],
  "study-phase-badge": ["phase (required)", "label", "Badge props"],
  "patient-summary-header": ["displayName and identifier (required)", "details", "status", "Card props"],
}
