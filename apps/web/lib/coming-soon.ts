// Items still being designed. They stay installable, but the sidebar lists
// them as coming soon and the rest of the site leaves them out. Outside next
// dev their pages redirect to their section's index, so the docs link an
// install prints still lands somewhere.
export const comingSoon: ReadonlySet<string> = new Set([
  "allergy-list",
  "fhir",
  "news2-chart",
  "patient-banner",
  "problem-list",
])
export const showComingSoon = process.env.NODE_ENV === "development"
