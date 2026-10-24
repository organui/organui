import {
  diseaseModel,
  type Disease,
  type DiseaseFinding,
} from "@/components/disease-model"
import {
  DiseaseViewer,
  type DiseaseViewerProps,
} from "@/components/disease-viewer"
import { lungsModel } from "@/components/lungs"

// The model's four segments of the right lower lobe, which consolidate together.
const lowerLobe = ["FMA7366", "FMA7364", "FMA7363", "FMA7362"]

const consolidated = (description: string) =>
  Object.fromEntries(
    lowerLobe.map((id) => [id, { affected: true, description }])
  ) as Record<string, DiseaseFinding>

// Lobar pneumonia of the right lower lobe, usually pneumococcal: infection
// fills the alveoli of the whole lobe, which passes through four classic
// stages before it clears.
export const lobarPneumonia: Disease = {
  name: "Lobar pneumonia",
  code: "J18.1",
  summary:
    "Bacteria, most often Streptococcus pneumoniae, fill the alveoli of a whole lobe with inflammatory exudate, so that part of the lung stops exchanging gas.",
  scales: [
    {
      id: "lungs",
      label: "Lungs",
      model: lungsModel,
      // From the side, the oblique fissure separates the lower lobe from
      // the middle lobe in front of it.
      defaultView: "Right lateral",
      findings: {
        ...consolidated(
          "Protein-rich fluid, bacteria and a few neutrophils flood the alveoli. The lobe is heavy and red, and fine crackles are heard over the right base."
        ),
        FMA26661: {
          label: "Right bronchial tree",
          affected: false,
          description:
            "The airways stay open, so on X-ray their air shows as dark branches through the white lobe (air bronchograms).",
        },
        FMA7360: {
          affected: false,
          description:
            "The middle lobe is spared, so the right heart border it touches stays sharp on X-ray while the diaphragm outline behind the lower lobe is lost (the silhouette sign).",
        },
        FMA7361: {
          affected: false,
          description:
            "Spared. The oblique fissure confines the infection to the lower lobe.",
        },
      },
    },
  ],
  stages: [
    {
      id: "congestion",
      label: "Congestion",
      time: "Days 1–2",
      summary:
        "Fever, rigors and a cough; the lobe fills with fluid and bacteria multiply.",
    },
    {
      id: "red-hepatisation",
      label: "Red",
      time: "Days 2–4",
      summary:
        "Red hepatisation: the lobe is solid, red and airless, like liver; the cough brings up rust-coloured sputum.",
      findings: {
        lungs: consolidated(
          "Red cells, neutrophils and fibrin pack the alveoli. Percussion is dull and the breathing sounds bronchial, because sound carries through solid lung."
        ),
      },
      investigations: [
        { name: "SpO₂", result: "93% on air", flag: "low" },
        { name: "White cells", result: "Neutrophilia", flag: "high" },
        { name: "CRP", result: "Raised", flag: "high" },
        { name: "Chest X-ray", result: "RLL consolidation", flag: "abnormal" },
      ],
    },
    {
      id: "grey-hepatisation",
      label: "Grey",
      time: "Days 4–8",
      summary:
        "Grey hepatisation: red cells break down and the lobe turns grey-brown; with antibiotics, the fever settles.",
      findings: {
        lungs: consolidated(
          "Neutrophils and fibrin remain while red cells are broken down. The lobe is still solid, but the infection is being contained."
        ),
      },
      investigations: [
        { name: "Temperature", result: "Settling" },
        { name: "CRP", result: "Falling", flag: "high" },
        { name: "Chest X-ray", result: "RLL consolidation", flag: "abnormal" },
      ],
    },
    {
      id: "resolution",
      label: "Resolution",
      time: "From day 8",
      summary:
        "Enzymes and macrophages clear the exudate and the lobe's structure returns to normal.",
      findings: {
        lungs: consolidated(
          "The exudate is digested and coughed up or cleared by macrophages. The lung heals without a scar; the X-ray can take six weeks to clear."
        ),
      },
      investigations: [
        { name: "SpO₂", result: "Normal" },
        { name: "CRP", result: "Normalising" },
        {
          name: "Chest X-ray",
          result: "Repeat at 6 weeks if over 50 or smoking",
        },
      ],
    },
  ],
  events: [
    {
      stage: "congestion",
      label: "Chest X-ray",
      time: "Within 4 h",
      description:
        "Makes the diagnosis: a consolidated lobe, with air bronchograms where open airways run through it.",
    },
    {
      stage: "congestion",
      label: "CURB-65",
      time: "At diagnosis",
      description:
        "Scores confusion, urea, breathing rate, blood pressure and age 65 or over to decide between treatment at home, on the ward or in intensive care.",
    },
    {
      stage: "congestion",
      label: "Antibiotics",
      time: "Within 4 h",
      description:
        "Amoxicillin for low-severity pneumonia, broadened as the score rises; within an hour if there is sepsis.",
    },
    {
      stage: "resolution",
      label: "Repeat X-ray",
      time: "At 6 weeks",
      description:
        "Not routine after a full recovery; offered if symptoms persist or the risk of a hidden tumour is higher, as in smokers over 50.",
    },
  ],
  investigations: [
    { name: "Temperature", result: "38.9 °C", flag: "high" },
    { name: "Respiratory rate", result: "26 / min", flag: "high" },
    { name: "CRP", result: "Raised", flag: "high" },
    { name: "CURB-65", result: "0, treat at home" },
  ],
}

/** The lungs at congestion, the stage the viewer opens on. */
export const lobarPneumoniaModel = diseaseModel(lobarPneumonia)

export type LobarPneumoniaProps = Omit<DiseaseViewerProps, "disease">

export function LobarPneumonia(props: LobarPneumoniaProps) {
  return <DiseaseViewer disease={lobarPneumonia} {...props} />
}
