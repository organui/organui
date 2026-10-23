import type { OrganModel } from "@/components/organ-viewer"

// The data a disease is made of, and the organ model it shows at each scale
// and stage. Plain data and functions, so server code can use them too.

export type DiseaseFinding = {
  /** Whether the disease involves the structure. */
  affected: boolean
  /** Replaces the structure's anatomical label, such as "Portal tracts". */
  label?: string
  /** What the disease does to the structure, or why it is spared. */
  description: string
}

export type DiseaseScale = {
  /** The name of the organ or tissue item the model comes from, such as "liver". */
  id: string
  /** The name the scale switch shows, such as "Liver" or "Lobule". */
  label: string
  model: OrganModel
  /** The named view the model opens on, where the disease shows best. Defaults to the model's own. */
  defaultView?: string
  /** Findings by structure ID. Structures without one are spared and keep their anatomical description. */
  findings: Readonly<Record<string, DiseaseFinding>>
}

export type DiseaseInvestigation = {
  name: string
  result: string
  /** The direction of an abnormal result, shown bold with an arrow. */
  flag?: "high" | "low" | "abnormal"
}

export type DiseaseStage = {
  id: string
  label: string
  /** What happens at this stage, in a sentence or two. */
  summary: string
  /** Findings that replace the scale's own at this stage, by scale ID, then structure ID. */
  findings?: Readonly<Record<string, Readonly<Record<string, DiseaseFinding>>>>
  /** Replaces the disease's investigations at this stage. */
  investigations?: readonly DiseaseInvestigation[]
}

export type Disease = {
  name: string
  /** The ICD-10 code. */
  code: string
  summary: string
  /** One model per scale, the default first. */
  scales: readonly DiseaseScale[]
  /** The course of the disease, the default first. */
  stages?: readonly DiseaseStage[]
  investigations?: readonly DiseaseInvestigation[]
}

// Affected structures share one amber, so a disease that involves a whole
// organ still reads as disease, and spared ones one muted tone. Amber, not
// red: red is kept for critical results.
export const AFFECTED = "#e0892f"
export const SPARED = "#a9a59c"

export function scaleOf(disease: Disease, id?: string) {
  return disease.scales.find((scale) => scale.id === id) ?? disease.scales[0]!
}

export function stageOf(disease: Disease, id?: string) {
  return disease.stages?.find((stage) => stage.id === id) ?? disease.stages?.[0]
}

/**
 * One scale of a disease at one stage, as an organ model: the base model's
 * GLB, views and credit, with its structures grouped as affected or spared,
 * the affected ones first.
 */
export function diseaseModel(
  disease: Disease,
  scaleId?: string,
  stageId?: string
): OrganModel {
  const scale = scaleOf(disease, scaleId)
  const findings = {
    ...scale.findings,
    ...stageOf(disease, stageId)?.findings?.[scale.id],
  }
  return {
    ...scale.model,
    name: disease.name,
    defaultView: scale.defaultView ?? scale.model.defaultView,
    structures: scale.model.structures
      .map((structure) => {
        const finding = findings[structure.id]
        return {
          ...structure,
          label: finding?.label ?? structure.label,
          group: finding?.affected ? "Affected" : "Spared",
          color: finding?.affected ? AFFECTED : SPARED,
          description: finding?.description ?? structure.description,
        }
      })
      .sort(
        (a, b) =>
          Number(b.group === "Affected") - Number(a.group === "Affected")
      ),
  }
}
