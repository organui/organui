import { diseaseModel, type Disease } from "@/components/disease-model"
import {
  DiseaseViewer,
  type DiseaseViewerProps,
} from "@/components/disease-viewer"
import { eyeModel } from "@/components/eye"
import { thyroidModel } from "@/components/thyroid"

const goitre =
  "Antibodies against the TSH receptor switch the gland on: it grows evenly into a smooth goitre and overproduces thyroid hormone."

// Graves' disease on the thyroid, where the antibodies drive the gland, and
// on the eye, where the same autoimmunity swells the muscles behind it.
export const gravesDisease: Disease = {
  name: "Graves' disease",
  code: "E05.0",
  summary:
    "Autoantibodies stimulate the TSH receptor, causing hyperthyroidism with a diffuse goitre. In about a quarter of people, the same immune attack swells the tissues behind the eyes.",
  scales: [
    {
      id: "thyroid",
      label: "Thyroid",
      model: thyroidModel,
      findings: {
        "right-lobe": { affected: true, description: goitre },
        "left-lobe": { affected: true, description: goitre },
        isthmus: {
          affected: true,
          description:
            "Enlarged with the lobes, so the goitre is symmetrical and moves up when the patient swallows.",
        },
        "superior-thyroid-artery": {
          affected: true,
          description:
            "Blood flow through the gland rises, and a bruit can be heard over it with a stethoscope.",
        },
        trachea: {
          affected: false,
          description:
            "A Graves' goitre is usually modest and rarely narrows the trachea, unlike a large multinodular goitre.",
        },
        "right-inferior-parathyroid": {
          affected: false,
          description:
            "Unaffected by the disease. At thyroidectomy the parathyroids must be preserved, or calcium falls afterwards.",
        },
        "right-recurrent-laryngeal-nerve": {
          affected: false,
          description:
            "Unaffected by the disease, but it runs behind the gland and is at risk during thyroidectomy, causing hoarseness.",
        },
      },
    },
    {
      id: "eye",
      label: "Eye",
      model: eyeModel,
      defaultView: "Lateral",
      findings: {
        "levator-palpebrae": {
          affected: true,
          description:
            "Excess thyroid hormone drives the sympathetic Müller's muscle beneath it, so the upper lid retracts and lags behind the eye when looking down, giving a staring look.",
        },
        "inferior-rectus": {
          affected: false,
          description:
            "Normal at first. It is the muscle most often enlarged once eye disease begins.",
        },
        "optic-nerve": {
          affected: false,
          description:
            "Normal. Swollen muscles crowding the orbital apex can compress it, a sight-threatening emergency.",
        },
      },
    },
  ],
  stages: [
    {
      id: "thyrotoxic",
      label: "Thyrotoxic",
      summary:
        "Weight loss, tremor, heat intolerance and palpitations. Beta blockers ease the symptoms while carbimazole lowers hormone production.",
    },
    {
      id: "active-eye",
      label: "Active eye",
      summary:
        "Active thyroid eye disease. The muscles and fat behind the eye swell and push it forward; stopping smoking and treating early limit the damage.",
      findings: {
        eye: {
          "inferior-rectus": {
            affected: true,
            description:
              "The most often enlarged muscle. Swollen with lymphocytes and water-binding glycosaminoglycans, it tethers the eye, so looking up causes double vision.",
          },
          "medial-rectus": {
            affected: true,
            description:
              "Next most often enlarged. Its tendon is spared on CT or MRI, which tells thyroid eye disease from orbital myositis.",
          },
          "superior-rectus": {
            affected: true,
            description:
              "Enlarged with the levator above it. Swollen and tight, it restricts looking down.",
          },
          cornea: {
            affected: true,
            description:
              "Proptosis and lid retraction leave it exposed, so the eyes feel gritty and water. Lubricants protect it.",
          },
          "optic-nerve": {
            affected: false,
            description:
              "Still normal, but checked at every visit: falling colour vision or acuity means compression and needs urgent steroids or decompression.",
          },
        },
      },
      investigations: [
        { name: "Clinical activity score", result: "4 of 7", flag: "high" },
        { name: "Exophthalmometry", result: "23 mm", flag: "high" },
        { name: "Orbit MRI", result: "Enlarged muscles", flag: "abnormal" },
        { name: "Colour vision", result: "Normal" },
      ],
    },
    {
      id: "inactive",
      label: "Inactive",
      summary:
        "After one to two years the eye disease burns out. The thyroid is controlled; any remaining proptosis or squint can now be corrected surgically.",
      findings: {
        thyroid: {
          "right-lobe": {
            affected: true,
            description:
              "Treated: carbimazole for 12 to 18 months, or radioiodine or surgery, after which levothyroxine replaces the hormone for life.",
          },
          "left-lobe": {
            affected: true,
            description:
              "Treated with the right lobe; about half of people relapse after a course of carbimazole.",
          },
          isthmus: {
            affected: true,
            description:
              "Treated with the lobes. The goitre shrinks with control, and is gone after radioiodine or surgery.",
          },
          "superior-thyroid-artery": {
            affected: false,
            description:
              "Blood flow returns to normal once the thyroid is controlled, and the bruit goes.",
          },
        },
        eye: {
          "inferior-rectus": {
            affected: true,
            description:
              "Fibrosed and shortened. The restriction is now fixed; squint surgery can correct the double vision.",
          },
          "medial-rectus": {
            affected: true,
            description:
              "Fibrosed, with less swelling than in the active phase.",
          },
        },
      },
      investigations: [
        { name: "TSH", result: "Normal" },
        { name: "TRAb", result: "Falling" },
        { name: "Clinical activity score", result: "0 of 7" },
        { name: "Exophthalmometry", result: "22 mm", flag: "high" },
      ],
    },
  ],
  investigations: [
    { name: "TSH", result: "Suppressed", flag: "low" },
    { name: "Free T4", result: "Raised", flag: "high" },
    { name: "TRAb", result: "Positive", flag: "abnormal" },
    { name: "Heart rate", result: "112 / min", flag: "high" },
  ],
}

/** The thyroid when thyrotoxic, the scale and stage the viewer opens on. */
export const gravesDiseaseModel = diseaseModel(gravesDisease)

export type GravesDiseaseProps = Omit<DiseaseViewerProps, "disease">

export function GravesDisease(props: GravesDiseaseProps) {
  return <DiseaseViewer disease={gravesDisease} {...props} />
}
