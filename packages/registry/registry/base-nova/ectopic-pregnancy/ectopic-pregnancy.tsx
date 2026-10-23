import { diseaseModel, type Disease } from "@/components/disease-model"
import {
  DiseaseViewer,
  type DiseaseViewerProps,
} from "@/components/disease-viewer"
import { uterusModel } from "@/components/uterus"

// A tubal ectopic pregnancy in the ampulla, the commonest site: the tube
// cannot stretch, and when it ruptures the bleeding can kill.
export const ectopicPregnancy: Disease = {
  name: "Ectopic pregnancy",
  code: "O00.1",
  summary:
    "The embryo implants outside the uterine cavity, almost always in a uterine tube. It cannot survive there, and a tube that ruptures bleeds into the abdomen.",
  scales: [
    {
      id: "uterus",
      label: "Uterus and tubes",
      model: uterusModel,
      findings: {
        ampulla: {
          affected: true,
          description:
            "The embryo implants in the ampulla of one tube, where most ectopics occur; the model marks both tubes' ampullae. Previous pelvic infection or tubal surgery raises the risk by damaging the tube's cilia, and IVF and smoking raise it too.",
        },
        body: {
          affected: false,
          description:
            "The lining thickens under pregnancy hormones, but the cavity is empty on a transvaginal scan when hCG is high enough to see a pregnancy.",
        },
        "right-ovary": {
          affected: false,
          description:
            "Holds the corpus luteum that sustains the early pregnancy; it is not the site of implantation.",
        },
        isthmus: {
          affected: false,
          description:
            "The narrow part nearest the uterus. Pregnancies here rupture earlier, because the tube is narrower.",
        },
        mesosalpinx: {
          affected: false,
          description:
            "The fold of broad ligament carrying the tube's blood supply, intact while the tube holds.",
        },
      },
    },
  ],
  stages: [
    {
      id: "unruptured",
      label: "Unruptured",
      summary:
        "Six weeks of amenorrhoea, light bleeding and one-sided pain. A small, stable ectopic can be treated with methotrexate; otherwise the tube is removed.",
    },
    {
      id: "ruptured",
      label: "Ruptured",
      summary:
        "The tube bursts, usually at six to eight weeks: sudden severe pain, shoulder-tip pain from blood under the diaphragm, and collapse. Emergency surgery saves her.",
      findings: {
        uterus: {
          ampulla: {
            affected: true,
            description:
              "Torn open by the growing trophoblast. At laparoscopy the tube is removed (salpingectomy).",
          },
          mesosalpinx: {
            affected: true,
            description:
              "Its tubal branches of the uterine and ovarian arteries bleed into the pelvis (haemoperitoneum), which can fill with litres of blood.",
          },
        },
      },
      investigations: [
        { name: "Heart rate", result: "128 / min", flag: "high" },
        { name: "Blood pressure", result: "82/50 mmHg", flag: "low" },
        { name: "Haemoglobin", result: "78 g/L", flag: "low" },
        {
          name: "Ultrasound",
          result: "Free fluid in pelvis",
          flag: "abnormal",
        },
      ],
    },
  ],
  investigations: [
    { name: "Pregnancy test", result: "Positive" },
    { name: "hCG", result: "1,800 IU/L, slow rise", flag: "abnormal" },
    {
      name: "Transvaginal scan",
      result: "Empty uterus, adnexal mass",
      flag: "abnormal",
    },
    { name: "Haemoglobin", result: "Normal" },
  ],
}

/** The tube before it ruptures, the stage the viewer opens on. */
export const ectopicPregnancyModel = diseaseModel(ectopicPregnancy)

export type EctopicPregnancyProps = Omit<DiseaseViewerProps, "disease">

export function EctopicPregnancy(props: EctopicPregnancyProps) {
  return <DiseaseViewer disease={ectopicPregnancy} {...props} />
}
