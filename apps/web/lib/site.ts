export const site = {
  name: "OrganUI",
  url: "https://organui.com",
  title: "OrganUI — The interfaces healthcare deserves.",
  description: "Interfaces for healthcare and life sciences.",
  socialImage: "/opengraph-image",
} as const

// Standalone 3D anatomy explorers, each in its own repository.
export const explorers = ["Brain", "Heart", "Kidneys", "Liver", "Lungs"].map(
  (name) => ({
    name,
    href: `https://github.com/organui/${name.toLowerCase()}-3d`,
  })
)

// Preview and development builds should never be indexed as the public site.
export const isProduction = process.env.VERCEL_ENV === "production"
