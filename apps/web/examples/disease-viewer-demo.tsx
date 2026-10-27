import { heartModel } from "@workspace/registry/heart"
import type { Disease } from "@workspace/registry/disease-model"
import { DiseaseViewer } from "@workspace/registry/disease-viewer"

// Your own disease on any organ model: findings name its structures, and the
// rest are spared. Each stage changes only what it lists, and events mark the
// course's turning points on the timeline.
const hypertrophicCardiomyopathy: Disease = {
  name: "Hypertrophic cardiomyopathy",
  code: "I42.1",
  summary:
    "An inherited thickening of the heart muscle that stiffens the left ventricle and can obstruct the blood leaving it.",
  scales: [
    {
      id: "heart",
      label: "Heart",
      model: heartModel,
      findings: {
        "ventricular-wall": {
          affected: true,
          label: "Thickened ventricular wall",
          description:
            "The muscle thickens to 15 mm or more with no load to explain it, most at the septum.",
        },
        "left-ventricle": {
          affected: true,
          description:
            "The cavity is small and fills poorly; the thick septum narrows the way out to the aorta.",
        },
        "left-atrium": {
          affected: true,
          description:
            "Enlarges as it fills a stiff ventricle, and can go into atrial fibrillation.",
        },
        "left-coronary": {
          affected: false,
          description:
            "Usually normal: chest pain comes from thick muscle outgrowing its supply.",
        },
      },
    },
  ],
  stages: [
    {
      id: "silent",
      label: "Silent",
      time: "From adolescence",
      summary:
        "Often no symptoms: found on an ECG, an echo, or by screening the family of someone affected.",
    },
    {
      id: "symptomatic",
      label: "Symptomatic",
      time: "Adulthood",
      summary:
        "Breathlessness, chest pain or fainting on exertion, as the stiff ventricle fills poorly and the thick septum obstructs its outflow.",
      findings: {
        heart: {
          "left-atrium": {
            affected: true,
            description:
              "Enlarged, and often in atrial fibrillation. In this disease that means anticoagulation, whatever the usual stroke score.",
          },
        },
      },
      investigations: [
        { name: "Outflow gradient", result: "≥ 50 mmHg", flag: "high" },
        { name: "Holter", result: "Atrial fibrillation", flag: "abnormal" },
        { name: "NT-proBNP", result: "Raised", flag: "high" },
      ],
    },
    {
      id: "end-stage",
      label: "End-stage",
      time: "Decades, in about 5%",
      summary:
        "Scar replaces muscle: the wall thins, the ventricle dilates and the heart fails.",
      findings: {
        heart: {
          "ventricular-wall": {
            affected: true,
            label: "Scarred ventricular wall",
            description:
              "Scar replaces the thick muscle and the wall thins, so the outflow obstruction disappears.",
          },
          "left-ventricle": {
            affected: true,
            description:
              "Dilated and pumping poorly, with an ejection fraction under 50%.",
          },
        },
      },
      investigations: [
        { name: "Ejection fraction", result: "< 50%", flag: "low" },
        { name: "Cardiac MRI", result: "Extensive scar", flag: "abnormal" },
        { name: "NT-proBNP", result: "High", flag: "high" },
      ],
    },
  ],
  events: [
    {
      stage: "silent",
      label: "Family screening",
      description:
        "First-degree relatives have an ECG and an echo, and a genetic test when a disease-causing variant is known.",
    },
    {
      stage: "symptomatic",
      label: "Risk score",
      description:
        "The HCM Risk-SCD score estimates the five-year risk of sudden death and decides who needs a defibrillator (ICD).",
    },
    {
      stage: "symptomatic",
      label: "Treatment",
      description:
        "Beta blockers first. Obstruction that persists is relieved by mavacamten, or by septal myectomy or alcohol ablation.",
    },
    {
      stage: "end-stage",
      label: "Transplant",
      description:
        "Heart failure treatment, then assessment for a transplant when it no longer helps.",
    },
  ],
  investigations: [
    { name: "ECG", result: "Left ventricular hypertrophy", flag: "abnormal" },
    { name: "Septal thickness", result: "≥ 15 mm", flag: "high" },
    { name: "Outflow gradient", result: "≥ 30 mmHg", flag: "high" },
  ],
}

export function Example() {
  return (
    <DiseaseViewer
      disease={hypertrophicCardiomyopathy}
      label="Hypertrophic cardiomyopathy in the disease viewer"
    />
  )
}
