import { diseaseModel, type Disease } from "@/components/disease-model"
import {
  DiseaseViewer,
  type DiseaseViewerProps,
} from "@/components/disease-viewer"
import { kidneysModel } from "@/components/kidneys"

// A stone in the left kidney that moves into the ureter: harmless while it
// sits still, agonising when it moves, and an emergency when the kidney
// behind it is infected.
export const kidneyStones: Disease = {
  name: "Kidney stones",
  code: "N20.0",
  summary:
    "Crystals of calcium oxalate grow into a stone in the kidney. It is often silent until it moves into the ureter and blocks it.",
  scales: [
    {
      id: "kidneys",
      label: "Kidneys",
      model: kidneysModel,
      defaultView: "Posterior",
      findings: {
        "left-kidney": {
          affected: true,
          description:
            "A stone sits in a calyx or the renal pelvis. Dehydration, a high-salt diet and high urinary calcium make stones; many are found by chance.",
        },
        "left-ureter": {
          affected: false,
          description:
            "Clear for now. It narrows at three points where a stone can stick: the pelviureteric junction, the pelvic brim and the bladder wall.",
        },
        "right-kidney": {
          affected: false,
          description:
            "Normal. Stones recur in about half of people within ten years, on either side.",
        },
        "left-renal-artery": {
          affected: false,
          description:
            "Not involved. An embolus or dissection here also causes sudden loin pain and often blood in the urine; contrast CT shows the wedge-shaped infarct. In an older patient, a leaking aortic aneurysm must be excluded first.",
        },
      },
    },
  ],
  stages: [
    {
      id: "renal-stone",
      label: "Renal stone",
      summary:
        "A stone in the kidney. Small ones are watched; larger ones are broken up with shock waves or removed through a scope.",
    },
    {
      id: "colic",
      label: "Renal colic",
      summary:
        "The stone moves into the ureter. Waves of severe loin-to-groin pain come with each contraction; most stones under 5 mm pass on their own.",
      findings: {
        kidneys: {
          "left-ureter": {
            affected: true,
            description:
              "The stone lodges at the vesicoureteric junction, where the ureter enters the bladder. Peristalsis against it causes colic; tamsulosin helps it pass.",
          },
          "left-kidney": {
            affected: true,
            description:
              "Urine backs up and the collecting system dilates (hydronephrosis). Kidney function is preserved while the other kidney works.",
          },
        },
      },
      investigations: [
        { name: "Urine dipstick", result: "Blood", flag: "abnormal" },
        { name: "CT KUB", result: "4 mm stone at VUJ", flag: "abnormal" },
        { name: "Creatinine", result: "Normal" },
        { name: "Temperature", result: "Normal" },
      ],
    },
    {
      id: "infected",
      label: "Infected",
      summary:
        "Infection behind the blocked ureter. Fever with an obstructed kidney is an emergency: drain it with a stent or nephrostomy before the stone is treated.",
      findings: {
        kidneys: {
          "left-ureter": {
            affected: true,
            description:
              "Still blocked, so infected urine cannot drain and antibiotics alone fail.",
          },
          "left-kidney": {
            affected: true,
            description:
              "Pus fills the dilated collecting system (pyonephrosis). Bacteria pass into the blood, causing sepsis that can kill within hours.",
          },
        },
      },
      investigations: [
        { name: "Temperature", result: "39.2 °C", flag: "high" },
        { name: "White cells", result: "Raised", flag: "high" },
        { name: "Creatinine", result: "Raised", flag: "high" },
        { name: "Lactate", result: "Raised", flag: "high" },
      ],
    },
  ],
  investigations: [
    { name: "CT KUB", result: "6 mm renal stone", flag: "abnormal" },
    { name: "Urine calcium", result: "Raised", flag: "high" },
    { name: "Serum calcium", result: "Normal" },
    { name: "Urate", result: "Normal" },
  ],
}

/** The kidneys with a stone in the left kidney, the stage the viewer opens on. */
export const kidneyStonesModel = diseaseModel(kidneyStones)

export type KidneyStonesProps = Omit<DiseaseViewerProps, "disease">

export function KidneyStones(props: KidneyStonesProps) {
  return <DiseaseViewer disease={kidneyStones} {...props} />
}
