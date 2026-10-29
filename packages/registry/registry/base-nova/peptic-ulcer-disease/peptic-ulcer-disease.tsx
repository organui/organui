import { conditionModel, type Condition } from "@/components/condition-model"
import {
  ConditionViewer,
  type ConditionViewerProps,
} from "@/components/condition-viewer"
import { stomachModel } from "@/components/stomach"

// A gastric ulcer on the lesser curve, where the left gastric artery runs
// close behind it: the two complications that kill are bleeding and
// perforation.
export const pepticUlcerDisease: Condition = {
  name: "Peptic ulcer disease",
  code: "K25",
  summary:
    "Helicobacter pylori or NSAIDs, including aspirin, weaken the stomach's mucosal barrier, and acid digests a crater into the wall. Treating the cause heals it.",
  scales: [
    {
      id: "stomach",
      label: "Stomach",
      model: stomachModel,
      findings: {
        stomach: {
          affected: true,
          description:
            "An ulcer on the lesser curve, through the mucosa into the muscle. Burning epigastric pain comes soon after eating. Gastric ulcers are biopsied, because some are cancers.",
        },
        "left-gastric-artery": {
          affected: false,
          description:
            "Runs along the lesser curve right beside the ulcer, intact for now. A deepening ulcer can erode into it.",
        },
        duodenum: {
          affected: false,
          description:
            "Spared here. Duodenal ulcers are commoner; their pain eases with food and wakes the patient at night.",
        },
        pancreas: {
          affected: false,
          description:
            "Lies behind the stomach. An ulcer on the back wall can burrow into it, turning the pain into constant back pain.",
        },
        esophagus: {
          affected: false,
          description:
            "Not involved. Reflux oesophagitis is one of the causes of similar burning pain.",
        },
      },
    },
  ],
  stages: [
    {
      id: "ulcer",
      label: "Ulcer",
      time: "Weeks",
      summary:
        "Pain and indigestion. Eradicating H. pylori, stopping NSAIDs and a proton pump inhibitor heal most ulcers in eight weeks; a gastric ulcer is scoped again to confirm it has healed.",
    },
    {
      id: "bleeding",
      label: "Bleeding",
      summary:
        "The ulcer erodes a vessel: vomiting blood or black, tarry stools. Resuscitate, then endoscopy within 24 hours, or at once if unstable, stops it.",
      findings: {
        stomach: {
          stomach: {
            affected: true,
            description:
              "At endoscopy a visible vessel or clot in the ulcer base predicts rebleeding; it is clipped or heat-sealed, often after an adrenaline injection.",
          },
          "left-gastric-artery": {
            affected: true,
            description:
              "A branch has been eroded and bleeds into the stomach. If endoscopy fails, radiologists embolise it or surgeons tie it.",
          },
        },
      },
      investigations: [
        { name: "Haemoglobin", result: "82 g/L", flag: "low" },
        { name: "Urea", result: "Raised", flag: "high" },
        { name: "Glasgow-Blatchford", result: "12", flag: "high" },
        { name: "Endoscopy", result: "Visible vessel", flag: "abnormal" },
      ],
    },
    {
      id: "perforation",
      label: "Perforation",
      alternative: true,
      summary:
        "The ulcer goes through the whole wall. Acid and air escape into the peritoneum: sudden, severe pain and a rigid abdomen. Surgery closes it.",
      findings: {
        stomach: {
          stomach: {
            affected: true,
            description:
              "A hole through the lesser curve wall. Chemical then bacterial peritonitis follows; an omental patch repairs it and its edge is biopsied for cancer.",
          },
          duodenum: {
            affected: false,
            description:
              "Spared here; anterior duodenal ulcers are the commonest to perforate.",
          },
        },
      },
      investigations: [
        {
          name: "Erect chest X-ray",
          result: "Air under diaphragm",
          flag: "abnormal",
        },
        { name: "CT", result: "Free air and fluid", flag: "abnormal" },
        { name: "Lactate", result: "Raised", flag: "high" },
        { name: "Amylase", result: "Mildly raised", flag: "high" },
      ],
    },
  ],
  events: [
    {
      stage: "ulcer",
      label: "H. pylori test",
      description:
        "A breath or stool test off PPIs for two weeks, or a biopsy at endoscopy. Eradication heals the ulcer and stops it coming back; a breath test after treatment confirms it worked.",
    },
    {
      stage: "bleeding",
      label: "Blatchford score",
      description:
        "Decides who needs urgent endoscopy and who can safely go home.",
    },
    {
      stage: "bleeding",
      label: "Endoscopy",
      time: "Within 24 h",
      description:
        "Clips or heat, often after an adrenaline injection, stop the bleeding; adrenaline is never used alone. A high-dose proton pump inhibitor follows.",
    },
    {
      stage: "perforation",
      label: "Surgery",
      description:
        "Free air under the diaphragm on an erect chest X-ray or CT, then laparoscopic repair with an omental patch.",
    },
  ],
  investigations: [
    { name: "H. pylori stool antigen", result: "Positive", flag: "abnormal" },
    { name: "Haemoglobin", result: "Normal" },
    { name: "Endoscopy", result: "Lesser curve ulcer", flag: "abnormal" },
    { name: "Biopsy", result: "No malignancy" },
  ],
}

/** The stomach with an uncomplicated ulcer, the stage the viewer opens on. */
export const pepticUlcerDiseaseModel = conditionModel(pepticUlcerDisease)

export type PepticUlcerDiseaseProps = Omit<ConditionViewerProps, "condition">

export function PepticUlcerDisease(props: PepticUlcerDiseaseProps) {
  return <ConditionViewer condition={pepticUlcerDisease} {...props} />
}
