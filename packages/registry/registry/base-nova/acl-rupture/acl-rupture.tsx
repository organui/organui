import { conditionModel, type Condition } from "@/components/condition-model"
import {
  ConditionViewer,
  type ConditionViewerProps,
} from "@/components/condition-viewer"
import { jointsModel } from "@/components/joints"

// A rupture of the anterior cruciate ligament with the medial collateral
// ligament and medial meniscus, the "unhappy triad", on the knees of the
// whole-body joints model.
export const aclRupture: Condition = {
  name: "ACL rupture",
  code: "S83.7",
  summary:
    "A twist on a planted foot tears the anterior cruciate ligament, often with the medial collateral ligament and medial meniscus. Without it the knee can give way when pivoting.",
  scales: [
    {
      id: "joints",
      label: "Knees",
      model: jointsModel,
      defaultView: "Knees",
      findings: {
        "anterior-cruciate-ligament": {
          affected: true,
          description:
            "Torn, usually near its femoral end, with an audible pop. It stops the tibia sliding forward on the femur, so the Lachman test shows extra movement with a soft end point.",
        },
        "superficial-part-of-tibial-collateral-ligament": {
          affected: true,
          description:
            "Torn by the valgus force that bends the knee inwards. Opening on the inside of the knee is tested with it slightly bent.",
        },
        "deep-part-of-tibial-collateral-ligament": {
          affected: true,
          description:
            "Torn with the superficial part. It is attached to the medial meniscus, which tears with it.",
        },
        "medial-meniscus": {
          affected: true,
          description:
            "Torn at its back and edge, where the collateral ligament holds it. It can catch. A torn piece that locks the knee needs urgent surgery.",
        },
        "articular-capsule-of-knee-joint": {
          affected: true,
          description:
            "Swells with blood within hours (haemarthrosis), from the torn ligament's vessels.",
        },
        "posterior-cruciate-ligament": {
          affected: false,
          description:
            "Intact: no posterior sag of the tibia. It is torn by a blow to the front of a bent knee instead.",
        },
        "lateral-meniscus": {
          affected: false,
          description:
            "Intact here, though it is the meniscus most often torn at the time of an ACL tear.",
        },
        "fibular-collateral-ligament": {
          affected: false,
          description: "Intact: the outside of the knee is stable.",
        },
      },
    },
  ],
  stages: [
    {
      id: "acute",
      label: "Acute",
      time: "Weeks 0–6",
      summary:
        "Pain, a swollen knee within hours and inability to carry on playing. Rest, ice, a brace and physiotherapy start at once; MRI confirms what is torn.",
    },
    {
      id: "reconstructed",
      label: "Reconstructed",
      time: "Months 2–12",
      summary:
        "People who want to return to pivoting sport, or whose knee keeps giving way, have the ligament reconstructed once the knee settles. Return to sport takes at least nine months after surgery.",
      findings: {
        joints: {
          "anterior-cruciate-ligament": {
            affected: true,
            description:
              "Replaced by a graft of hamstring, patellar or quadriceps tendon, passed through tunnels in the femur and tibia. It remodels into a ligament over one to two years.",
          },
          "superficial-part-of-tibial-collateral-ligament": {
            affected: false,
            description:
              "Healed in a brace; the medial collateral ligament usually heals without surgery.",
          },
          "deep-part-of-tibial-collateral-ligament": {
            affected: false,
            description: "Healed with the superficial part.",
          },
          "medial-meniscus": {
            affected: true,
            description:
              "Repaired with sutures at the same operation, to keep as much meniscus as possible.",
          },
          "articular-capsule-of-knee-joint": {
            affected: false,
            description: "The swelling has settled.",
          },
        },
      },
      investigations: [
        { name: "Lachman test", result: "Firm end point" },
        { name: "Range of motion", result: "0–135°" },
        { name: "Hop test", result: "92% of other side" },
      ],
    },
    {
      id: "deficient",
      label: "Without reconstruction",
      alternative: true,
      time: "Years",
      summary:
        "Many knees do well with rehabilitation alone. In some the knee keeps giving way when pivoting. Each episode can tear the menisci and wear the cartilage, raising the risk of osteoarthritis.",
      findings: {
        joints: {
          "anterior-cruciate-ligament": {
            affected: true,
            description:
              "Not functioning; the stump has scarred to the posterior cruciate ligament. The outer tibia slips forward and rotates when pivoting (positive pivot shift).",
          },
          "superficial-part-of-tibial-collateral-ligament": {
            affected: false,
            description:
              "Healed without surgery, sometimes with a little residual laxity.",
          },
          "deep-part-of-tibial-collateral-ligament": {
            affected: false,
            description: "Healed with the superficial part.",
          },
          "medial-meniscus": {
            affected: true,
            description:
              "Torn again with each episode of giving way. Losing it overloads the cartilage beneath and speeds osteoarthritis.",
          },
          "lateral-meniscus": {
            affected: true,
            description: "Now torn too, from repeated instability.",
          },
          "articular-capsule-of-knee-joint": {
            affected: true,
            description:
              "Recurrent effusions after each episode, and the joint lining thickens as osteoarthritis begins.",
          },
        },
      },
      investigations: [
        { name: "Pivot shift", result: "Positive", flag: "abnormal" },
        { name: "MRI", result: "Bucket-handle tear", flag: "abnormal" },
        { name: "X-ray", result: "Early joint space loss", flag: "abnormal" },
      ],
    },
  ],
  events: [
    {
      stage: "acute",
      label: "Lachman test",
      description:
        "The tibia slides forward on the femur with a soft end point; the most sensitive test for a torn ACL.",
    },
    {
      stage: "acute",
      label: "MRI",
      description:
        "Confirms the ACL tear and shows the collateral ligament, meniscus and bone bruising that come with it.",
    },
    {
      stage: "reconstructed",
      label: "Reconstruction",
      description:
        "Once the swelling settles and the knee moves fully, a tendon graft replaces the ligament, and a torn meniscus is repaired at the same operation.",
    },
    {
      stage: "reconstructed",
      label: "Return to sport",
      time: "9 months after surgery",
      description:
        "After rehabilitation and tests of strength and hopping against the other leg; returning earlier raises the risk of tearing it again.",
    },
    {
      stage: "deficient",
      label: "Rehabilitation",
      description:
        "Structured strength and balance training, with or without giving up pivoting sport. If the knee still gives way, a delayed reconstruction is offered.",
    },
  ],
  investigations: [
    { name: "Lachman test", result: "Positive", flag: "abnormal" },
    { name: "Valgus stress", result: "Opens at 30°", flag: "abnormal" },
    { name: "X-ray", result: "No fracture" },
    { name: "MRI", result: "ACL, MCL, meniscus tears", flag: "abnormal" },
  ],
}

/** The knees just after the injury, the stage the viewer opens on. */
export const aclRuptureModel = conditionModel(aclRupture)

export type AclRuptureProps = Omit<ConditionViewerProps, "condition">

export function AclRupture(props: AclRuptureProps) {
  return <ConditionViewer condition={aclRupture} {...props} />
}
