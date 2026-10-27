import { diseaseModel, type Disease } from "@/components/disease-model"
import {
  DiseaseViewer,
  type DiseaseViewerProps,
} from "@/components/disease-viewer"
import { esophagusModel } from "@/components/esophagus"

// Adenocarcinoma of the lower oesophagus, now the commonest type in the UK:
// years of acid reflux turn the lining into Barrett's oesophagus, which can
// become dysplastic and then cancerous.
export const oesophagealCancer: Disease = {
  name: "Oesophageal cancer",
  code: "C15.5",
  summary:
    "An adenocarcinoma of the lower oesophagus, growing from Barrett's oesophagus after years of reflux, most often in older men who are overweight or smoke. Found early it can be removed through an endoscope; most are found late, when food sticks on the way down.",
  scales: [
    {
      id: "esophagus",
      label: "Oesophagus",
      model: esophagusModel,
      findings: {
        esophagus: {
          affected: true,
          description:
            "Its lower 5 cm are lined with salmon-pink, stomach-like cells instead of pale squamous lining: Barrett's oesophagus, a response to years of acid reflux. It causes no symptoms of its own.",
        },
        stomach: {
          affected: false,
          description:
            "Normal, though a hiatus hernia, the top of the stomach slipping up through the diaphragm, often lets acid reflux into the oesophagus.",
        },
        "left-gastric-artery": {
          affected: false,
          description:
            "Normal. The lymph nodes along it are among the first places cancer of the lower oesophagus spreads to.",
        },
        "descending-aorta": {
          affected: false,
          description:
            "Lies behind the oesophagus, separated from it by a plane of tissue.",
        },
        "recurrent-laryngeal-nerves": {
          affected: false,
          description:
            "Normal. Hoarseness would mean a tumour or nodes had reached the left nerve, beside the upper oesophagus.",
        },
        trachea: {
          affected: false,
          description:
            "Lies in front of the upper oesophagus, well above a cancer at its lower end.",
        },
      },
    },
  ],
  stages: [
    {
      id: "barretts",
      label: "Barrett's oesophagus",
      time: "Years of reflux",
      summary:
        "Heartburn for years, and Barrett's oesophagus found at endoscopy. A few people in a thousand with it develop cancer each year, so it is watched with endoscopies and biopsies.",
    },
    {
      id: "early",
      label: "Early cancer",
      time: "Years later",
      summary:
        "Found at a surveillance endoscopy, before any symptoms: a small nodule of cancer in the lining that has not reached the muscle. It can be cut out through the endoscope, with a good chance of cure.",
      findings: {
        esophagus: {
          esophagus: {
            affected: true,
            description:
              "A 1 cm raised nodule in the Barrett's segment, with high-grade dysplasia around it. The cancer is confined to the lining (T1a), where it rarely reaches lymph nodes.",
          },
        },
      },
      investigations: [
        { name: "Endoscopy", result: "1 cm nodule", flag: "abnormal" },
        { name: "Biopsy", result: "Adenocarcinoma", flag: "abnormal" },
        { name: "CT chest and abdomen", result: "No spread" },
      ],
    },
    {
      id: "locally-advanced",
      label: "Locally advanced",
      alternative: true,
      time: "Found late",
      summary:
        "Food sticks, solids first and then soft food, with weight loss: by the time swallowing is difficult, the cancer has usually grown through the wall. Chemotherapy, or chemoradiotherapy, then an oesophagectomy offers a cure to those fit for it.",
      findings: {
        esophagus: {
          esophagus: {
            affected: true,
            description:
              "A 5 cm ulcerated tumour narrows the lower oesophagus, grows through its muscle into the fat around it (T3) and reaches the stomach's opening.",
          },
          stomach: {
            affected: true,
            description:
              "The tumour crosses the junction into the top of the stomach, which an oesophagectomy removes with it.",
          },
          "left-gastric-artery": {
            affected: true,
            description:
              "Two lymph nodes along it contain cancer (N1). They are removed with the artery at surgery.",
          },
          "descending-aorta": {
            affected: false,
            description:
              "Still separated from the tumour. Invasion of the aorta would make it impossible to remove.",
          },
        },
      },
      investigations: [
        {
          name: "PET-CT",
          result: "Lower oesophageal mass, 2 nodes",
          flag: "abnormal",
        },
        { name: "Endoscopic ultrasound", result: "T3 N1", flag: "abnormal" },
        { name: "Haemoglobin", result: "102 g/L", flag: "low" },
        { name: "Albumin", result: "31 g/L", flag: "low" },
      ],
    },
  ],
  events: [
    {
      stage: "barretts",
      label: "Surveillance",
      time: "Every 2–5 years",
      description:
        "Endoscopy with biopsies from four quadrants every 2 cm along the segment, looking for dysplasia. Longer segments are checked more often. A proton pump inhibitor controls the reflux.",
    },
    {
      stage: "early",
      label: "Endoscopic resection",
      description:
        "The nodule is cut out whole through the endoscope, which also stages it. The rest of the Barrett's lining is then burned away with radiofrequency ablation, to lower the chance of new cancers growing from it. Endoscopic surveillance continues afterwards.",
    },
    {
      stage: "locally-advanced",
      label: "Urgent endoscopy",
      time: "Within 2 weeks",
      description:
        "Difficulty swallowing at any age needs an urgent endoscopy. CT, PET-CT and endoscopic ultrasound then stage it.",
    },
    {
      stage: "locally-advanced",
      label: "Chemotherapy",
      description:
        "Four cycles of FLOT before surgery and four after, or chemoradiotherapy before surgery, shrink the tumour and treat any spread too small to see.",
    },
    {
      stage: "locally-advanced",
      label: "Oesophagectomy",
      description:
        "Through the abdomen and right chest, the oesophagus and nodes are removed and the stomach is pulled up as a tube to replace it. A major operation, with a long recovery; afterwards meals are small and frequent.",
    },
  ],
  investigations: [
    {
      name: "Endoscopy",
      result: "5 cm salmon-pink segment",
      flag: "abnormal",
    },
    { name: "Biopsy", result: "Intestinal metaplasia", flag: "abnormal" },
    { name: "Dysplasia", result: "None" },
  ],
}

/** The oesophagus with Barrett's, the stage the viewer opens on. */
export const oesophagealCancerModel = diseaseModel(oesophagealCancer)

export type OesophagealCancerProps = Omit<DiseaseViewerProps, "disease">

export function OesophagealCancer(props: OesophagealCancerProps) {
  return <DiseaseViewer disease={oesophagealCancer} {...props} />
}
