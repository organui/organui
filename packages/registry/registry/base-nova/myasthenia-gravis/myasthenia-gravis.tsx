import { conditionModel, type Condition } from "@/components/condition-model"
import {
  ConditionViewer,
  type ConditionViewerProps,
} from "@/components/condition-viewer"
import { eyeModel } from "@/components/eye"
import { thymusModel } from "@/components/thymus"

const fatigable =
  "Weak, and weaker the longer it works: antibodies block and destroy the acetylcholine receptors where its nerve meets it, so fewer muscle fibres respond with each signal."

// Myasthenia gravis with a thymoma: antibodies against the acetylcholine
// receptor weaken the muscles that are used most, the eye muscles first,
// and the thymus where the immune attack is thought to start holds a tumour.
export const myastheniaGravis: Condition = {
  name: "Myasthenia gravis",
  code: "G70.0",
  summary:
    "An autoimmune disease of the junction between nerve and muscle, causing weakness that worsens with use and recovers with rest. It usually starts in the eyes. About one in ten has a thymoma, a tumour of the thymus.",
  scales: [
    {
      id: "eye",
      label: "Eye",
      model: eyeModel,
      defaultView: "Right lateral",
      findings: {
        "levator-palpebrae": {
          affected: true,
          description: `${fatigable} The upper lid droops, often on one side, and drops further during a minute of looking up.`,
        },
        "medial-rectus": {
          affected: true,
          description: `${fatigable} Double vision follows, worse at the end of the day, in a pattern that fits no single nerve.`,
        },
        "superior-rectus": {
          affected: true,
          description: fatigable,
        },
        iris: {
          affected: false,
          description:
            "Normal: the pupil muscles are not affected, which helps tell myasthenia from a third nerve palsy.",
        },
        "optic-nerve": {
          affected: false,
          description: "Normal. Vision itself is clear, only doubled.",
        },
      },
    },
    {
      id: "thymus",
      label: "Thymus",
      model: thymusModel,
      findings: {
        "left-lobe": {
          affected: true,
          description:
            "A 4 cm thymoma, an encapsulated tumour of the thymus's epithelial cells, seen on CT of the chest. Its cells are thought to train immune cells against the acetylcholine receptor.",
        },
        "right-lobe": {
          affected: false,
          description:
            "Normal for an adult: the thymus shrinks after puberty and is largely replaced by fat. It is removed with the tumour.",
        },
        "left-brachiocephalic-vein": {
          affected: false,
          description:
            "Runs just behind the thymus and receives its veins. An invasive thymoma can grow into it.",
        },
        "superior-vena-cava": {
          affected: false,
          description: "Not compressed by the tumour.",
        },
        heart: {
          affected: false,
          description:
            "Normal. The thymus lies on the pericardium in front of the heart.",
        },
      },
    },
  ],
  stages: [
    {
      id: "ocular",
      label: "Eyes",
      time: "Onset",
      summary:
        "Drooping eyelids and double vision that come and go, worse when tired and better after rest. Most start this way, and about half spread beyond the eyes within two years.",
    },
    {
      id: "generalised",
      label: "Generalised",
      time: "Within 2 years",
      summary:
        "Weakness spreads to the face, speech, swallowing, neck and arms, and fades after rest. Pyridostigmine eases it, steroids and immunosuppressants calm the immune attack, and the thymus and its tumour are removed.",
      findings: {
        eye: {
          "levator-palpebrae": {
            affected: true,
            description: "Still drooping, though less once treatment starts.",
          },
          "medial-rectus": {
            affected: true,
            description: "Still weak, with double vision late in the day.",
          },
        },
      },
      investigations: [
        {
          name: "Repetitive nerve stimulation",
          result: "Decrement 18%",
          flag: "abnormal",
        },
        { name: "Forced vital capacity", result: "3.2 L" },
        { name: "CT chest", result: "Thymoma, 4 cm", flag: "abnormal" },
      ],
    },
    {
      id: "crisis",
      label: "Myasthenic crisis",
      alternative: true,
      time: "Days",
      summary:
        "Weakness of the breathing and swallowing muscles, brought on by an infection, surgery, some drugs or stopping treatment, until breathing needs a ventilator. Oxygen levels fall late, so breathing strength is measured instead.",
      findings: {
        eye: {
          "levator-palpebrae": {
            affected: true,
            description: "Both lids droop heavily.",
          },
        },
      },
      investigations: [
        { name: "Forced vital capacity", result: "1.1 L", flag: "low" },
        { name: "Single breath count", result: "8", flag: "low" },
        { name: "Oxygen saturation", result: "96%" },
      ],
    },
  ],
  events: [
    {
      stage: "ocular",
      label: "Antibody test",
      description:
        "Antibodies to the acetylcholine receptor, positive in about 85% of generalised myasthenia and half of purely ocular disease. Every confirmed case has a CT of the chest to look for a thymoma.",
    },
    {
      stage: "generalised",
      label: "Pyridostigmine",
      description:
        "Slows the breakdown of acetylcholine, so more reaches the receptors left. It eases symptoms but does not change the disease.",
    },
    {
      stage: "generalised",
      label: "Immunosuppression",
      description:
        "Prednisolone, started low and raised slowly, as it can briefly worsen weakness. Azathioprine is added early, after a TPMT blood test, so the steroid dose can come down.",
    },
    {
      stage: "generalised",
      label: "Thymectomy",
      description:
        "Every thymoma is removed, with the rest of the thymus. Without a thymoma, removing the thymus also helps adults up to 65 with antibody-positive generalised disease.",
    },
    {
      stage: "crisis",
      label: "Intensive care",
      description:
        "Ventilation when the vital capacity falls towards 15–20 mL/kg, with plasma exchange or intravenous immunoglobulin, and treatment of the trigger. Drugs that worsen myasthenia, such as aminoglycosides and magnesium, are avoided.",
    },
  ],
  investigations: [
    { name: "AChR antibodies", result: "Positive", flag: "abnormal" },
    { name: "Ice pack test", result: "Ptosis improves", flag: "abnormal" },
    { name: "Pupils", result: "Normal" },
  ],
}

/** The eye at onset, the scale and stage the viewer opens on. */
export const myastheniaGravisModel = conditionModel(myastheniaGravis)

export type MyastheniaGravisProps = Omit<ConditionViewerProps, "condition">

export function MyastheniaGravis(props: MyastheniaGravisProps) {
  return <ConditionViewer condition={myastheniaGravis} {...props} />
}
