import { diseaseModel, type Disease } from "@/components/disease-model"
import {
  DiseaseViewer,
  type DiseaseViewerProps,
} from "@/components/disease-viewer"
import { jointsModel } from "@/components/joints"

// A rupture of the anterior cruciate ligament with the medial collateral
// ligament and medial meniscus, the "unhappy triad", on the knees of the
// whole-body joints model.
export const aclRupture: Disease = {
  name: "ACL rupture",
  code: "S83.7",
  summary:
    "A twist on a planted foot tears the anterior cruciate ligament, often with the medial collateral ligament and medial meniscus. Without it the knee gives way when pivoting.",
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
            "Torn mid-substance with an audible pop. It stops the tibia sliding forward on the femur, so the Lachman test shows extra movement with a soft end point.",
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
            "Torn as it is pulled by the collateral ligament it is attached to. It catches and locks the knee.",
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
            "Intact here, though it is the meniscus most often torn in an isolated ACL injury.",
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
      summary:
        "Pain, a swollen knee within hours and inability to carry on playing. Rest, ice, a brace and physiotherapy start at once; MRI confirms what is torn.",
    },
    {
      id: "reconstructed",
      label: "Reconstructed",
      summary:
        "Active people who pivot have the ligament reconstructed once the knee settles. Return to sport takes about nine months of rehabilitation.",
      findings: {
        joints: {
          "anterior-cruciate-ligament": {
            affected: true,
            description:
              "Replaced by a graft of hamstring or patellar tendon, passed through tunnels in the femur and tibia. It remodels into a ligament over a year.",
          },
          "superficial-part-of-tibial-collateral-ligament": {
            affected: false,
            description:
              "Healed in a brace; the medial collateral ligament heals without surgery.",
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
      label: "Untreated",
      summary:
        "Without reconstruction, a pivoting athlete's knee keeps giving way. Each episode damages the menisci and cartilage, and osteoarthritis comes early.",
      findings: {
        joints: {
          "anterior-cruciate-ligament": {
            affected: true,
            description:
              "Absent; the stump has scarred to the posterior cruciate ligament. The tibia shifts forward with each pivot (positive pivot shift).",
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
  investigations: [
    { name: "Lachman test", result: "Positive", flag: "abnormal" },
    { name: "Valgus stress", result: "Opens at 30°", flag: "abnormal" },
    { name: "X-ray", result: "No fracture" },
    { name: "MRI", result: "ACL, MCL, meniscus tears", flag: "abnormal" },
  ],
}

/** The knees just after the injury, the stage the viewer opens on. */
export const aclRuptureModel = diseaseModel(aclRupture)

export type AclRuptureProps = Omit<DiseaseViewerProps, "disease">

export function AclRupture(props: AclRuptureProps) {
  return <DiseaseViewer disease={aclRupture} {...props} />
}
