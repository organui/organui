import { adrenalsModel } from "@/components/adrenals"
import { conditionModel, type Condition } from "@/components/condition-model"
import {
  ConditionViewer,
  type ConditionViewerProps,
} from "@/components/condition-viewer"

const cortex =
  "Small and thin: lymphocytes have destroyed the cortex, which makes cortisol and aldosterone. Symptoms start only once about 90% of it is gone. The medulla inside, which makes adrenaline, is spared."

// Autoimmune Addison's disease, the commonest cause of primary adrenal
// insufficiency where tuberculosis is rare: both glands fail together, so
// cortisol and aldosterone are lost and the pituitary's ACTH climbs.
export const addisonsDisease: Condition = {
  name: "Addison's disease",
  code: "E27.1",
  summary:
    "Primary adrenal insufficiency: the adrenal cortex fails, so neither cortisol nor aldosterone is made. Most cases are autoimmune. It is rare, easily missed because its symptoms are vague, and fatal if untreated.",
  scales: [
    {
      id: "adrenals",
      label: "Adrenal glands",
      model: adrenalsModel,
      findings: {
        "right-adrenal-gland": { affected: true, description: cortex },
        "left-adrenal-gland": { affected: true, description: cortex },
        "right-kidney": {
          affected: false,
          description:
            "Normal. Salt is lost in the urine because there is no aldosterone to hold it back, not because the kidney is diseased.",
        },
        "left-kidney": {
          affected: false,
          description:
            "Normal, with the same salt loss as the right for want of aldosterone.",
        },
        "middle-suprarenal-arteries": {
          affected: false,
          description:
            "Normal: the damage is autoimmune, not a failure of blood supply. Bleeding into both glands, in sepsis or on anticoagulants, is a rarer, sudden cause.",
        },
        "inferior-vena-cava": {
          affected: false,
          description:
            "Normal. The short right suprarenal vein drains straight into it.",
        },
      },
    },
  ],
  stages: [
    {
      id: "gradual-failure",
      label: "Gradual failure",
      time: "Months",
      summary:
        "Tiredness, weight loss, poor appetite, craving for salt and dizziness on standing, often put down to stress or depression. The skin darkens, most in creases, scars and inside the mouth, as the pituitary drives ACTH up.",
    },
    {
      id: "treated",
      label: "Treated",
      time: "Lifelong",
      summary:
        "Hydrocortisone two or three times a day and fludrocortisone once a day replace what the glands no longer make. Most feel well, but the dose must rise during illness, and a crisis can still follow vomiting or a missed dose.",
      findings: {
        adrenals: {
          "right-adrenal-gland": {
            affected: true,
            description:
              "Still destroyed: the cortex does not recover, so the replacement is lifelong.",
          },
          "left-adrenal-gland": {
            affected: true,
            description: "Still destroyed, as the right.",
          },
        },
      },
      investigations: [
        { name: "Sodium", result: "138 mmol/L" },
        { name: "Potassium", result: "4.4 mmol/L" },
        { name: "Renin", result: "Normal" },
        { name: "Standing blood pressure", result: "118/76 mmHg" },
      ],
    },
    {
      id: "adrenal-crisis",
      label: "Adrenal crisis",
      alternative: true,
      time: "Hours",
      summary:
        "Before diagnosis, or when doses are not raised for an infection or vomiting: vomiting, abdominal pain, confusion and shock. Without hydrocortisone at once it is fatal.",
      findings: {
        adrenals: {
          "right-adrenal-gland": {
            affected: true,
            description:
              "Cannot raise cortisol several-fold for the stress of illness, as a healthy gland would.",
          },
          "left-adrenal-gland": {
            affected: true,
            description: "Cannot respond either.",
          },
        },
      },
      investigations: [
        { name: "Blood pressure", result: "78/44 mmHg", flag: "low" },
        { name: "Sodium", result: "121 mmol/L", flag: "low" },
        { name: "Potassium", result: "6.2 mmol/L", flag: "high" },
        { name: "Glucose", result: "3.1 mmol/L", flag: "low" },
      ],
    },
  ],
  events: [
    {
      stage: "gradual-failure",
      label: "Synacthen test",
      description:
        "Cortisol measured before and 30 minutes after an injection of synthetic ACTH (tetracosactide). It barely rises from a failed cortex. In someone who is unwell, blood is taken for cortisol and ACTH, then hydrocortisone is given at once; treatment never waits for the test.",
    },
    {
      stage: "gradual-failure",
      label: "Finding the cause",
      description:
        "Antibodies to 21-hydroxylase confirm autoimmune disease. Without them, a CT of the adrenals looks for tuberculosis, bleeding or cancer. Autoimmune thyroid disease often comes with it, and type 1 diabetes less often.",
    },
    {
      stage: "treated",
      label: "Replacement",
      description:
        "Hydrocortisone in split doses, the largest on waking, to mimic the body's daily rhythm, and fludrocortisone for the missing aldosterone, adjusted by blood pressure, sodium, potassium and renin.",
    },
    {
      stage: "treated",
      label: "Sick day rules",
      description:
        "Double the hydrocortisone for a fever or an illness needing bed rest, and inject it if vomiting. A steroid emergency card tells others to give it, and an injection kit is kept at home.",
    },
    {
      stage: "adrenal-crisis",
      label: "Emergency hydrocortisone",
      time: "At once",
      description:
        "Hydrocortisone 100 mg into a vein or muscle, then 200 mg over the next day, with a litre of saline in the first hour and glucose if it is low; then the infection or other trigger is treated.",
    },
  ],
  investigations: [
    { name: "Sodium", result: "129 mmol/L", flag: "low" },
    { name: "Potassium", result: "5.6 mmol/L", flag: "high" },
    { name: "9 am cortisol", result: "62 nmol/L", flag: "low" },
    { name: "ACTH", result: "Very high", flag: "high" },
  ],
}

/** The adrenals failing gradually, the stage the viewer opens on. */
export const addisonsDiseaseModel = conditionModel(addisonsDisease)

export type AddisonsDiseaseProps = Omit<ConditionViewerProps, "condition">

export function AddisonsDisease(props: AddisonsDiseaseProps) {
  return <ConditionViewer condition={addisonsDisease} {...props} />
}
