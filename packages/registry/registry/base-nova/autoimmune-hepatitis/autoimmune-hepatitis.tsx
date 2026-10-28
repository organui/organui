import { conditionModel, type Condition } from "@/components/condition-model"
import {
  ConditionViewer,
  type ConditionViewerProps,
} from "@/components/condition-viewer"
import { liverModel } from "@/components/liver"
import { liverLobuleModel } from "@/components/liver-lobule"

// Autoimmune hepatitis on the whole liver, where its course shows, and on a
// liver lobule, where the injury happens under the microscope.
export const autoimmuneHepatitis: Condition = {
  name: "Autoimmune hepatitis",
  code: "K75.4",
  summary:
    "The immune system attacks hepatocytes. Portal inflammation spills into the lobule as interface hepatitis and, untreated, scars the liver towards cirrhosis.",
  scales: [
    {
      id: "liver",
      label: "Liver",
      model: liverModel,
      findings: {
        liver: {
          label: "Hepatic parenchyma",
          affected: true,
          description:
            "Inflammation is diffuse, so the whole liver is involved; switch to the lobule to see where it starts. The liver can be tender and enlarged, and a severe flare turns the skin yellow.",
        },
        portal: {
          affected: false,
          description:
            "Portal pressure stays normal until scarring makes blood flow through the liver harder.",
        },
        biliary: {
          affected: false,
          description:
            "The bile ducts are usually spared. Strictures on cholangiography suggest autoimmune hepatitis with features of primary sclerosing cholangitis.",
        },
        "hepatic-veins": {
          affected: false,
          description:
            "Not involved. Hepatic vein obstruction (Budd–Chiari syndrome) can look like acute hepatitis, so imaging excludes it.",
        },
      },
    },
    {
      id: "liver-lobule",
      label: "Lobule",
      model: liverLobuleModel,
      findings: {
        "portal-tract-stroma": {
          label: "Portal tracts",
          affected: true,
          description:
            "A dense infiltrate of lymphocytes and plasma cells fills the portal tracts, the histological hallmark with interface hepatitis.",
        },
        "limiting-plate": {
          affected: true,
          description:
            "Interface hepatitis: the infiltrate breaks through the limiting plate and destroys the hepatocytes along it, the injury once called piecemeal necrosis.",
        },
        "periportal-hepatocytes": {
          affected: true,
          description:
            "Injured hepatocytes regenerate as rosettes, and lymphocytes can be seen inside them (emperipolesis), though neither is specific.",
        },
        "midzonal-hepatocytes": {
          affected: false,
          description:
            "Spared while inflammation stays at the interface. Severe disease bridges across this zone.",
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
            "Usually spared. Duct injury on biopsy suggests autoimmune hepatitis with features of primary biliary or sclerosing cholangitis.",
        },
      },
    },
  ],
  stages: [
    {
      id: "active",
      label: "Active",
      time: "At onset",
      summary:
        "Interface hepatitis with high transaminases and IgG. Most people respond to steroids and azathioprine.",
    },
    {
      id: "fibrosis",
      label: "Fibrosis",
      time: "Months to years",
      summary:
        "Repeated injury lays down collagen that bridges portal tracts. Treatment can still reverse it.",
      findings: {
        liver: {
          liver: {
            label: "Hepatic parenchyma",
            affected: true,
            description:
              "Fibrous bands bridge the portal tracts. The liver often still looks normal on ultrasound; elastography shows it is stiffer.",
          },
        },
        "liver-lobule": {
          "midzonal-hepatocytes": {
            affected: true,
            description:
              "Bridging fibrosis and necrosis cross this zone, linking portal tracts to each other and to central veins.",
          },
        },
      },
      investigations: [
        { name: "ALT", result: "Raised", flag: "high" },
        { name: "IgG", result: "Raised", flag: "high" },
        { name: "Liver stiffness", result: "Increased", flag: "high" },
        { name: "Biopsy", result: "Bridging fibrosis", flag: "abnormal" },
      ],
    },
    {
      id: "cirrhosis",
      label: "Cirrhosis",
      time: "Years",
      summary:
        "Regenerative nodules replace the lobules and portal pressure rises. About a third of adults already have cirrhosis at diagnosis.",
      findings: {
        liver: {
          liver: {
            label: "Hepatic parenchyma",
            affected: true,
            description:
              "Shrunken and nodular, with an enlarged caudate lobe. Synthetic function falls: albumin drops and clotting slows.",
          },
          portal: {
            affected: true,
            description:
              "Blood meets resistance through the scarred liver and portal pressure rises, causing varices, ascites and an enlarged spleen.",
          },
        },
        "liver-lobule": {
          "midzonal-hepatocytes": {
            affected: true,
            description:
              "Fibrous septa run from portal tracts to central veins, cutting the lobule into regenerative nodules.",
          },
          "central-vein": {
            affected: true,
            description:
              "Septa reach the central vein, and the normal portal-to-central flow is lost.",
          },
          sinusoids: {
            affected: true,
            description:
              "The sinusoids lose their fenestrae and a basement membrane forms (capillarisation), raising resistance to flow.",
          },
        },
      },
      investigations: [
        { name: "Platelets", result: "Low", flag: "low" },
        { name: "Albumin", result: "Low", flag: "low" },
        { name: "INR", result: "Prolonged", flag: "high" },
        { name: "Ultrasound", result: "Nodular liver", flag: "abnormal" },
      ],
    },
  ],
  events: [
    {
      stage: "active",
      label: "Biopsy",
      description:
        "Confirms interface hepatitis, rules out other causes and stages any fibrosis before treatment starts.",
    },
    {
      stage: "active",
      label: "Steroids",
      time: "From diagnosis",
      description:
        "Prednisolone, or budesonide without cirrhosis, brings the inflammation down; azathioprine is added after about two weeks, once TPMT is checked, so the steroid can be tapered. The aim is a normal ALT and IgG within six months.",
    },
    {
      stage: "fibrosis",
      label: "Elastography",
      description:
        "Follows liver stiffness without repeating the biopsy, once treatment has calmed the inflammation, which falsely raises it. Fibrosis can regress while the disease stays in remission.",
    },
    {
      stage: "cirrhosis",
      label: "Screening",
      description:
        "An ultrasound every six months looks for liver cancer; an endoscopy looks for varices that could bleed, unless liver stiffness and platelets show they are unlikely.",
    },
    {
      stage: "cirrhosis",
      label: "Transplant",
      description:
        "For liver failure, or a severe flare that steroids do not control. The disease can come back in the new liver.",
    },
  ],
  investigations: [
    { name: "ALT", result: "5–10× upper limit", flag: "high" },
    { name: "IgG", result: "Raised", flag: "high" },
    { name: "ANA, anti-SMA", result: "Positive", flag: "abnormal" },
    { name: "Biopsy", result: "Interface hepatitis", flag: "abnormal" },
  ],
}

/** The liver in active disease, the scale and stage the viewer opens on. */
export const autoimmuneHepatitisModel = conditionModel(autoimmuneHepatitis)

export type AutoimmuneHepatitisProps = Omit<ConditionViewerProps, "condition">

export function AutoimmuneHepatitis(props: AutoimmuneHepatitisProps) {
  return <ConditionViewer condition={autoimmuneHepatitis} {...props} />
}
