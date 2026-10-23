import { liverModel } from "@/components/liver"
import { liverLobuleModel } from "@/components/liver-lobule"
import {
  OrganViewer,
  type OrganModel,
  type OrganViewerProps,
} from "@/components/organ-viewer"

// Structures the disease leaves alone keep one muted tone, so the affected
// parts read first without a severity colour.
const SPARED = "#a9a59c"

type Finding = { label?: string; description: string; affected: boolean }

// A base model with the disease mapped onto its structures: the same GLB,
// views and credit, regrouped into affected and spared parts, the affected
// ones listed first. Structures without a finding are spared and keep their
// anatomical description.
function withFindings(
  model: OrganModel,
  findings: Record<string, Finding>
): OrganModel {
  return {
    ...model,
    name: "Autoimmune hepatitis",
    structures: model.structures
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
        (a, b) =>
          Number(b.group === "Affected") - Number(a.group === "Affected")
      ),
  }
}

// The whole liver: what the disease does to the organ over time.
export const autoimmuneHepatitisModel = withFindings(liverModel, {
  liver: {
    label: "Hepatic parenchyma",
    affected: true,
    description:
      "The inflammation is diffuse, so the whole liver is involved; the lobule scale shows where it starts. Untreated, fibrosis bridges between portal tracts and ends in cirrhosis, which about a third of adults already have at diagnosis.",
  },
  portal: {
    affected: true,
    description:
      "Once cirrhosis develops, blood meets resistance through the liver and portal pressure rises, causing varices, ascites and an enlarged spleen.",
  },
  biliary: {
    affected: false,
    description:
      "The bile ducts are usually spared. Strictures on cholangiography suggest an overlap with primary sclerosing cholangitis.",
  },
  "hepatic-veins": {
    affected: false,
    description:
      "Not involved. Hepatic vein obstruction (Budd–Chiari syndrome) can look like acute hepatitis, so imaging excludes it.",
  },
})

// The liver lobule: where the injury happens under the microscope.
export const autoimmuneHepatitisLobuleModel = withFindings(liverLobuleModel, {
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
})

// Each scale is named after the item whose model it is drawn on.
const models = {
  liver: autoimmuneHepatitisModel,
  "liver-lobule": autoimmuneHepatitisLobuleModel,
}

export type AutoimmuneHepatitisProps = Omit<OrganViewerProps, "model"> & {
  /** The whole liver, or one liver lobule under the microscope. Defaults to "liver". */
  scale?: keyof typeof models
}

export function AutoimmuneHepatitis({
  scale = "liver",
  ...props
}: AutoimmuneHepatitisProps) {
  return <OrganViewer model={models[scale]} {...props} />
}
