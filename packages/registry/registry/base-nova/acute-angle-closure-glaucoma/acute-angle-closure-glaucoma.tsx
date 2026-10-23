import { diseaseModel, type Disease } from "@/components/disease-model"
import {
  DiseaseViewer,
  type DiseaseViewerProps,
} from "@/components/disease-viewer"
import { eyeModel } from "@/components/eye"

// Acute angle-closure glaucoma: in a crowded eye the iris blocks the
// drainage angle, pressure soars within hours, and the optic nerve is lost
// unless it comes down.
export const acuteAngleClosureGlaucoma: Disease = {
  name: "Acute angle-closure glaucoma",
  code: "H40.2",
  summary:
    "The iris bows forward and closes the angle where aqueous drains. Pressure in the eye climbs within hours, threatening the optic nerve: an emergency.",
  scales: [
    {
      id: "eye",
      label: "Eye",
      model: eyeModel,
      findings: {
        iris: {
          affected: true,
          description:
            "In dim light the pupil half-dilates and the iris presses on the lens. Aqueous builds up behind it and pushes it forward against the drainage angle (pupil block).",
        },
        "anterior-chamber": {
          affected: true,
          description:
            "Shallow, with its angle closed: aqueous cannot reach the trabecular meshwork, so pressure rises to 50–70 mmHg.",
        },
        cornea: {
          affected: true,
          description:
            "Waterlogged by the pressure and hazy: blurred vision and coloured haloes around lights, in a red, painful eye with vomiting.",
        },
        lens: {
          affected: true,
          description:
            "Thick and sitting forward in an older or long-sighted eye, it crowds the angle in the first place. Removing it with cataract surgery deepens the angle for good.",
        },
        "optic-nerve": {
          affected: false,
          description:
            "Still healthy, but sustained pressure damages it within hours to days. Bringing the pressure down saves it.",
        },
        retina: {
          affected: false,
          description:
            "Not involved, though pressure on the optic nerve head reduces its blood supply.",
        },
      },
    },
  ],
  stages: [
    {
      id: "attack",
      label: "Attack",
      summary:
        "Hours old. Lower the pressure now: acetazolamide, pressure-lowering drops and pilocarpine to pull the iris away from the angle, then laser.",
    },
    {
      id: "iridotomy",
      label: "Iridotomy",
      summary:
        "The attack is over. A laser hole in the peripheral iris lets aqueous bypass the pupil, the iris flattens and the angle reopens. The other eye is treated too.",
      findings: {
        eye: {
          iris: {
            affected: true,
            description:
              "Has a small laser hole near its root, so aqueous flows straight to the angle and pupil block cannot recur.",
          },
          "anterior-chamber": {
            affected: false,
            description:
              "Deeper, with the angle open again on gonioscopy; aqueous drains and pressure is normal.",
          },
          cornea: {
            affected: false,
            description: "Clear again once the pressure has come down.",
          },
        },
      },
      investigations: [
        { name: "Eye pressure", result: "16 mmHg" },
        { name: "Gonioscopy", result: "Open angle" },
        { name: "Visual acuity", result: "6/9" },
        { name: "Fellow eye", result: "Laser iridotomy" },
      ],
    },
    {
      id: "glaucomatous",
      label: "Damaged",
      summary:
        "Treatment came late. The angle has scarred shut in places and the optic nerve is damaged; the lost vision does not return.",
      findings: {
        eye: {
          "optic-nerve": {
            affected: true,
            description:
              "Cupped and pale where nerve fibres died under the pressure, with matching gaps in the visual field. Drops or surgery protect what is left.",
          },
          "anterior-chamber": {
            affected: true,
            description:
              "The iris has stuck to the angle in places (synechiae), so drainage stays poor despite the laser hole.",
          },
          iris: {
            affected: true,
            description:
              "The laser hole is open, but the attack left patches of atrophy and stuck the iris root to the angle (peripheral anterior synechiae).",
          },
          cornea: {
            affected: false,
            description:
              "Clear: the pressure is raised but rises slowly, so the eye is quiet and the damage goes unnoticed.",
          },
        },
      },
      investigations: [
        { name: "Eye pressure", result: "28 mmHg", flag: "high" },
        { name: "Optic disc", result: "Cup-disc ratio 0.8", flag: "abnormal" },
        { name: "Visual field", result: "Arcuate defect", flag: "abnormal" },
        { name: "Gonioscopy", result: "Synechial closure", flag: "abnormal" },
      ],
    },
  ],
  investigations: [
    { name: "Eye pressure", result: "58 mmHg", flag: "high" },
    { name: "Visual acuity", result: "6/36", flag: "low" },
    { name: "Pupil", result: "Fixed, mid-dilated", flag: "abnormal" },
    { name: "Gonioscopy", result: "Closed angle", flag: "abnormal" },
  ],
}

/** The eye during the attack, the stage the viewer opens on. */
export const acuteAngleClosureGlaucomaModel = diseaseModel(
  acuteAngleClosureGlaucoma
)

export type AcuteAngleClosureGlaucomaProps = Omit<DiseaseViewerProps, "disease">

export function AcuteAngleClosureGlaucoma(
  props: AcuteAngleClosureGlaucomaProps
) {
  return <DiseaseViewer disease={acuteAngleClosureGlaucoma} {...props} />
}
