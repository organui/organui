import { diseaseModel, type Disease } from "@/components/disease-model"
import {
  DiseaseViewer,
  type DiseaseViewerProps,
} from "@/components/disease-viewer"
import { skinModel } from "@/components/skin"

// Melanoma staged by depth: the deeper the tumour reaches through the
// layers of the skin, measured as Breslow thickness, the worse the outlook.
export const melanoma: Disease = {
  name: "Melanoma",
  code: "C43",
  summary:
    "A cancer of melanocytes, the pigment cells at the base of the epidermis. For a melanoma that has not spread, how deep it has grown, its Breslow thickness, predicts survival best.",
  scales: [
    {
      id: "skin",
      label: "Skin",
      model: skinModel,
      defaultView: "Cross-section",
      findings: {
        epidermis: {
          affected: true,
          description:
            "Atypical melanocytes spread sideways along the basal layer (radial growth). The mole is asymmetric, with an irregular border, mixed colours, a diameter over 6 mm and recent change (ABCDE).",
        },
        "papillary-dermis": {
          affected: false,
          description:
            "The basement membrane is intact, so the tumour has no access to vessels: melanoma in situ, cured by excision.",
        },
        "reticular-dermis": {
          affected: false,
          description: "Not reached.",
        },
        veins: {
          affected: false,
          description:
            "Not reached. Spread through lymphatics and veins comes with depth.",
        },
        "hair-follicle": {
          affected: false,
          description:
            "Melanoma in situ can track down follicles, which is why excision margins go below them.",
        },
      },
    },
  ],
  stages: [
    {
      id: "in-situ",
      label: "In situ",
      summary:
        "Confined to the epidermis, so not yet invasive, and coded D03 rather than C43. Wide local excision with a 5 mm margin cures it.",
    },
    {
      id: "thin",
      label: "Thin",
      summary:
        "Breslow thickness up to 1 mm: it has crossed into the papillary dermis and started growing down. Five-year survival is about 99%.",
      findings: {
        skin: {
          "papillary-dermis": {
            affected: true,
            description:
              "Melanoma cells have crossed the basement membrane into the papillary dermis, so it is now invasive. Excised with a 1 cm margin.",
          },
        },
      },
      investigations: [
        { name: "Breslow thickness", result: "0.6 mm" },
        { name: "Ulceration", result: "Absent" },
        { name: "Stage", result: "IA" },
      ],
    },
    {
      id: "thick",
      label: "Thick",
      summary:
        "Breslow thickness over 2 mm, into the reticular dermis. A sentinel node biopsy finds out whether it has reached the lymph nodes. At stage IIB, adjuvant immunotherapy is offered after surgery.",
      findings: {
        skin: {
          "papillary-dermis": {
            affected: true,
            description: "Filled and expanded by tumour.",
          },
          "reticular-dermis": {
            affected: true,
            description:
              "Invaded deep among the collagen bundles, near the lymphatics and vessels that carry it to the nodes. Excised with a 2 cm margin.",
          },
        },
      },
      investigations: [
        { name: "Breslow thickness", result: "2.8 mm", flag: "abnormal" },
        { name: "Ulceration", result: "Present", flag: "abnormal" },
        { name: "Sentinel node", result: "Negative" },
        { name: "Stage", result: "IIB" },
      ],
    },
    {
      id: "metastatic",
      label: "Metastatic",
      summary:
        "Through the dermis into fat and vessels, and spread to distant organs, most often the lungs, liver and brain. Immunotherapy has transformed survival.",
      findings: {
        skin: {
          "papillary-dermis": {
            affected: true,
            description: "Replaced by tumour.",
          },
          "reticular-dermis": {
            affected: true,
            description: "Invaded through its full thickness.",
          },
          hypodermis: {
            affected: true,
            description: "Reached: the tumour grows into the subcutaneous fat.",
          },
          veins: {
            affected: true,
            description:
              "Invaded by tumour (lymphovascular invasion), the route to distant metastases.",
          },
        },
      },
      investigations: [
        { name: "Breslow thickness", result: "5.5 mm", flag: "abnormal" },
        { name: "LDH", result: "Raised", flag: "high" },
        { name: "PET-CT", result: "Lung metastases", flag: "abnormal" },
        { name: "BRAF V600E", result: "Mutated", flag: "abnormal" },
      ],
    },
  ],
  events: [
    {
      stage: "in-situ",
      label: "Dermoscopy",
      description:
        "Asymmetry, an irregular border, several colours, a diameter over 6 mm or change over time raise suspicion; a dermatoscope looks closer.",
    },
    {
      stage: "in-situ",
      label: "Excision biopsy",
      description:
        "Removes the whole lesion with a 2 mm margin so the pathologist can measure the Breslow thickness, which sets the wider excision.",
    },
    {
      stage: "thick",
      label: "Sentinel node",
      description:
        "The first lymph node draining the site is removed and examined, to stage the disease and guide treatment after surgery.",
    },
    {
      stage: "metastatic",
      label: "Systemic therapy",
      description:
        "Checkpoint inhibitor immunotherapy first, even when the tumour carries a BRAF mutation. BRAF and MEK inhibitors act faster and are kept for rapid, symptomatic disease or later lines.",
    },
  ],
  investigations: [
    { name: "Dermoscopy", result: "Atypical network", flag: "abnormal" },
    { name: "Excision biopsy", result: "Melanoma in situ", flag: "abnormal" },
    { name: "Breslow thickness", result: "Not invasive" },
  ],
}

/** The skin with melanoma in situ, the stage the viewer opens on. */
export const melanomaModel = diseaseModel(melanoma)

export type MelanomaProps = Omit<DiseaseViewerProps, "disease">

export function Melanoma(props: MelanomaProps) {
  return <DiseaseViewer disease={melanoma} {...props} />
}
