import { diseaseModel, type Disease } from "@/components/disease-model"
import {
  DiseaseViewer,
  type DiseaseViewerProps,
} from "@/components/disease-viewer"
import { breastModel } from "@/components/breast"

// Breast cancer in the upper outer quadrant of the left breast, where most
// arise because most of the gland is there, from cells still inside the
// ducts to a tumour that tethers the skin and nipple.
export const breastCancer: Disease = {
  name: "Breast cancer",
  code: "C50.4",
  summary:
    "The commonest cancer in women. Most arise in the cells lining the terminal ducts and lobules; caught early by screening or a lump, most are cured.",
  scales: [
    {
      id: "breast",
      label: "Breasts",
      model: breastModel,
      // The fat surrounds the lobes, so it is drawn see-through.
      translucentIds: ["left-fat", "right-fat"],
      findings: {
        "left-mammary-lobes": {
          affected: true,
          label: "Left lobes, upper outer quadrant",
          description:
            "Malignant cells fill the ducts of a lobe but have not broken through their basement membrane: ductal carcinoma in situ. It cannot spread yet, and often shows as microcalcifications on a mammogram rather than a lump.",
        },
        "left-main-lactiferous-ducts": {
          affected: false,
          description:
            "Clear. A blood-stained discharge from a single duct would need imaging.",
        },
        "left-suspensory-ligaments": {
          affected: false,
          description: "Not involved: the skin over the breast moves freely.",
        },
        "left-nipple": {
          affected: false,
          description:
            "Normal. A new inversion, or an eczema-like rash starting on the nipple (Paget's disease), can be the first sign of cancer beneath.",
        },
        "left-fat": {
          affected: false,
          description: "Not invaded.",
        },
        "right-mammary-lobes": {
          affected: false,
          description:
            "Normal, but checked by mammography each year for five years after treatment, as the risk of a new cancer in the other breast is raised.",
        },
      },
    },
  ],
  stages: [
    {
      id: "in-situ",
      label: "In situ",
      time: "Screen-detected",
      summary:
        "Ductal carcinoma in situ: microcalcifications on a screening mammogram, with no lump. Coded D05.1 rather than C50. It is removed with clear margins; radiotherapy after breast-conserving surgery halves the chance of it returning. Untreated, some becomes invasive.",
    },
    {
      id: "early",
      label: "Early invasive",
      time: "Months to years",
      summary:
        "Invasive breast cancer of no special type (ductal): a hard, painless lump under 5 cm with no spread beyond the armpit. Surgery and the treatments matched to its receptors cure most.",
      findings: {
        breast: {
          "left-mammary-lobes": {
            affected: true,
            label: "Left lobes, upper outer quadrant",
            description:
              "A 2 cm hard, irregular, painless lump: the cancer has broken through the basement membrane and spreads first along lymphatics towards the armpit.",
          },
          "left-fat": {
            affected: true,
            description:
              "Invaded by strands of tumour and scar-like tissue radiating from it, which give the spiculated shape on a mammogram.",
          },
        },
      },
      investigations: [
        { name: "Mammogram", result: "Spiculated mass", flag: "abnormal" },
        {
          name: "Core biopsy",
          result: "Invasive carcinoma NST, grade 2",
          flag: "abnormal",
        },
        { name: "ER and PR", result: "Positive" },
        { name: "HER2", result: "Negative" },
      ],
    },
    {
      id: "locally-advanced",
      label: "Locally advanced",
      time: "Untreated, months",
      summary:
        "A tumour over 5 cm with nodes, one that has invaded the chest wall or skin (ulceration, nodules, peau d'orange), or fixed or matted nodes in the armpit. Treatment starts with chemotherapy or hormone therapy to shrink it, then surgery and radiotherapy.",
      findings: {
        breast: {
          "left-mammary-lobes": {
            affected: true,
            label: "Left lobes, upper outer quadrant",
            description:
              "A 6 cm mass fixed to the tissues around it, with spread to the axillary nodes.",
          },
          "left-fat": {
            affected: true,
            description:
              "Invaded by tumour. Above it, tumour blocks the lymphatics of the skin, which swells but stays tethered at the hair follicles: orange-peel skin (peau d'orange).",
          },
          "left-suspensory-ligaments": {
            affected: true,
            description:
              "Invaded and shortened by the tumour, so they pull the skin in: dimpling, best seen with the arms raised.",
          },
          "left-main-lactiferous-ducts": {
            affected: true,
            description:
              "Infiltrated and shortened as the tumour spreads towards the areola, so they pull the nipple in.",
          },
          "left-nipple": {
            affected: true,
            description:
              "Retracted towards the tumour. A new nipple inversion on one side needs urgent assessment.",
          },
        },
      },
      investigations: [
        {
          name: "Ultrasound axilla",
          result: "Abnormal nodes",
          flag: "abnormal",
        },
        {
          name: "Node biopsy",
          result: "Metastatic carcinoma",
          flag: "abnormal",
        },
        { name: "CT staging", result: "No distant spread" },
        { name: "ER and PR", result: "Positive" },
      ],
    },
  ],
  events: [
    {
      stage: "in-situ",
      label: "Screening",
      description:
        "In the UK, a mammogram every three years from 50 up to the 71st birthday; it finds cancers too small to feel, and also some that would never have caused harm.",
    },
    {
      stage: "in-situ",
      label: "Triple assessment",
      description:
        "Examination, imaging and a needle biopsy, at one visit; a vacuum biopsy samples the calcifications.",
    },
    {
      stage: "in-situ",
      label: "Excision",
      description:
        "Wide local excision with clear margins, then radiotherapy; a mastectomy if the DCIS is widespread.",
    },
    {
      stage: "early",
      label: "Surgery",
      description:
        "Wide local excision with radiotherapy, or mastectomy, with a sentinel node biopsy from the armpit to stage it.",
    },
    {
      stage: "early",
      label: "Endocrine therapy",
      time: "5–10 years",
      description:
        "For hormone receptor-positive cancer: tamoxifen before the menopause, or an aromatase inhibitor after; this cuts the risk of dying from breast cancer by about a third. Chemotherapy is added when the risk is high, guided by a gene test such as Oncotype DX.",
    },
    {
      stage: "locally-advanced",
      label: "Neoadjuvant therapy",
      description:
        "Chemotherapy before surgery, with trastuzumab and pertuzumab for HER2-positive disease or pembrolizumab for triple-negative, to shrink the tumour and the nodes; how well it responds guides what follows.",
    },
  ],
  investigations: [
    {
      name: "Mammogram",
      result: "Clustered microcalcifications",
      flag: "abnormal",
    },
    {
      name: "Vacuum biopsy",
      result: "High-grade DCIS",
      flag: "abnormal",
    },
    { name: "Ultrasound", result: "No mass" },
  ],
}

/** The breasts with ductal carcinoma in situ, the stage the viewer opens on. */
export const breastCancerModel = diseaseModel(breastCancer)

export type BreastCancerProps = Omit<DiseaseViewerProps, "disease">

export function BreastCancer(props: BreastCancerProps) {
  return <DiseaseViewer disease={breastCancer} {...props} />
}
