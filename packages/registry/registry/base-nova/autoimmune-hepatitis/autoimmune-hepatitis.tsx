import { liverLobuleModel } from "@/components/liver-lobule"
import {
  OrganViewer,
  type OrganModel,
  type OrganViewerProps,
} from "@/components/organ-viewer"

// Structures the disease leaves alone keep one muted tone, so the affected
// parts read first without a severity colour.
const SPARED = "#a9a59c"

// What autoimmune hepatitis does to each structure of the liver lobule.
// Structures not listed are spared and keep their anatomical description.
const findings: Record<
  string,
  { label?: string; description: string; affected: boolean }
> = {
  "portal-tract-stroma": {
    label: "Portal tracts",
    affected: true,
    description:
      "A dense infiltrate of lymphocytes and plasma cells fills the portal tracts. With interface hepatitis it is the histological hallmark, and fibrosis starts here, later bridging between tracts towards cirrhosis.",
  },
  "limiting-plate": {
    affected: true,
    description:
      "Interface hepatitis: the infiltrate breaks through the limiting plate and destroys the hepatocytes along it, the injury once called piecemeal necrosis.",
  },
  "periportal-hepatocytes": {
    affected: true,
    description:
      "Injured hepatocytes regenerate as rosettes, and lymphocytes can be seen inside them (emperipolesis). Plasma cells cluster among them.",
  },
  "midzonal-hepatocytes": {
    affected: false,
    description:
      "Usually spared. In severe disease, bridging necrosis crosses this zone to link portal tracts with central veins.",
  },
  "centrilobular-hepatocytes": {
    affected: false,
    description:
      "Spared in typical chronic disease. An acute severe onset can show centrilobular necrosis, sometimes as the only finding.",
  },
  "central-vein": {
    affected: false,
    description:
      "Usually spared. Inflammation around it (central perivenulitis) is seen in some acute presentations.",
  },
  "bile-ducts": {
    affected: false,
    description:
      "Usually spared. Duct injury on biopsy, or strictures on cholangiography, suggest an overlap with primary biliary cholangitis or primary sclerosing cholangitis.",
  },
}

// The liver lobule with autoimmune hepatitis mapped onto its structures: the
// same GLB, views and credit, regrouped into affected and spared parts, the
// affected ones listed first.
export const autoimmuneHepatitisModel: OrganModel = {
  ...liverLobuleModel,
  name: "Autoimmune hepatitis",
  structures: liverLobuleModel.structures
    .map((structure) => {
      const finding = findings[structure.id]
      return {
        ...structure,
        label: finding?.label ?? structure.label,
        group: finding?.affected ? "Affected" : "Spared",
        color: finding?.affected ? structure.color : SPARED,
        description: finding?.description ?? structure.description,
      }
    })
    .sort(
      (a, b) => Number(b.group === "Affected") - Number(a.group === "Affected")
    ),
}

export type AutoimmuneHepatitisProps = Omit<OrganViewerProps, "model">

export function AutoimmuneHepatitis(props: AutoimmuneHepatitisProps) {
  return <OrganViewer model={autoimmuneHepatitisModel} {...props} />
}
