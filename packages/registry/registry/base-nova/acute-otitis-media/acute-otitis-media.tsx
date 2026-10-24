import { diseaseModel, type Disease } from "@/components/disease-model"
import {
  DiseaseViewer,
  type DiseaseViewerProps,
} from "@/components/disease-viewer"
import { earModel } from "@/components/ear"

const bathed =
  "Normal, but surrounded by fluid instead of air, so it carries sound to the inner ear poorly."

// Acute otitis media in a young child: a cold blocks the auditory tube, and
// the trapped middle ear fluid becomes infected behind the eardrum.
export const acuteOtitisMedia: Disease = {
  name: "Acute otitis media",
  code: "H66.0",
  summary:
    "An infection of the middle ear behind the eardrum, usually in a child under five after a cold. It is painful, but most settle within three days without antibiotics.",
  scales: [
    {
      id: "ear",
      label: "Ear",
      model: earModel,
      defaultView: "Lateral",
      // The outer ear is see-through, so the eardrum shows behind it.
      translucentIds: [
        "helix",
        "antihelix",
        "scapha-and-fossa",
        "concha",
        "tragus",
        "lobule",
        "back-of-auricle",
      ],
      findings: {
        "tympanic-membrane": {
          affected: true,
          description:
            "Red, and bulging outward with pus behind it. The bulge is the most reliable sign, and stretching the drum causes the pain.",
        },
        "auditory-tube": {
          affected: true,
          description:
            "Swollen shut by the cold, so the middle ear can neither drain nor fill with air. In young children it is short and nearly level, so it blocks easily.",
        },
        malleus: {
          affected: false,
          description:
            "Normal. Its handle, usually visible through the drum, is hidden by the bulge.",
        },
        incus: { affected: false, description: bathed },
        stapes: { affected: false, description: bathed },
        cochlea: {
          affected: false,
          description:
            "Normal: the hearing loss is conductive, from the middle ear, not from the inner ear.",
        },
        "chorda-tympani": {
          affected: false,
          description:
            "Crosses the middle ear behind the drum, carrying taste from the front two-thirds of the tongue, and is unaffected.",
        },
      },
    },
  ],
  stages: [
    {
      id: "acute",
      label: "Acute",
      time: "Days 1–3",
      summary:
        "Ear pain and fever a few days into a cold; a toddler pulls at the ear, cries and sleeps badly. Pain relief is the main treatment, and most get better within three days.",
    },
    {
      id: "glue-ear",
      label: "Glue ear",
      time: "Weeks after",
      summary:
        "The infection settles, but fluid often stays behind the drum for weeks (otitis media with effusion). There is no pain, only muffled hearing. In most children it clears within three months on its own.",
      findings: {
        ear: {
          "tympanic-membrane": {
            affected: true,
            description:
              "Dull and drawn inward, with fluid or bubbles visible behind it, but no longer red or bulging.",
          },
          "auditory-tube": {
            affected: true,
            description:
              "Still not opening well, so air in the middle ear is absorbed and fluid is not drained.",
          },
        },
      },
      investigations: [
        { name: "Otoscopy", result: "Dull, retracted drum", flag: "abnormal" },
        { name: "Tympanometry", result: "Flat (type B)", flag: "abnormal" },
        { name: "Hearing", result: "25 dB loss", flag: "abnormal" },
      ],
    },
    {
      id: "perforated",
      label: "Perforated",
      alternative: true,
      time: "Days 1–3",
      summary:
        "The pressure bursts the eardrum: the pain eases suddenly and pus runs from the ear. Most small tears heal within a few weeks.",
      findings: {
        ear: {
          "tympanic-membrane": {
            affected: true,
            description:
              "A small tear in its lower part, through which pus drains into the ear canal.",
          },
        },
      },
      investigations: [
        {
          name: "Otoscopy",
          result: "Discharge, perforation",
          flag: "abnormal",
        },
        { name: "Temperature", result: "37.4 °C" },
      ],
    },
  ],
  events: [
    {
      stage: "acute",
      label: "Pain relief",
      description:
        "Paracetamol or ibuprofen, or anaesthetic ear drops if the drum is intact, and a review if the child is not better in three days or is getting worse.",
    },
    {
      stage: "acute",
      label: "Antibiotics when needed",
      description:
        "Amoxicillin for five to seven days for a child who is systemically unwell, under two with both ears infected, or with discharge; otherwise often a prescription to collect only if it is no better in a few days.",
    },
    {
      stage: "glue-ear",
      label: "Watchful waiting",
      time: "3 months",
      description:
        "A hearing test, then a recheck after three months. Antibiotics and decongestants do not help.",
    },
    {
      stage: "glue-ear",
      label: "Grommets",
      description:
        "Small tubes through the drum let air in, for glue ear in both ears lasting over three months with hearing loss; hearing aids are the alternative.",
    },
    {
      stage: "perforated",
      label: "Keep it dry",
      description:
        "Antibiotics, as discharge is a reason for them, and no swimming until the drum has healed. A tear still open after six weeks needs an ear, nose and throat review.",
    },
  ],
  investigations: [
    { name: "Otoscopy", result: "Red, bulging drum", flag: "abnormal" },
    { name: "Temperature", result: "38.6 °C", flag: "high" },
  ],
}

/** The ear in acute infection, the stage the viewer opens on. */
export const acuteOtitisMediaModel = diseaseModel(acuteOtitisMedia)

export type AcuteOtitisMediaProps = Omit<DiseaseViewerProps, "disease">

export function AcuteOtitisMedia(props: AcuteOtitisMediaProps) {
  return <DiseaseViewer disease={acuteOtitisMedia} {...props} />
}
