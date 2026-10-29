import { conditionModel, type Condition } from "@/components/condition-model"
import {
  ConditionViewer,
  type ConditionViewerProps,
} from "@/components/condition-viewer"
import { spinalCordModel } from "@/components/spinal-cord"

// A posterolateral L5–S1 disc herniation pressing on the S1 nerve root: the
// commonest cause of sciatica, which mostly settles on its own, and rarely a
// central herniation that compresses the whole cauda equina.
export const lumbarDiscHerniation: Condition = {
  name: "Lumbar disc herniation",
  code: "M51.1",
  summary:
    "The soft centre of a lumbar disc bulges through a tear in its outer ring and presses on a nerve root, causing sciatica: pain down the leg, worse than the back pain. Most settle within three months without surgery.",
  scales: [
    {
      id: "spinal-cord",
      label: "Spine",
      model: spinalCordModel,
      findings: {
        "disc-l5-s1": {
          affected: true,
          description:
            "The nucleus pulposus has pushed through a tear in the annulus fibrosus, behind and to one side, where the posterior longitudinal ligament is thinnest. It sits in the path of the S1 root.",
        },
        "cauda-equina": {
          affected: true,
          label: "S1 nerve root",
          description:
            "The S1 root is compressed and inflamed: pain down the back of the leg into the sole and outer foot, numbness there, weak pushing off with the foot and a reduced ankle reflex. Raising the straight leg stretches the root and brings on the pain.",
        },
        "disc-l4-l5": {
          affected: false,
          description:
            "Normal here. The other common level: a herniation here presses on the L5 root, with weak lifting of the big toe and numbness on the top of the foot.",
        },
        "spinal-cord": {
          affected: false,
          description:
            "Ends at about L1–L2, above the lumbar discs, so a lumbar herniation presses on nerve roots, not the cord.",
        },
        "vertebra-l5": {
          affected: false,
          description:
            "Normal. Back pain with weight loss, fever or past cancer raises concern for infection or cancer in the spine.",
        },
        sacrum: {
          affected: false,
          description: "Normal.",
        },
      },
    },
  ],
  stages: [
    {
      id: "sciatica",
      label: "Sciatica",
      time: "Weeks 0–6",
      summary:
        "Leg pain worse than back pain, often after lifting or bending, with numbness and weakness in one root's territory. Without red flags, no scan is needed yet.",
    },
    {
      id: "recovered",
      label: "Recovered",
      time: "By 3 months, in most",
      summary:
        "The herniated part shrinks as the body reabsorbs it, and the root recovers. Most need no surgery.",
      findings: {
        "spinal-cord": {
          "disc-l5-s1": {
            affected: true,
            description:
              "The herniation has shrunk or gone; large extrusions often regress most. The disc stays slightly lower, and the back can ache from time to time.",
          },
          "cauda-equina": {
            affected: false,
            label: "S1 nerve root",
            description:
              "No longer compressed. The pain goes first; numbness and the ankle reflex can take months to recover, or stay.",
          },
        },
      },
      investigations: [
        { name: "Straight leg raise", result: "Negative" },
        { name: "Ankle reflex", result: "Reduced", flag: "low" },
        { name: "Power", result: "Normal" },
      ],
    },
    {
      id: "cauda-equina-syndrome",
      label: "Cauda equina syndrome",
      alternative: true,
      time: "Hours to days",
      summary:
        "A large central herniation compresses the roots below it, including those to the bladder and bowel: an emergency. Without decompression the bladder, bowel and sexual function can be lost for good.",
      findings: {
        "spinal-cord": {
          "disc-l5-s1": {
            affected: true,
            description:
              "A massive central herniation fills the spinal canal behind the disc.",
          },
          "cauda-equina": {
            affected: true,
            description:
              "Every root below the herniation is squeezed: sciatica in both legs, numbness of the buttocks, perineum and genitals (saddle anaesthesia), loss of bladder sensation or retention, and loss of bowel control.",
          },
        },
      },
      investigations: [
        { name: "Saddle sensation", result: "Reduced", flag: "abnormal" },
        { name: "Bladder scan", result: "650 mL after voiding", flag: "high" },
        { name: "Anal tone", result: "Reduced", flag: "low" },
        {
          name: "MRI",
          result: "Central disc compressing roots",
          flag: "abnormal",
        },
      ],
    },
  ],
  events: [
    {
      stage: "sciatica",
      label: "Red flags",
      description:
        "Saddle numbness, bladder, bowel or sexual change, sciatica in both legs or weakness that is getting worse need an emergency MRI, within hours, day or night.",
    },
    {
      stage: "sciatica",
      label: "Keep active",
      description:
        "Advice to stay active, and an NSAID if needed. Gabapentinoids, other antiepileptics, oral steroids and benzodiazepines are not used: they do not help and can harm. An epidural steroid injection can help severe pain.",
    },
    {
      stage: "sciatica",
      label: "MRI",
      time: "After 6 weeks",
      description:
        "For pain still disabling after six weeks or so, when surgery is being considered; the herniation must match the symptoms.",
    },
    {
      stage: "sciatica",
      label: "Discectomy",
      time: "If still disabling",
      description:
        "Removing the herniated part relieves leg pain faster than waiting, though results are similar after a year.",
    },
    {
      stage: "cauda-equina-syndrome",
      label: "Decompression",
      time: "Emergency",
      description:
        "An MRI as soon as it is suspected, then surgery to remove the disc and free the roots without delay.",
    },
  ],
  investigations: [
    { name: "Straight leg raise", result: "Positive at 40°", flag: "abnormal" },
    { name: "Ankle reflex", result: "Reduced", flag: "low" },
    { name: "Plantarflexion", result: "Mildly weak", flag: "low" },
    { name: "Red flags", result: "None" },
  ],
}

/** The spine with sciatica, the stage the viewer opens on. */
export const lumbarDiscHerniationModel = conditionModel(lumbarDiscHerniation)

export type LumbarDiscHerniationProps = Omit<ConditionViewerProps, "condition">

export function LumbarDiscHerniation(props: LumbarDiscHerniationProps) {
  return <ConditionViewer condition={lumbarDiscHerniation} {...props} />
}
