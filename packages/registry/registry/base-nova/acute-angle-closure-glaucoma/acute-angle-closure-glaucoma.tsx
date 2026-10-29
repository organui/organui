import { conditionModel, type Condition } from "@/components/condition-model"
import {
  ConditionViewer,
  type ConditionViewerProps,
} from "@/components/condition-viewer"
import { eyeModel } from "@/components/eye"

// Acute angle-closure glaucoma: in a crowded eye the iris blocks the
// drainage angle, pressure soars within hours, and the optic nerve is lost
// unless it comes down.
export const acuteAngleClosureGlaucoma: Condition = {
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
            "In dim light the pupil half-dilates and the iris presses on the lens. Aqueous builds up behind it and bows the peripheral iris forward against the drainage angle (pupil block).",
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
            "Not involved, though very high pressure can block the retinal vessels (central retinal vein or artery occlusion).",
        },
      },
    },
  ],
  stages: [
    {
      id: "attack",
      label: "Attack",
      time: "Hours",
      summary:
        "Lower the pressure now: acetazolamide, pressure-lowering and steroid drops, then pilocarpine once the pressure falls, to pull the iris away from the angle. Mannitol if it does not come down. Then laser.",
    },
    {
      id: "iridotomy",
      label: "Iridotomy",
      time: "Days later",
      summary:
        "The attack is over. A laser hole in the peripheral iris lets aqueous bypass the pupil, the iris flattens and the angle reopens. The other eye is treated too.",
      findings: {
        eye: {
          iris: {
            affected: true,
            description:
              "Has a small laser hole in its periphery, so aqueous flows straight to the angle and pupil block is relieved.",
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
        {
          name: "Fellow eye gonioscopy",
          result: "Narrow angle",
          flag: "abnormal",
        },
      ],
    },
    {
      id: "glaucomatous",
      label: "Damaged",
      alternative: true,
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
              "Clear: the pressure is only moderately raised and builds slowly, so the eye is quiet while the damage goes on.",
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
  events: [
    {
      stage: "attack",
      label: "Acetazolamide",
      time: "At once",
      description:
        "500 mg by vein, as the patient is often vomiting, with pressure-lowering drops to bring the pressure down before laser.",
    },
    {
      stage: "iridotomy",
      label: "Fellow eye",
      description:
        "The other eye has a laser iridotomy too, because it is likely to close in the same way.",
    },
    {
      stage: "iridotomy",
      label: "Lens surgery",
      description:
        "Removing the lens deepens the angle for good and is often the definitive treatment.",
    },
    {
      stage: "glaucomatous",
      label: "Visual fields",
      description:
        "Repeated over time to see whether the damage is still progressing despite treatment.",
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
export const acuteAngleClosureGlaucomaModel = conditionModel(
  acuteAngleClosureGlaucoma
)

export type AcuteAngleClosureGlaucomaProps = Omit<
  ConditionViewerProps,
  "condition"
>

export function AcuteAngleClosureGlaucoma(
  props: AcuteAngleClosureGlaucomaProps
) {
  return <ConditionViewer condition={acuteAngleClosureGlaucoma} {...props} />
}
