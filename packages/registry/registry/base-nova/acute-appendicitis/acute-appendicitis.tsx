import { diseaseModel, type Disease } from "@/components/disease-model"
import {
  DiseaseViewer,
  type DiseaseViewerProps,
} from "@/components/disease-viewer"
import { appendixModel } from "@/components/appendix"

// Acute appendicitis: a blocked appendix becomes infected, its wall dies and,
// left untreated, perforates. The neighbours it inflames explain the signs.
export const acuteAppendicitis: Disease = {
  name: "Acute appendicitis",
  code: "K35.8",
  summary:
    "The appendix's lumen blocks, mucus and bacteria build up behind it, and the inflamed wall can die and perforate within a day or two.",
  scales: [
    {
      id: "appendix",
      label: "Appendix",
      model: appendixModel,
      findings: {
        appendix: {
          label: "Appendix",
          affected: true,
          description:
            "A faecolith or swollen lymphoid tissue blocks the lumen and mucus distends it. The pain is visceral, felt vaguely around the umbilicus.",
        },
        colon: {
          affected: false,
          description:
            "The caecum is not involved yet. Pressing on the left side of the abdomen pushes gas back towards it and hurts on the right (Rovsing's sign) once the appendix is inflamed.",
        },
        ileum: {
          affected: false,
          description:
            "Not involved. Terminal ileitis, as in Crohn's disease, is one of the conditions that mimic appendicitis.",
        },
        "right-psoas-major": {
          affected: false,
          description:
            "Not involved while the inflammation stays inside the appendix.",
        },
      },
    },
  ],
  stages: [
    {
      id: "early",
      label: "Early",
      summary:
        "The first 12 hours. Central abdominal pain, loss of appetite and nausea; the examination can still be unremarkable.",
    },
    {
      id: "suppurative",
      label: "Suppurative",
      summary:
        "Bacteria invade the wall. The pain moves to the right iliac fossa as the inflamed appendix touches the parietal peritoneum.",
      findings: {
        appendix: {
          appendix: {
            label: "Appendix",
            affected: true,
            description:
              "Swollen, red and coated with pus. Tender at McBurney's point, a third of the way from the anterior superior iliac spine to the umbilicus.",
          },
          "right-psoas-major": {
            affected: true,
            description:
              "A retrocaecal appendix lies on the psoas and inflames it, so extending the right hip hurts (psoas sign).",
          },
        },
      },
      investigations: [
        { name: "White cells", result: "Neutrophilia", flag: "high" },
        { name: "CRP", result: "Raised", flag: "high" },
        { name: "Ultrasound", result: "Appendix > 6 mm", flag: "abnormal" },
        { name: "Alvarado score", result: "7 of 10", flag: "high" },
      ],
    },
    {
      id: "perforated",
      label: "Perforated",
      summary:
        "Usually after 48 hours. The dead wall gives way; pus forms an abscess or spreads as peritonitis. Pain may ease briefly, then the patient becomes unwell.",
      findings: {
        appendix: {
          appendix: {
            label: "Appendix",
            affected: true,
            description:
              "Gangrenous and perforated. Pus and faeces leak into the right iliac fossa.",
          },
          colon: {
            affected: true,
            description:
              "The caecal wall around the abscess is inflamed (a phlegmon), which can make the appendix stump hard to close at surgery.",
          },
          ileum: {
            affected: true,
            description:
              "The nearby ileum stops moving (ileus) and is stuck to the abscess, causing vomiting and distension.",
          },
          "right-psoas-major": {
            affected: true,
            description:
              "Inflamed by the abscess against it; the patient lies with the right hip flexed.",
          },
        },
      },
      investigations: [
        { name: "Temperature", result: "38.6 °C", flag: "high" },
        { name: "CRP", result: "Very raised", flag: "high" },
        { name: "Lactate", result: "Raised", flag: "high" },
        { name: "CT", result: "Abscess, free fluid", flag: "abnormal" },
      ],
    },
  ],
  investigations: [
    { name: "White cells", result: "Mildly raised", flag: "high" },
    { name: "CRP", result: "Normal or raised" },
    { name: "Pregnancy test", result: "Negative" },
    { name: "Urine dipstick", result: "Normal" },
  ],
}

/** The appendix early on, the stage the viewer opens on. */
export const acuteAppendicitisModel = diseaseModel(acuteAppendicitis)

export type AcuteAppendicitisProps = Omit<DiseaseViewerProps, "disease">

export function AcuteAppendicitis(props: AcuteAppendicitisProps) {
  return <DiseaseViewer disease={acuteAppendicitis} {...props} />
}
