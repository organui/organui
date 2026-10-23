import { heartModel } from "@workspace/registry/heart"
import type { Disease } from "@workspace/registry/disease-model"
import { DiseaseViewer } from "@workspace/registry/disease-viewer"

// Your own disease on any organ model: findings name its structures, and the
// rest are spared.
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
  investigations: [
    { name: "ECG", result: "Left ventricular hypertrophy", flag: "abnormal" },
    { name: "Septal thickness", result: "≥ 15 mm", flag: "high" },
    { name: "Outflow gradient", result: "≥ 30 mmHg", flag: "high" },
    { name: "NT-proBNP", result: "Raised", flag: "high" },
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
