// Items still being designed. They stay installable, but the sidebar lists
// them as coming soon and the rest of the site leaves them out. Outside next
// dev their pages redirect to their section's index, so the docs link an
// install prints still lands somewhere.
export const comingSoon: ReadonlySet<string> = new Set([
  "allergy-list",
  "fhir",
  "lab-results",
  "news2-chart",
  "patient-banner",
  "problem-list",
  "vital-signs",
])
export const showComingSoon = process.env.NODE_ENV === "development"

// Items that stay installable, so existing installs keep updating, but are
// left off the site altogether. Their docs links redirect to their section's
// index.
export const offSite: ReadonlySet<string> = new Set(["growth-chart"])
