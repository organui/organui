import { liverModel } from "@/components/liver"
import {
  OrganViewer,
  type OrganModel,
  type OrganViewerProps,
} from "@/components/organ-viewer"

// Structures the disease leaves alone keep one muted tone, so the affected
// parts read first without a severity colour.
const SPARED = "#a9a59c"

// What autoimmune hepatitis does to each structure of the liver model.
// Structures not listed are spared and keep their anatomical description.
const findings: Record<
  string,
  { label?: string; description: string; affected: boolean }
> = {
  liver: {
    label: "Hepatic parenchyma",
    affected: true,
    description:
      "Interface hepatitis: lymphocytes and plasma cells spill from the portal tracts into the lobule and destroy the hepatocytes at its edge. Untreated, the injury bridges between tracts as fibrosis and ends in cirrhosis.",
  },
  portal: {
    affected: true,
    description:
      "Its branches run in the portal tracts, where the dense lymphoplasmacytic infiltrate begins. Once cirrhosis develops, portal pressure rises, causing varices, ascites and an enlarged spleen.",
  },
  biliary: {
    affected: false,
    description:
      "The bile ducts are usually spared. Cholangitis on biopsy, or strictures on cholangiography, suggest an overlap with primary biliary cholangitis or primary sclerosing cholangitis.",
  },
  "hepatic-veins": {
    affected: false,
    description:
      "Not involved. Hepatic vein obstruction (Budd–Chiari syndrome) can look like acute hepatitis, so imaging excludes it.",
  },
}

// The liver model with autoimmune hepatitis mapped onto its structures: the
// same GLB, views and credit, regrouped into affected and spared parts.
export const autoimmuneHepatitisModel: OrganModel = {
  ...liverModel,
  name: "Autoimmune hepatitis",
  structures: liverModel.structures.map((structure) => {
    const finding = findings[structure.id]
    return {
      ...structure,
      label: finding?.label ?? structure.label,
      group: finding?.affected ? "Affected" : "Spared",
      color: finding?.affected ? structure.color : SPARED,
      description: finding?.description ?? structure.description,
    }
  }),
}

export type AutoimmuneHepatitisProps = Omit<OrganViewerProps, "model">

export function AutoimmuneHepatitis(props: AutoimmuneHepatitisProps) {
  return <OrganViewer model={autoimmuneHepatitisModel} {...props} />
}
