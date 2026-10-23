import { diseaseModel, type Disease } from "@/components/disease-model"
import {
  DiseaseViewer,
  type DiseaseViewerProps,
} from "@/components/disease-viewer"
import { lymphModel } from "@/components/lymph"

// Classical Hodgkin lymphoma of the nodular sclerosis type, the commonest in
// young adults: a few malignant cells rebuild a whole lymph node around them.
export const hodgkinLymphoma: Disease = {
  name: "Hodgkin lymphoma",
  code: "C81.1",
  summary:
    "A lymphoma in which scattered Reed–Sternberg cells draw in a crowd of normal immune cells. It spreads from one node group to the next and is usually curable.",
  scales: [
    {
      id: "lymph",
      label: "Lymph node",
      model: lymphModel,
      findings: {
        capsule: {
          affected: true,
          description:
            "Thickened, with bands of collagen running in from it that divide the node into nodules: nodular sclerosis, the type seen most in young adults.",
        },
        follicles: {
          affected: true,
          description:
            "Wiped out: the normal follicles are replaced by nodules of tumour and inflammatory cells (effacement).",
        },
        paracortex: {
          affected: true,
          description:
            "Lacunar cells, the nodular sclerosis form of the Reed–Sternberg cell (CD15 and CD30 positive), sit in clear spaces among lymphocytes, eosinophils and histiocytes, with occasional classic owl-eyed cells. They are under 1% of the cells.",
        },
        medulla: {
          affected: true,
          description:
            "Overrun as the nodules expand. The node is rubbery and painless, classically in the neck; it can hurt after drinking alcohol.",
        },
        "afferent-vessels": {
          affected: false,
          description:
            "Still carry lymph in. The disease spreads to the next node group along the lymphatics in order, unlike non-Hodgkin lymphoma.",
        },
        "blood-vessels": {
          affected: false,
          description:
            "Not invaded. Spread through the blood to the liver or bone marrow comes late (stage IV).",
        },
      },
    },
  ],
  stages: [
    {
      id: "active",
      label: "Active",
      summary:
        "A painless neck node, sometimes with fever, night sweats and weight loss (B symptoms). Biopsy and PET-CT give the type and the stage.",
    },
    {
      id: "remission",
      label: "Remission",
      summary:
        "After chemotherapy such as ABVD, with or without radiotherapy. Most people are cured; follow-up watches for late effects of treatment.",
      findings: {
        lymph: {
          capsule: {
            affected: true,
            description:
              "Scar tissue can leave a residual mass that is inactive on PET, which needs no further treatment.",
          },
          follicles: {
            affected: false,
            description: "Normal architecture returns as the tumour clears.",
          },
          paracortex: {
            affected: false,
            description: "No Reed–Sternberg cells remain.",
          },
          medulla: {
            affected: false,
            description: "Normal again.",
          },
        },
      },
      investigations: [
        { name: "PET-CT", result: "Deauville 2" },
        { name: "ESR", result: "Normal" },
        { name: "Blood count", result: "Normal" },
      ],
    },
  ],
  investigations: [
    { name: "Node biopsy", result: "Reed–Sternberg cells", flag: "abnormal" },
    { name: "PET-CT", result: "Stage IIA", flag: "abnormal" },
    { name: "ESR", result: "Raised", flag: "high" },
    { name: "B symptoms", result: "None" },
  ],
}

/** The node in active disease, the stage the viewer opens on. */
export const hodgkinLymphomaModel = diseaseModel(hodgkinLymphoma)

export type HodgkinLymphomaProps = Omit<DiseaseViewerProps, "disease">

export function HodgkinLymphoma(props: HodgkinLymphomaProps) {
  return <DiseaseViewer disease={hodgkinLymphoma} {...props} />
}
