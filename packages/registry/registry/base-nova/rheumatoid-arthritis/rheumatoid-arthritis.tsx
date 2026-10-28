import { conditionModel, type Condition } from "@/components/condition-model"
import {
  ConditionViewer,
  type ConditionViewerProps,
} from "@/components/condition-viewer"
import { jointsModel } from "@/components/joints"

// Seropositive rheumatoid arthritis: a symmetrical inflammation of the
// synovium of the small joints of the hands and feet, where early treatment
// to a target decides whether the joints are saved.
export const rheumatoidArthritis: Condition = {
  name: "Rheumatoid arthritis",
  code: "M05.9",
  summary:
    "An autoimmune disease in which the lining of the joints (the synovium) becomes inflamed, swells and, untreated, erodes cartilage and bone. It starts in the small joints of the hands and feet, on both sides, most often in women aged 30–50.",
  scales: [
    {
      id: "joints",
      label: "Joints",
      model: jointsModel,
      findings: {
        "articular-capsules-of-metacarpophalangeal-joints": {
          affected: true,
          label: "Knuckle (MCP) joints",
          description:
            "The synovium lining the capsule is swollen and inflamed: soft, tender knuckles, stiff for over an hour in the morning, and pain when the hand is squeezed across them.",
        },
        "articular-capsules-of-proximal-interphalangeal-joints": {
          affected: true,
          label: "Middle finger (PIP) joints",
          description:
            "Swollen and spindle-shaped from synovitis, on both hands.",
        },
        "articular-capsule-of-radiocarpal-joint": {
          affected: true,
          label: "Wrist joint",
          description:
            "Inflamed synovium swells the back of the wrist. Swollen flexor tendon sheaths in the carpal tunnel can press on the median nerve.",
        },
        "articular-capsules-of-metatarsophalangeal-joints": {
          affected: true,
          label: "Toe (MTP) joints",
          description:
            "Inflamed early, sometimes before the hands: walking feels like stepping on pebbles, and squeezing across the forefoot hurts.",
        },
        "articular-capsules-of-distal-interphalangeal-joints": {
          affected: false,
          label: "Finger end (DIP) joints",
          description:
            "Spared, unlike osteoarthritis and psoriatic arthritis, which favour these joints.",
        },
        "articular-capsule-of-knee-joint": {
          affected: false,
          description:
            "Not yet involved. Larger joints such as the knees, elbows and shoulders often follow.",
        },
        "cervical-intervertebral-discs": {
          affected: false,
          description:
            "Not involved early. In long-standing disease the neck can become unstable, most often between the first two vertebrae, which matters before an anaesthetic.",
        },
      },
    },
  ],
  stages: [
    {
      id: "early",
      label: "Early",
      time: "First 3 months",
      summary:
        "Painful, swollen, stiff small joints on both sides, with tiredness. Starting a disease-modifying drug now gives the best chance of remission.",
    },
    {
      id: "remission",
      label: "Remission",
      time: "Within 6 months",
      summary:
        "Disease activity is checked every month and treatment stepped up until it is in remission. The joints stay intact and most people keep working.",
      findings: {
        joints: {
          "articular-capsules-of-metacarpophalangeal-joints": {
            affected: true,
            label: "Knuckle (MCP) joints",
            description:
              "No swelling or tenderness; ultrasound shows the synovitis has settled. The disease is controlled, not cured, so treatment continues.",
          },
          "articular-capsules-of-proximal-interphalangeal-joints": {
            affected: false,
            label: "Middle finger (PIP) joints",
            description: "Settled, with a full range of movement.",
          },
          "articular-capsule-of-radiocarpal-joint": {
            affected: false,
            label: "Wrist joint",
            description: "Settled.",
          },
          "articular-capsules-of-metatarsophalangeal-joints": {
            affected: false,
            label: "Toe (MTP) joints",
            description:
              "Settled; X-rays show no erosions. The DAS28 does not count the feet, so they are examined separately.",
          },
        },
      },
      investigations: [
        { name: "DAS28", result: "2.1, remission" },
        { name: "CRP", result: "Normal" },
        { name: "Hand X-ray", result: "No erosions" },
        { name: "Methotrexate bloods", result: "Normal" },
      ],
    },
    {
      id: "established",
      label: "Joint damage",
      alternative: true,
      time: "Years, if uncontrolled",
      summary:
        "Inflamed synovium (pannus) has eroded cartilage and bone and stretched the capsules and ligaments, so the joints deform and lose function.",
      findings: {
        joints: {
          "articular-capsules-of-metacarpophalangeal-joints": {
            affected: true,
            label: "Knuckle (MCP) joints",
            description:
              "Stretched by years of synovitis: the fingers drift towards the little finger (ulnar deviation) and the joints can sublux.",
          },
          "collateral-metacarpophalangeal-ligaments": {
            affected: true,
            description:
              "Lengthened and weakened, so they no longer hold the fingers straight.",
          },
          "articular-capsules-of-proximal-interphalangeal-joints": {
            affected: true,
            label: "Middle finger (PIP) joints",
            description:
              "Deformed by imbalanced tendons: bent back with the tip flexed (swan neck), or bent with the tip extended (boutonnière).",
          },
          "articular-capsule-of-radiocarpal-joint": {
            affected: true,
            label: "Wrist joint",
            description:
              "Eroded and subluxed; the end of the ulna becomes prominent and can fray and rupture the extensor tendons of the little and ring fingers.",
          },
          "articular-capsule-of-knee-joint": {
            affected: true,
            description:
              "Inflamed and eroded, with loss of the joint space; a swelling behind it (Baker's cyst) can rupture into the calf.",
          },
        },
      },
      investigations: [
        { name: "Hand X-ray", result: "Erosions, narrowing", flag: "abnormal" },
        { name: "DAS28", result: "5.6, high activity", flag: "high" },
        { name: "CRP", result: "Raised", flag: "high" },
        { name: "Haemoglobin", result: "Low", flag: "low" },
      ],
    },
  ],
  events: [
    {
      stage: "early",
      label: "Referral",
      time: "Within 3 working days",
      description:
        "Persistent swelling of small joints, or of more than one joint, is referred to a rheumatologist urgently, whatever the blood tests show.",
    },
    {
      stage: "early",
      label: "Methotrexate",
      time: "As soon as possible",
      description:
        "Methotrexate once a week (or leflunomide or sulfasalazine), with a short course of steroid to bridge the weeks before it works; folic acid on another day lowers its side effects, and bloods are monitored.",
    },
    {
      stage: "remission",
      label: "Treat to target",
      description:
        "The DAS28 score is checked monthly and treatment escalated, with drugs combined, until the disease is in remission or low activity.",
    },
    {
      stage: "established",
      label: "Biologic",
      description:
        "For activity that stays moderate or high despite conventional drugs: an anti-TNF drug, abatacept or tocilizumab, usually with methotrexate; rituximab usually after an anti-TNF. JAK inhibitors are avoided in people over 65, smokers and those at risk of heart disease, clots or cancer, unless there is no alternative.",
    },
    {
      stage: "established",
      label: "Surgery",
      description:
        "Joint replacement for a destroyed knee or hip, and tendon repair or fusion in the hand and wrist.",
    },
  ],
  investigations: [
    { name: "Anti-CCP", result: "Positive", flag: "abnormal" },
    { name: "Rheumatoid factor", result: "Positive", flag: "abnormal" },
    { name: "CRP", result: "Raised", flag: "high" },
    { name: "DAS28", result: "5.4, high activity", flag: "high" },
  ],
}

/** The joints in early disease, the stage the viewer opens on. */
export const rheumatoidArthritisModel = conditionModel(rheumatoidArthritis)

export type RheumatoidArthritisProps = Omit<ConditionViewerProps, "condition">

export function RheumatoidArthritis(props: RheumatoidArthritisProps) {
  return <ConditionViewer condition={rheumatoidArthritis} {...props} />
}
