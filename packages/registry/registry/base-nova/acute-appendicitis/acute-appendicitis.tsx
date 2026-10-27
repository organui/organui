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
    "The appendix lumen becomes blocked, mucus and bacteria build up behind it, and the inflamed wall can die and perforate within a day or two.",
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
            "The caecum is not involved yet. Pressing in the left iliac fossa hurts in the right (Rovsing's sign) once the appendix is inflamed.",
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
      time: "0–12 h",
      summary:
        "Central abdominal pain, loss of appetite and nausea; the examination can still be unremarkable.",
    },
    {
      id: "suppurative",
      label: "Suppurative",
      time: "12–48 h",
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
      time: "After 48 h",
      summary:
        "The dead wall gives way; pus forms an abscess or spreads as peritonitis. Pain may ease briefly, then the patient becomes unwell.",
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
  events: [
    {
      stage: "early",
      label: "Alvarado score",
      description:
        "Adds up the migrating pain, symptoms, tenderness, fever and white count; a low score makes appendicitis unlikely. The AIR and Adult Appendicitis scores are now preferred.",
    },
    {
      stage: "suppurative",
      label: "Imaging",
      description:
        "Ultrasound first in children and young women: an appendix over 6 mm that does not compress points to appendicitis. CT in other adults when the diagnosis is unsure.",
    },
    {
      stage: "suppurative",
      label: "Appendicectomy",
      description:
        "Laparoscopic removal with antibiotics, usually within 24 hours. Some uncomplicated cases without a faecolith settle with antibiotics alone.",
    },
    {
      stage: "perforated",
      label: "Drainage",
      description:
        "An abscess is drained, often through the skin under imaging, with antibiotics; generalised peritonitis needs surgery at once.",
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
