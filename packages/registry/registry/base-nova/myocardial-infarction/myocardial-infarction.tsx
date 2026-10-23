import { diseaseModel, type Disease } from "@/components/disease-model"
import {
  DiseaseViewer,
  type DiseaseViewerProps,
} from "@/components/disease-viewer"
import { heartModel } from "@/components/heart"

// An anterior ST-elevation myocardial infarction: the left anterior
// descending artery, a branch of the left coronary, blocks and the anterior
// wall and septum it supplies die and scar.
export const myocardialInfarction: Disease = {
  name: "Myocardial infarction",
  code: "I21.0",
  summary:
    "A clot on a ruptured plaque blocks a coronary artery and the heart muscle it supplies dies. Every minute until the artery is reopened costs muscle.",
  scales: [
    {
      id: "heart",
      label: "Heart",
      model: heartModel,
      findings: {
        "left-coronary": {
          label: "Left coronary artery (LAD)",
          affected: true,
          description:
            "The culprit is its left anterior descending (LAD) branch: a cholesterol plaque ruptures and a clot forms on it, blocking the artery. Emergency angioplasty (PCI) reopens it with a stent.",
        },
        "ventricular-wall": {
          affected: true,
          description:
            "The anterior wall and septum, which the LAD supplies. Starved of oxygen, the muscle stops contracting within a minute. Cells start to die after about 20 minutes, from the inner layer outwards, so reperfusion within hours saves the outer wall.",
        },
        "left-ventricle": {
          affected: true,
          description:
            "With part of its wall still, the left ventricle empties less with each beat. A large infarct causes cardiogenic shock.",
        },
        "right-coronary": {
          affected: false,
          description:
            "Supplies the inferior wall and is patent here; its occlusion causes an inferior infarction instead.",
        },
        "right-ventricle": {
          affected: false,
          description:
            "Spared in anterior infarction. Right ventricular infarction comes with a proximal right coronary occlusion.",
        },
        "ascending-aorta": {
          affected: false,
          description:
            "Not involved. An aortic dissection can mimic infarction and must be excluded before clot-busting drugs.",
        },
      },
    },
  ],
  stages: [
    {
      id: "occlusion",
      label: "Occlusion",
      summary:
        "The first hours. ST elevation on the ECG means the artery is blocked; reopen it with PCI within 120 minutes of diagnosis.",
    },
    {
      id: "acute",
      label: "Acute",
      summary:
        "Days 1 to 7. Dead muscle is soft while white cells clear it, and the wall is weakest from day 3 to day 7.",
      findings: {
        heart: {
          "left-coronary": {
            label: "Left coronary artery (LAD)",
            affected: true,
            description:
              "Opened and stented. Two antiplatelet drugs stop a clot forming on the new stent.",
          },
          "ventricular-wall": {
            affected: true,
            description:
              "In the infarcted anterior wall and septum, neutrophils, then macrophages, clear the dead muscle. Rarely the softened wall or septum ruptures, most often between days 3 and 7.",
          },
          "left-ventricle": {
            affected: true,
            description:
              "The still wall lets a clot form at the apex, which can embolise, and arrhythmias are common in the first days.",
          },
        },
      },
      investigations: [
        { name: "Troponin", result: "Peaks", flag: "high" },
        { name: "ECG", result: "Q waves forming", flag: "abnormal" },
        { name: "Echo", result: "Anterior akinesia", flag: "abnormal" },
        { name: "LV ejection fraction", result: "Reduced", flag: "low" },
      ],
    },
    {
      id: "healed",
      label: "Healed",
      summary:
        "From about six weeks. Collagen scar has replaced the muscle; treatment protects the rest of the heart and prevents the next event.",
      findings: {
        heart: {
          "left-coronary": {
            label: "Left coronary artery (LAD)",
            affected: true,
            description:
              "Stented. Statins, antiplatelets and stopping smoking keep it and the other arteries open.",
          },
          "ventricular-wall": {
            affected: true,
            description:
              "The anterior wall and septum are now a thin collagen scar that does not contract. If it bulges with each beat it is a ventricular aneurysm.",
          },
          "left-ventricle": {
            affected: true,
            description:
              "Remodelling: the ventricle dilates to keep its output. ACE inhibitors and beta blockers limit it and heart failure.",
          },
        },
      },
      investigations: [
        { name: "Troponin", result: "Normal" },
        { name: "ECG", result: "Persistent Q waves", flag: "abnormal" },
        { name: "LV ejection fraction", result: "Reduced", flag: "low" },
        { name: "LDL cholesterol", result: "Target < 1.4 mmol/L" },
      ],
    },
  ],
  investigations: [
    { name: "ECG", result: "ST elevation V1–V4", flag: "abnormal" },
    { name: "Troponin", result: "Rising", flag: "high" },
    { name: "Echo", result: "Anterior hypokinesia", flag: "abnormal" },
    { name: "Angiogram", result: "LAD occluded", flag: "abnormal" },
  ],
}

/** The heart at occlusion, the stage the viewer opens on. */
export const myocardialInfarctionModel = diseaseModel(myocardialInfarction)

export type MyocardialInfarctionProps = Omit<DiseaseViewerProps, "disease">

export function MyocardialInfarction(props: MyocardialInfarctionProps) {
  return <DiseaseViewer disease={myocardialInfarction} {...props} />
}
