export const site = {
  name: "OrganUI",
  url: "https://organui.com",
  title: "OrganUI — The interfaces healthcare deserves.",
  description: "Interfaces for healthcare and life sciences.",
  socialImage: "/opengraph-image",
} as const

// Preview and development builds should never be indexed as the public site.
export const isProduction = process.env.VERCEL_ENV === "production"
