import { diseaseModel, type Disease } from "@/components/disease-model"
import {
  DiseaseViewer,
  type DiseaseViewerProps,
} from "@/components/disease-viewer"
import { pituitaryModel } from "@/components/pituitary"

// A non-functioning pituitary adenoma: harmless while small, then pressing on
// the optic chiasm above and the normal gland around it, and occasionally
// bleeding into itself.
export const pituitaryAdenoma: Disease = {
  name: "Pituitary adenoma",
  code: "D35.2",
  summary:
    "A benign tumour of the pituitary. Its effects come from what it makes, what it squeezes out of the normal gland, and what it presses on as it grows.",
  scales: [
    {
      id: "pituitary",
      label: "Pituitary",
      model: pituitaryModel,
      findings: {
        "pituitary-gland": {
          affected: true,
          description:
            "A microadenoma under 1 cm inside the sella, often found by chance on a scan. Most make no hormone and are simply watched.",
        },
        "optic-chiasm": {
          affected: false,
          description:
            "Sits above the sella with a gap of fluid between, out of reach of a small tumour.",
        },
        "right-cavernous-sinus": {
          affected: false,
          description:
            "Beside the sella, carrying the internal carotid and the nerves that move the eye. A growing tumour can invade it.",
        },
        "hypophyseal-portal-veins": {
          affected: false,
          description:
            "Carry dopamine from the hypothalamus down the stalk, keeping prolactin in check.",
        },
        "sphenoid-bone": {
          affected: false,
          description:
            "The route for surgery: the tumour is removed through the nose and sphenoid sinus (transsphenoidal surgery).",
        },
      },
    },
  ],
  stages: [
    {
      id: "microadenoma",
      label: "Micro",
      summary:
        "Under 1 cm, confined to the sella. Check the hormones once, and repeat the MRI to see whether it grows.",
    },
    {
      id: "macroadenoma",
      label: "Macro",
      summary:
        "Over 1 cm and growing up out of the sella. It presses on the optic chiasm and on the normal gland, which fails one hormone at a time.",
      findings: {
        pituitary: {
          "pituitary-gland": {
            affected: true,
            description:
              "A macroadenoma squeezing the normal gland: growth hormone and the gonadotrophins fail first, then TSH and ACTH.",
          },
          "optic-chiasm": {
            affected: true,
            description:
              "Pressed from below, so the crossing fibres from the nasal halves of each retina fail first: both outer visual fields go (bitemporal hemianopia), often unnoticed.",
          },
          "hypophyseal-portal-veins": {
            affected: true,
            description:
              "The stalk and its portal veins are compressed, so less dopamine reaches the gland and prolactin rises modestly (stalk effect), unlike the very high levels of a prolactinoma.",
          },
        },
      },
      investigations: [
        {
          name: "Visual fields",
          result: "Bitemporal hemianopia",
          flag: "abnormal",
        },
        { name: "MRI", result: "2.4 cm macroadenoma", flag: "abnormal" },
        { name: "Prolactin", result: "Mildly raised", flag: "high" },
        { name: "9 am cortisol", result: "Low", flag: "low" },
      ],
    },
    {
      id: "apoplexy",
      label: "Apoplexy",
      summary:
        "The tumour suddenly bleeds or dies: thunderclap headache, vomiting, loss of vision and double vision. Give hydrocortisone first; surgery decompresses it.",
      findings: {
        pituitary: {
          "pituitary-gland": {
            affected: true,
            description:
              "Haemorrhage into the tumour expands it within hours. Sudden ACTH loss can cause an adrenal crisis, which kills if steroids are not given.",
          },
          "optic-chiasm": {
            affected: true,
            description: "Suddenly compressed: vision can fall within hours.",
          },
          "right-cavernous-sinus": {
            affected: true,
            description:
              "Blood and swelling press on the oculomotor, trochlear and abducens nerves in its wall: a drooping lid and double vision.",
          },
        },
      },
      investigations: [
        { name: "9 am cortisol", result: "Very low", flag: "low" },
        { name: "Sodium", result: "Low", flag: "low" },
        { name: "MRI", result: "Haemorrhage in tumour", flag: "abnormal" },
        { name: "Visual acuity", result: "Falling", flag: "low" },
      ],
    },
  ],
  investigations: [
    { name: "MRI", result: "8 mm adenoma", flag: "abnormal" },
    { name: "Prolactin", result: "Normal" },
    { name: "IGF-1", result: "Normal" },
    { name: "Visual fields", result: "Full" },
  ],
}

/** The pituitary with a microadenoma, the stage the viewer opens on. */
export const pituitaryAdenomaModel = diseaseModel(pituitaryAdenoma)

export type PituitaryAdenomaProps = Omit<DiseaseViewerProps, "disease">

export function PituitaryAdenoma(props: PituitaryAdenomaProps) {
  return <DiseaseViewer disease={pituitaryAdenoma} {...props} />
}
