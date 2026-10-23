import { diseaseModel, type Disease } from "@/components/disease-model"
import {
  DiseaseViewer,
  type DiseaseViewerProps,
} from "@/components/disease-viewer"
import { bladderModel } from "@/components/bladder"
import { prostateModel } from "@/components/prostate"

// Benign prostatic hyperplasia on the prostate, where the gland grows around
// the urethra, and on the bladder, which pays for the obstruction.
export const benignProstaticHyperplasia: Disease = {
  name: "Benign prostatic hyperplasia",
  code: "N40",
  summary:
    "The prostate's inner zone enlarges with age and squeezes the urethra running through it. The bladder works harder to empty, and in the end may fail.",
  scales: [
    {
      id: "prostate",
      label: "Prostate",
      model: prostateModel,
      defaultView: "Lateral",
      findings: {
        prostate: {
          affected: true,
          description:
            "Nodules of glands and muscle grow in the transition zone around the urethra, driven by dihydrotestosterone. Symptoms depend on how it narrows the urethra more than on its size.",
        },
        urethra: {
          affected: true,
          description:
            "The prostatic urethra is compressed: hesitancy, a weak stream and dribbling at the end. Alpha blockers relax the muscle around it.",
        },
        "urinary-bladder": {
          affected: true,
          description:
            "Pushes against the obstruction and becomes overactive: frequency, urgency and getting up at night to pass urine.",
        },
        rectum: {
          affected: false,
          description:
            "The gland is felt through its wall: smooth, firm and enlarged. A hard, irregular gland suggests cancer, which arises in the outer zone.",
        },
        "seminal-vesicles": {
          affected: false,
          description:
            "Not involved. 5-alpha reductase inhibitors, which shrink the gland over months, can reduce ejaculate volume and libido.",
        },
      },
    },
    {
      id: "bladder",
      label: "Bladder",
      model: bladderModel,
      findings: {
        "urinary-bladder": {
          affected: true,
          description:
            "The detrusor muscle thickens to push past the obstruction, and its wall becomes ridged (trabeculated).",
        },
        prostate: {
          affected: true,
          description:
            "Enlarged and bulging up into the bladder base, which can act like a valve over the outlet.",
        },
        urethra: {
          affected: true,
          description: "Narrowed where it passes through the prostate.",
        },
        "right-ureter": {
          affected: false,
          description:
            "Drains normally while the bladder can still empty at low pressure.",
        },
        "left-ureter": {
          affected: false,
          description:
            "Drains normally while the bladder can still empty at low pressure.",
        },
      },
    },
  ],
  stages: [
    {
      id: "symptoms",
      label: "Symptoms",
      summary:
        "Lower urinary tract symptoms that bother the patient. Lifestyle changes, then an alpha blocker, a 5-alpha reductase inhibitor or both.",
    },
    {
      id: "chronic-retention",
      label: "Chronic retention",
      summary:
        "The bladder never empties fully. It stretches painlessly, leaks by overflow, and the pressure inside it backs up to the kidneys.",
      findings: {
        bladder: {
          "urinary-bladder": {
            affected: true,
            description:
              "Thick-walled and trabeculated, and distended with a large residual volume after voiding. The high pressure inside it leaks out by overflow, often at night.",
          },
          "right-ureter": {
            affected: true,
            description:
              "High pressure in the bladder stops urine draining, so the ureter and kidney dilate (hydroureteronephrosis) and kidney function falls.",
          },
          "left-ureter": {
            affected: true,
            description:
              "Dilated like the right; both kidneys suffer, so creatinine rises. A catheter, then surgery, relieves it.",
          },
        },
      },
      investigations: [
        { name: "Post-void residual", result: "650 mL", flag: "high" },
        { name: "Creatinine", result: "Raised", flag: "high" },
        {
          name: "Ultrasound",
          result: "Bilateral hydronephrosis",
          flag: "abnormal",
        },
        { name: "PSA", result: "Mildly raised", flag: "high" },
      ],
    },
    {
      id: "acute-retention",
      label: "Acute retention",
      summary:
        "Suddenly unable to pass urine, with a painful, full bladder. Constipation, anticholinergics or alcohol often trigger it; a catheter brings instant relief.",
      findings: {
        prostate: {
          urethra: {
            affected: true,
            description:
              "Closed off completely. A catheter is passed through it; a trial without catheter follows after an alpha blocker.",
          },
          "urinary-bladder": {
            affected: true,
            description:
              "Painfully distended above the pubic bone. Transurethral resection of the prostate (TURP) prevents it happening again.",
          },
        },
      },
      investigations: [
        { name: "Bladder scan", result: "900 mL", flag: "high" },
        { name: "Creatinine", result: "Normal" },
        { name: "Urine dipstick", result: "Normal" },
      ],
    },
  ],
  investigations: [
    { name: "IPSS", result: "19 of 35", flag: "high" },
    { name: "Flow rate (Qmax)", result: "8 mL/s", flag: "low" },
    { name: "Post-void residual", result: "120 mL", flag: "high" },
    { name: "PSA", result: "Mildly raised", flag: "high" },
  ],
}

/** The prostate with symptoms, the scale and stage the viewer opens on. */
export const benignProstaticHyperplasiaModel = diseaseModel(
  benignProstaticHyperplasia
)

export type BenignProstaticHyperplasiaProps = Omit<
  DiseaseViewerProps,
  "disease"
>

export function BenignProstaticHyperplasia(
  props: BenignProstaticHyperplasiaProps
) {
  return <DiseaseViewer disease={benignProstaticHyperplasia} {...props} />
}
