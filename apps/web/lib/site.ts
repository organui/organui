export const site = {
  name: "OrganUI",
  url: "https://organui.com",
  title: "OrganUI — The interfaces healthcare deserves.",
  description: "Interfaces for healthcare and life sciences.",
  socialImage: "/opengraph-image",
} as const

// Standalone 3D anatomy explorers, each in its own repository.
export const explorers = [
  "Adrenals",
  "Bladder",
  "Brain",
  "Ear",
  "Esophagus",
  "Eye",
  "Gallbladder",
  "Heart",
  "Intestines",
  "Kidneys",
  "Larynx",
  "Liver",
  "Lungs",
  "Lymph",
  "Muscles",
  "Nose",
  "Pancreas",
  "Pharynx",
  "Prostate",
  "Skeleton",
  "Skin",
  "Spinal cord",
  "Spleen",
  "Stomach",
  "Teeth",
  "Thymus",
  "Thyroid",
  "Tongue",
  "Uterus",
  "Vessels",
].map((name) => {
  const slug = name.toLowerCase().replaceAll(" ", "-")
  // The registry item for the same organ shares the slug.
  return { name, slug, href: `https://github.com/organui/${slug}-3d` }
})

// Preview and development builds should never be indexed as the public site.
export const isProduction = process.env.VERCEL_ENV === "production"
