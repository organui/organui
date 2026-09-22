export type Explorer = {
  id: string
  name: string
  category: string
  description: string
  imageAlt: string
  views: { name: string; file: string; alt: string }[]
}
export const explorers: Explorer[] = [
  {
    id: "heart",
    name: "Heart",
    category: "Structure & connection",
    description:
      "Find your way around the heart. Select source-mapped structures, isolate anatomy, and follow guided views.",
    imageAlt:
      "Anterior view of the Heart explorer’s model, with coronary vessels across the ventricular wall.",
    views: [
      {
        name: "Overview",
        file: "desktop",
        alt: "Heart explorer with the complete model and minimal camera controls.",
      },
      {
        name: "Anatomy selection",
        file: "anatomy",
        alt: "Heart explorer with the anatomy panel open for structure selection.",
      },
    ],
  },
  {
    id: "liver",
    name: "Liver",
    category: "Beneath the surface",
    description:
      "Look beyond the surface. Reveal the internal vessels and bile ducts, then isolate a structure for a closer view.",
    imageAlt:
      "The Liver explorer’s red liver surface model, with part of the gallbladder visible below.",
    views: [
      {
        name: "Overview",
        file: "desktop",
        alt: "Liver explorer showing the surface model and camera controls.",
      },
      {
        name: "Reveal interior",
        file: "interior",
        alt: "Transparent liver surface revealing vessels and ducts, with the portal vein selected in the anatomy panel.",
      },
    ],
  },
  {
    id: "lungs",
    name: "Lungs",
    category: "From whole to part",
    description:
      "Explore lungs, lobes, and segments through a connected hierarchy. Fade the surface to reveal the airway tree.",
    imageAlt:
      "The Lungs explorer’s model with softly colored lobes and the trachea above.",
    views: [
      {
        name: "Overview",
        file: "desktop",
        alt: "Lungs explorer showing the colored lobes, trachea, and camera toolbar.",
      },
      {
        name: "Mobile layout",
        file: "mobile",
        alt: "The Lungs explorer’s responsive layout on a narrow mobile screen.",
      },
    ],
  },
]
