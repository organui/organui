import { conditionModel, type Condition } from "@/components/condition-model"
import {
  ConditionViewer,
  type ConditionViewerProps,
} from "@/components/condition-viewer"
import { parathyroidModel } from "@/components/parathyroid"

const suppressed =
  "Normal in size: the high calcium has switched it off, so it makes almost no hormone."

// Primary hyperparathyroidism from a single adenoma, as in about 85% of
// cases: one gland makes hormone whatever the calcium, and the other three
// fall silent.
export const primaryHyperparathyroidism: Condition = {
  name: "Primary hyperparathyroidism",
  code: "E21.0",
  summary:
    "One or more parathyroid glands make too much parathyroid hormone, which raises the blood calcium by releasing it from bone, keeping it from being lost in the urine and absorbing more from the gut. Commonest in women after the menopause, it is usually found on a routine blood test.",
  scales: [
    {
      id: "parathyroid",
      label: "Parathyroid glands",
      model: parathyroidModel,
      defaultView: "Right glands",
      findings: {
        "right-inferior-parathyroid": {
          affected: true,
          description:
            "A benign adenoma, 1.5 cm across, makes hormone without stopping when the calcium is high. It sits behind the lower pole of the thyroid.",
        },
        "right-superior-parathyroid": {
          affected: false,
          description: suppressed,
        },
        "left-superior-parathyroid": {
          affected: false,
          description: suppressed,
        },
        "left-inferior-parathyroid": {
          affected: false,
          description: suppressed,
        },
        "right-lobe": {
          affected: false,
          description:
            "Normal. Thyroid nodules beside the adenoma can confuse the ultrasound that looks for it.",
        },
      },
    },
  ],
  stages: [
    {
      id: "found",
      label: "Found on a blood test",
      time: "Often by chance",
      summary:
        "Most people have no symptoms, or only tiredness, thirst, constipation or low mood. A high calcium with a parathyroid hormone that is high, or normal when it should be low, makes the diagnosis.",
    },
    {
      id: "cured",
      label: "Cured",
      time: "After surgery",
      summary:
        "Removing the adenoma cures about 95%. Calcium falls within a day and can dip below normal while the other glands wake up, causing tingling in the fingers and lips.",
      findings: {
        parathyroid: {
          "right-inferior-parathyroid": {
            affected: true,
            description:
              "Removed through a small incision. Blood PTH falls by more than half within 10 minutes, which can be measured during the operation.",
          },
          "right-superior-parathyroid": {
            affected: false,
            description:
              "Working again within days to weeks, now that the calcium is normal.",
          },
          "left-superior-parathyroid": {
            affected: false,
            description:
              "Working again within days to weeks, now that the calcium is normal.",
          },
          "left-inferior-parathyroid": {
            affected: false,
            description:
              "Working again within days to weeks, now that the calcium is normal.",
          },
        },
      },
      investigations: [
        { name: "Adjusted calcium", result: "2.31 mmol/L" },
        { name: "PTH", result: "3.2 pmol/L" },
        { name: "Histology", result: "Parathyroid adenoma" },
      ],
    },
    {
      id: "complications",
      label: "Complications",
      alternative: true,
      time: "Untreated, years",
      summary:
        "Calcium taken from bone thins it, especially the forearm, and calcium in the urine forms kidney stones and can slowly reduce kidney function. Stones and bone thinning are each a reason to operate; so is a calcium of 2.85 mmol/L or more.",
      findings: {
        parathyroid: {
          "right-inferior-parathyroid": {
            affected: true,
            description:
              "Still overactive; adenomas grow slowly and do not go away on their own.",
          },
        },
      },
      investigations: [
        { name: "Adjusted calcium", result: "2.88 mmol/L", flag: "high" },
        { name: "DXA, forearm", result: "T-score −2.8", flag: "low" },
        { name: "Renal ultrasound", result: "Stones", flag: "abnormal" },
        { name: "eGFR", result: "54 mL/min/1.73 m²", flag: "low" },
      ],
    },
  ],
  events: [
    {
      stage: "found",
      label: "Confirming it",
      description:
        "Repeat calcium with PTH, vitamin D and kidney function. A urine calcium excludes familial hypocalciuric hypercalcaemia, an inherited condition that needs no surgery.",
    },
    {
      stage: "found",
      label: "Finding the gland",
      description:
        "Ultrasound of the neck and a sestamibi scan locate the adenoma, so the surgeon can remove it through a small cut instead of exploring all four glands. They do not make the diagnosis.",
    },
    {
      stage: "cured",
      label: "Parathyroidectomy",
      description:
        "Offered to those with symptoms, stones, osteoporosis, a fracture or a calcium of 2.85 mmol/L or more, and considered for others. Calcium is checked the next day.",
    },
    {
      stage: "complications",
      label: "Watching instead",
      description:
        "For those who cannot or choose not to have surgery: yearly calcium and kidney function, bone density checks, plenty of fluid, and cinacalcet to lower the calcium if needed.",
    },
  ],
  investigations: [
    { name: "Adjusted calcium", result: "2.74 mmol/L", flag: "high" },
    { name: "PTH", result: "9.8 pmol/L", flag: "high" },
    { name: "Phosphate", result: "0.72 mmol/L", flag: "low" },
    { name: "Vitamin D", result: "62 nmol/L" },
  ],
}

/** The parathyroids with an adenoma found by chance, the stage the viewer opens on. */
export const primaryHyperparathyroidismModel = conditionModel(
  primaryHyperparathyroidism
)

export type PrimaryHyperparathyroidismProps = Omit<
  ConditionViewerProps,
  "condition"
>

export function PrimaryHyperparathyroidism(
  props: PrimaryHyperparathyroidismProps
) {
  return <ConditionViewer condition={primaryHyperparathyroidism} {...props} />
}
