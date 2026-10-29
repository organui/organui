import { conditionModel, type Condition } from "@/components/condition-model"
import {
  ConditionViewer,
  type ConditionViewerProps,
} from "@/components/condition-viewer"
import { pancreasModel } from "@/components/pancreas"

// Adenocarcinoma of the head of the pancreas: whether it can be removed
// depends on the vessels behind the gland as much as on the tumour itself.
export const pancreaticCancer: Condition = {
  name: "Pancreatic cancer",
  code: "C25.0",
  summary:
    "An adenocarcinoma of the duct cells, most often in the head of the pancreas. It is usually found late; surgery offers the only cure, for the minority whose tumour has not reached the main arteries or spread.",
  scales: [
    {
      id: "pancreas",
      label: "Pancreas",
      model: pancreasModel,
      findings: {
        "pancreatic-head": {
          affected: true,
          description:
            "A hard, poorly defined mass. It squeezes the common bile duct running through the head, so painless jaundice is often the first sign, with dark urine, pale stools and itch.",
        },
        "pancreatic-body-and-tail": {
          affected: false,
          description:
            "Free of tumour, though behind the blocked duct the gland can waste away (atrophy).",
        },
        "pancreatic-duct": {
          affected: true,
          description:
            "Blocked at the head and dilated upstream through the body and tail; with the dilated bile duct this is the double duct sign. Loss of pancreatic juice causes fatty stools.",
        },
        duodenum: {
          affected: false,
          description:
            "Wrapped around the tumour but still open. It is removed with the head of the pancreas in a Whipple operation.",
        },
        "superior-mesenteric-vein": {
          affected: false,
          description:
            "Clear of the tumour, with a fat plane between them: the tumour is resectable.",
        },
        "portal-vein": {
          affected: false,
          description:
            "Clear. Limited contact can be removed and the vein rebuilt during surgery.",
        },
        "superior-mesenteric-artery": {
          affected: false,
          description:
            "Clear. Whether the tumour touches this artery, and how far around it, decides whether it can be removed.",
        },
        "celiac-trunk": {
          affected: false,
          description: "Clear of the tumour.",
        },
        "common-hepatic-artery": {
          affected: false,
          description:
            "Clear. Contact with it makes a tumour borderline resectable.",
        },
        "splenic-vein": {
          affected: false,
          description:
            "Not involved. A tumour of the body or tail can block it and enlarge the spleen.",
        },
      },
    },
  ],
  stages: [
    {
      id: "resectable",
      label: "Resectable",
      time: "Early",
      summary:
        "Painless jaundice and weight loss, with the tumour clear of the major vessels and no spread; only 15–20% are found this early. A Whipple operation, then chemotherapy, gives the best chance of cure.",
    },
    {
      id: "locally-advanced",
      label: "Locally advanced",
      time: "As it grows",
      summary:
        "The tumour wraps around the superior mesenteric artery, so it cannot be removed; about 30% are found at this stage. Chemotherapy, sometimes with radiotherapy, can shrink it enough for surgery in a few.",
      findings: {
        pancreas: {
          "pancreatic-head": {
            affected: true,
            description:
              "The mass has grown through the back of the head and along the nerves around the arteries. Spreading into the nerve plexus there causes a boring pain through to the back.",
          },
          duodenum: {
            affected: false,
            description: "Wrapped around the tumour but still open.",
          },
          "superior-mesenteric-artery": {
            affected: true,
            description:
              "Encased: the tumour surrounds more than half (180°) of the artery, which supplies the small bowel and right colon and cannot safely be replaced.",
          },
          "superior-mesenteric-vein": {
            affected: true,
            description:
              "Narrowed by the tumour; on its own this could be rebuilt, but not with the artery encased.",
          },
          "portal-vein": {
            affected: true,
            description:
              "Narrowed where it begins, behind the neck of the pancreas.",
          },
        },
      },
      investigations: [
        {
          name: "Pancreas CT",
          result: "SMA encased > 180°",
          flag: "abnormal",
        },
        { name: "Bilirubin", result: "Raised", flag: "high" },
        { name: "CA 19-9", result: "Raised", flag: "high" },
        { name: "CT chest", result: "No metastases" },
      ],
    },
    {
      id: "metastatic",
      label: "Metastatic",
      time: "Months",
      summary:
        "Spread to the liver or the lining of the abdomen, as in about half at diagnosis. Chemotherapy such as FOLFIRINOX can extend life by months; care focuses on symptoms.",
      findings: {
        pancreas: {
          duodenum: {
            affected: true,
            description:
              "Narrowed by the growing tumour, so food cannot leave the stomach and vomiting follows. A stent through it or a bypass relieves it.",
          },
          "superior-mesenteric-artery": {
            affected: true,
            description: "Encased by the tumour.",
          },
          "superior-mesenteric-vein": {
            affected: true,
            description: "Narrowed by the tumour.",
          },
          "celiac-trunk": {
            affected: true,
            description:
              "Encased, with the coeliac nerve plexus around it: severe pain that a nerve block can ease.",
          },
          "portal-vein": {
            affected: true,
            description:
              "Narrowed by the tumour. Cells carried in its blood seed the liver, the commonest site of spread.",
          },
        },
      },
      investigations: [
        { name: "CT", result: "Liver metastases", flag: "abnormal" },
        { name: "CA 19-9", result: "Very high", flag: "high" },
        { name: "Albumin", result: "Low", flag: "low" },
        { name: "Liver biopsy", result: "Adenocarcinoma", flag: "abnormal" },
      ],
    },
  ],
  events: [
    {
      stage: "resectable",
      label: "Pancreas CT",
      description:
        "A CT in the pancreatic phase shows the tumour against each vessel and looks for spread, before a stent is placed in the bile duct. A PET-CT looks for spread the CT missed.",
    },
    {
      stage: "resectable",
      label: "Biliary drainage",
      description:
        "Only if surgery must wait or jaundice is severe: a metal stent placed at ERCP drains the bile; otherwise surgery comes first.",
    },
    {
      stage: "resectable",
      label: "Whipple",
      description:
        "Removes the head of the pancreas, the duodenum, the lower bile duct and the gallbladder, then joins the stomach, bile duct and pancreas to the small bowel. Pancreatic enzymes are then taken with meals.",
    },
    {
      stage: "resectable",
      label: "Adjuvant chemotherapy",
      time: "Within 12 weeks",
      description:
        "Six months of modified FOLFIRINOX, or gemcitabine with capecitabine for those less fit, once recovered from surgery.",
    },
    {
      stage: "locally-advanced",
      label: "Chemotherapy",
      description:
        "FOLFIRINOX or gemcitabine with nab-paclitaxel; a scan afterwards looks for a tumour that has shrunk enough to remove.",
    },
    {
      stage: "metastatic",
      label: "Chemotherapy",
      description:
        "FOLFIRINOX or gemcitabine with nab-paclitaxel for those fit enough; gemcitabine alone for the less fit.",
    },
    {
      stage: "metastatic",
      label: "Palliative care",
      description:
        "Pancreatic enzyme replacement for fatty stools and weight loss, as for anyone whose cancer cannot be removed, a nerve block for pain, and stents for the bile duct or duodenum.",
    },
  ],
  investigations: [
    { name: "Bilirubin", result: "Raised", flag: "high" },
    { name: "ALP", result: "Raised", flag: "high" },
    { name: "CA 19-9", result: "Raised", flag: "high" },
    {
      name: "Pancreas CT",
      result: "Head mass, vessels clear",
      flag: "abnormal",
    },
  ],
}

/** The pancreas with a resectable tumour, the stage the viewer opens on. */
export const pancreaticCancerModel = conditionModel(pancreaticCancer)

export type PancreaticCancerProps = Omit<ConditionViewerProps, "condition">

export function PancreaticCancer(props: PancreaticCancerProps) {
  return <ConditionViewer condition={pancreaticCancer} {...props} />
}
