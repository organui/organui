import { diseaseModel, type Disease } from "@/components/disease-model"
import {
  DiseaseViewer,
  type DiseaseViewerProps,
} from "@/components/disease-viewer"
import { vesselsModel } from "@/components/vessels"

// An infrarenal abdominal aortic aneurysm, the commonest kind: silent while it
// grows, so it is found by screening or by chance, and its size decides when
// the risk of rupture outweighs the risk of repair.
export const abdominalAorticAneurysm: Disease = {
  name: "Abdominal aortic aneurysm",
  code: "I71.4",
  summary:
    "A permanent widening of the abdominal aorta to 3 cm or more, most often below the kidneys, in older men who smoke. It grows silently, often slowly, and is repaired once the risk of rupture is high.",
  scales: [
    {
      id: "vessels",
      label: "Blood vessels",
      model: vesselsModel,
      defaultView: "Abdomen and pelvis",
      findings: {
        "descending-aorta": {
          affected: true,
          label: "Abdominal aorta",
          description:
            "Below the renal arteries the wall has weakened as elastin and smooth muscle break down, and the aorta has widened to 4.2 cm. A pulsatile, expansile mass may be felt above the navel, but most cause no symptoms.",
        },
        "renal-arteries": {
          affected: false,
          description:
            "Arise from normal aorta above the aneurysm. The length of healthy neck below them decides whether a stent graft can seal there.",
        },
        "common-iliac-arteries": {
          affected: false,
          description:
            "Normal here, though the aneurysm often extends into them, and they carry the stent graft's legs.",
        },
        "inferior-mesenteric-artery": {
          affected: false,
          description:
            "Arises from the front of the aneurysm. A repair covers or ties it, and the left colon then relies on its other supply.",
        },
        "superior-mesenteric-artery": {
          affected: false,
          description: "Arises from normal aorta above the aneurysm.",
        },
        "inferior-vena-cava": {
          affected: false,
          description:
            "Lies to the right of the aorta, close to it but not involved.",
        },
        "popliteal-arteries": {
          affected: false,
          description:
            "Normal here. About one in ten people with an aortic aneurysm also has a popliteal one, so both knees are examined.",
        },
      },
    },
  ],
  stages: [
    {
      id: "small",
      label: "Small",
      time: "Years",
      summary:
        "From 3.0 to 5.4 cm, growing a few millimetres a year. Found by screening or on a scan for something else. Watched with ultrasound, as repair carries more risk than rupture at this size; stopping smoking slows growth.",
    },
    {
      id: "large",
      label: "Large",
      time: "Years later",
      summary:
        "At 5.5 cm or more (5.0 cm in women) the risk of rupture outweighs the risk of repair, as it does for one over 4 cm growing more than 1 cm a year, or one causing symptoms. Repaired with a stent graft or open surgery.",
      findings: {
        vessels: {
          "descending-aorta": {
            affected: true,
            label: "Abdominal aorta",
            description:
              "Widened to 5.8 cm, lined with layered clot that leaves a channel for flow. Tenderness or back pain means it may be about to rupture and needs same-day review.",
          },
          "common-iliac-arteries": {
            affected: true,
            description:
              "Dilated to 2 cm where the aneurysm continues into them. The stent graft's legs can still seal here, with wider flared ends.",
          },
        },
      },
      investigations: [
        { name: "CT angiogram", result: "5.8 cm aneurysm", flag: "abnormal" },
        { name: "Infrarenal neck", result: "18 mm long" },
        { name: "eGFR", result: "62 mL/min", flag: "low" },
        { name: "Echo", result: "Normal function" },
      ],
    },
    {
      id: "ruptured",
      label: "Ruptured",
      alternative: true,
      time: "Without repair",
      summary:
        "Sudden abdominal or back pain and collapse, sometimes with a pulsatile mass. About 8 in 10 die, many before reaching hospital; the rest need repair within hours. Rupture is rare below 5.5 cm.",
      findings: {
        vessels: {
          "descending-aorta": {
            affected: true,
            label: "Abdominal aorta",
            description:
              "Ruptured through its back wall into the retroperitoneum, where the surrounding tissue briefly contains the bleeding. A rupture into the free abdomen is rapidly fatal.",
          },
          "inferior-vena-cava": {
            affected: false,
            description:
              "Squeezed by the blood around it. Rarely the aneurysm ruptures into it, an aortocaval fistula.",
          },
        },
      },
      investigations: [
        { name: "Blood pressure", result: "78/40 mmHg", flag: "low" },
        { name: "Haemoglobin", result: "84 g/L", flag: "low" },
        { name: "Lactate", result: "5.2 mmol/L", flag: "high" },
        {
          name: "CT angiogram",
          result: "Retroperitoneal haematoma",
          flag: "abnormal",
        },
      ],
    },
  ],
  events: [
    {
      stage: "small",
      label: "Screening",
      time: "Men at 65",
      description:
        "In the UK, a single ultrasound of the aorta for men in the year they turn 65, which halves deaths from rupture.",
    },
    {
      stage: "small",
      label: "Surveillance",
      description:
        "Ultrasound every year from 3.0 to 4.4 cm and every three months from 4.5 to 5.4 cm, with help to stop smoking, a statin, blood pressure control and usually aspirin, for the heart risk that comes with it.",
    },
    {
      stage: "large",
      label: "Referral",
      time: "Within 2 weeks",
      description:
        "To a vascular service, which assesses fitness for surgery and plans the repair on a CT angiogram.",
    },
    {
      stage: "large",
      label: "Repair",
      description:
        "Open repair replaces the aneurysm with a graft; a stent graft (EVAR) placed through the groin is easier to recover from but needs lifelong scans to check it stays sealed.",
    },
    {
      stage: "ruptured",
      label: "Emergency repair",
      description:
        "Straight to theatre, giving only enough fluid to keep the patient conscious until the aorta is clamped or sealed. EVAR is preferred when the anatomy allows.",
    },
  ],
  investigations: [
    { name: "Ultrasound aorta", result: "4.2 cm", flag: "high" },
    { name: "Blood pressure", result: "152/88 mmHg", flag: "high" },
    { name: "Smoking", result: "Current", flag: "abnormal" },
  ],
}

/** The vessels with a small aneurysm, the stage the viewer opens on. */
export const abdominalAorticAneurysmModel = diseaseModel(
  abdominalAorticAneurysm
)

export type AbdominalAorticAneurysmProps = Omit<DiseaseViewerProps, "disease">

export function AbdominalAorticAneurysm(props: AbdominalAorticAneurysmProps) {
  return <DiseaseViewer disease={abdominalAorticAneurysm} {...props} />
}
