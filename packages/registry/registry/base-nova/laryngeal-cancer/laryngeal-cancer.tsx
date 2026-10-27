import { diseaseModel, type Disease } from "@/components/disease-model"
import {
  DiseaseViewer,
  type DiseaseViewerProps,
} from "@/components/disease-viewer"
import { larynxModel } from "@/components/larynx"

// Squamous cell carcinoma of the glottis, the vocal cords: it changes the
// voice while still tiny, so it is often found early, and the cords have so
// few lymphatics that it seldom spreads until it leaves them.
export const laryngealCancer: Disease = {
  name: "Laryngeal cancer",
  code: "C32.0",
  summary:
    "A squamous cell carcinoma of the vocal cords, caused mostly by smoking and alcohol. Hoarseness is the first sign, so it is often found small and cured with the voice kept; left to grow, it can cost the larynx.",
  scales: [
    {
      id: "larynx",
      label: "Larynx",
      model: larynxModel,
      defaultView: "Vocal cords",
      // Looking down on the cords: what lies above them is see-through, so
      // the cancer on them shows.
      translucentIds: [
        "hyoid-bone",
        "thyrohyoid-membrane",
        "epiglottis",
        "epiglottic-ligaments",
        "aryepiglottic-muscle",
        "thyro-arytenoid",
      ],
      findings: {
        "vocal-ligaments": {
          affected: true,
          description:
            "A white, irregular patch on the front of the left vocal cord. The cancer is confined to the cord's surface, which still moves normally (T1a), but stops the two cords meeting evenly, so the voice is hoarse.",
        },
        vocalis: {
          affected: false,
          description:
            "The muscle under the cord is not invaded, so the cord still moves.",
        },
        "arytenoid-cartilages": {
          affected: false,
          description:
            "Normal. They pivot to open and close the cords, which both still do.",
        },
        "thyroid-cartilage": {
          affected: false,
          description:
            "Intact. The front ends of the cords attach to its inner surface, close to where this cancer sits.",
        },
        epiglottis: {
          affected: false,
          description:
            "Normal. Cancers above the cords, here, cause fewer early symptoms and spread to neck nodes more often.",
        },
        "posterior-crico-arytenoid": {
          affected: false,
          description:
            "Normal. It is the only muscle that opens the cords for breathing.",
        },
      },
    },
  ],
  stages: [
    {
      id: "early",
      label: "Early",
      time: "Weeks of hoarseness",
      summary:
        "A hoarse voice that does not settle within three weeks, in a smoker in their sixties. There is no pain, lump or difficulty breathing. Radiotherapy or laser surgery cures about nine in ten.",
    },
    {
      id: "fixed-cord",
      label: "Fixed cord",
      time: "Months",
      summary:
        "Left untreated, the cancer grows into the muscle under the cord and above and below it. The cord stops moving, the voice weakens, and the narrowed airway can cause noisy breathing. Chemoradiotherapy can still keep the larynx.",
      findings: {
        larynx: {
          "vocal-ligaments": {
            affected: true,
            description:
              "The cancer covers the whole left cord and spreads onto the false cord above and the space below.",
          },
          vocalis: {
            affected: true,
            description: "Invaded, so the left cord is fixed in place (T3).",
          },
          "thyro-arytenoid": {
            affected: true,
            description:
              "Invaded alongside the vocalis, into the space between the cord and the thyroid cartilage.",
          },
        },
      },
      investigations: [
        {
          name: "Nasendoscopy",
          result: "Left cord fixed",
          flag: "abnormal",
        },
        { name: "CT neck", result: "Paraglottic spread", flag: "abnormal" },
        { name: "Neck nodes", result: "None" },
        { name: "CT chest", result: "No spread" },
      ],
    },
    {
      id: "through-cartilage",
      label: "Through the cartilage",
      time: "Months later",
      summary:
        "The cancer breaks through the thyroid cartilage into the neck (T4a), and often reaches the nodes. Radiotherapy alone controls it less well and leaves a poorly working larynx, so the larynx is removed and the patient breathes through a stoma in the neck.",
      findings: {
        larynx: {
          "vocal-ligaments": {
            affected: true,
            description: "Replaced by the tumour on the left.",
          },
          vocalis: {
            affected: true,
            description: "Invaded; the left cord is fixed.",
          },
          "thyro-arytenoid": { affected: true, description: "Invaded." },
          "thyroid-cartilage": {
            affected: true,
            description:
              "Eroded through its outer surface, the tumour reaching the soft tissues of the neck.",
          },
          "thyroid-gland": {
            affected: false,
            description:
              "Not invaded, though the half beside the tumour is usually removed with the larynx.",
          },
        },
      },
      investigations: [
        {
          name: "CT neck",
          result: "Cartilage eroded",
          flag: "abnormal",
        },
        { name: "Neck nodes", result: "One, 2 cm", flag: "abnormal" },
        { name: "Biopsy", result: "Squamous cell carcinoma", flag: "abnormal" },
      ],
    },
  ],
  events: [
    {
      stage: "early",
      label: "Nasendoscopy",
      time: "Within 2 weeks",
      description:
        "A thin camera through the nose shows the cords in clinic. A biopsy under general anaesthetic confirms the cancer.",
    },
    {
      stage: "early",
      label: "Radiotherapy or laser",
      description:
        "Radiotherapy, or removing the cancer with a laser through the mouth; both keep the voice, which radiotherapy often keeps better. Stopping smoking improves the chance of cure.",
    },
    {
      stage: "fixed-cord",
      label: "Chemoradiotherapy",
      description:
        "Radiotherapy with cisplatin, to keep the larynx; surgery is kept for a cancer that remains or returns.",
    },
    {
      stage: "through-cartilage",
      label: "Total laryngectomy",
      description:
        "The larynx is removed with the nodes in the neck, followed by radiotherapy. The trachea opens onto the neck for life, and a valve between the trachea and oesophagus lets the patient speak again.",
    },
  ],
  investigations: [
    {
      name: "Nasendoscopy",
      result: "Lesion, left cord",
      flag: "abnormal",
    },
    { name: "Biopsy", result: "Squamous cell carcinoma", flag: "abnormal" },
    { name: "Smoking", result: "40 pack-years", flag: "abnormal" },
  ],
}

/** The larynx with an early cancer of the left cord, the stage the viewer opens on. */
export const laryngealCancerModel = diseaseModel(laryngealCancer)

export type LaryngealCancerProps = Omit<DiseaseViewerProps, "disease">

export function LaryngealCancer(props: LaryngealCancerProps) {
  return <DiseaseViewer disease={laryngealCancer} {...props} />
}
