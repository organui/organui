import { conditionModel, type Condition } from "@/components/condition-model"
import {
  ConditionViewer,
  type ConditionViewerProps,
} from "@/components/condition-viewer"
import { uterusModel } from "@/components/uterus"

// A tubal ectopic pregnancy in the ampulla, the commonest site: the tube
// cannot stretch, and when it ruptures the bleeding can kill.
export const ectopicPregnancy: Condition = {
  name: "Ectopic pregnancy",
  code: "O00.1",
  summary:
    "The embryo implants outside the uterine cavity, in about 95% of cases in a uterine tube. It cannot survive there, and a tube that ruptures bleeds into the abdomen.",
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
      time: "Around 6 weeks",
      summary:
        "Six weeks of amenorrhoea, light bleeding and one-sided pain. A small, stable ectopic with a falling hCG can be watched or treated with methotrexate; otherwise surgery removes the tube.",
    },
    {
      id: "ruptured",
      label: "Ruptured",
      time: "Weeks 6–10",
      summary:
        "The tube bursts: sudden severe pain, shoulder-tip pain from blood under the diaphragm, and collapse. Emergency surgery saves her.",
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
              "Its tubal branches of the uterine and ovarian arteries bleed into the peritoneal cavity (haemoperitoneum), which can hold litres of blood.",
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
  events: [
    {
      stage: "unruptured",
      label: "hCG and scan",
      description:
        "A transvaginal scan shows a mass beside the ovary and no pregnancy in the uterus. If nothing is seen, it is a pregnancy of unknown location, and hCG 48 hours apart guides what to do.",
    },
    {
      stage: "unruptured",
      label: "Methotrexate",
      description:
        "A single injection for an unruptured ectopic under 35 mm with no heartbeat and an hCG under 1,500 IU/L; hCG is followed until it is negative.",
    },
    {
      stage: "ruptured",
      label: "Surgery",
      time: "Immediately",
      description:
        "Resuscitation, then laparoscopy, or laparotomy if she is shocked, removes the tube and stops the bleeding; anti-D is given if she is rhesus negative.",
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
export const ectopicPregnancyModel = conditionModel(ectopicPregnancy)

export type EctopicPregnancyProps = Omit<ConditionViewerProps, "condition">

export function EctopicPregnancy(props: EctopicPregnancyProps) {
  return <ConditionViewer condition={ectopicPregnancy} {...props} />
}
