import type { OrganModel } from "@/components/organ-viewer"

// The data a condition is made of, and the organ model it shows at each scale
// and stage. Plain data and functions, so server code can use them too.

export type ConditionFinding = {
  /** Whether the condition involves the structure. */
  affected: boolean
  /** Replaces the structure's anatomical label, such as "Portal tracts". */
  label?: string
  /** What the condition does to the structure, or why it is spared. */
  description: string
}

export type ConditionScale = {
  /** The name of the organ or tissue item the model comes from, such as "liver". */
  id: string
  /** The name the scale switch shows, such as "Liver" or "Lobule". */
  label: string
  model: OrganModel
  /** The named view the model opens on, where the condition shows best. Defaults to the model's own. */
  defaultView?: string
  /** Structures drawn see-through so the condition inside them shows, such as the fat over a breast's lobes. Defaults to the model's own. */
  translucentIds?: readonly string[]
  /** Findings by structure ID. Structures without one are spared and keep their anatomical description. */
  findings: Readonly<Record<string, ConditionFinding>>
}

export type ConditionInvestigation = {
  name: string
  result: string
  /** The direction of an abnormal result, shown bold with an arrow. */
  flag?: "high" | "low" | "abnormal"
}

export type ConditionStage = {
  id: string
  label: string
  /** When the stage comes in a typical course, such as "Days 3–7". */
  time?: string
  /** Marks a stage that is an alternative to the one before it, not what follows it, such as an untreated course beside a treated one. */
  alternative?: boolean
  /** What happens at this stage, in a sentence or two. */
  summary: string
  /** Findings that replace the scale's own at this stage, by scale ID, then structure ID. */
  findings?: Readonly<
    Record<string, Readonly<Record<string, ConditionFinding>>>
  >
  /** Replaces the condition's investigations at this stage. */
  investigations?: readonly ConditionInvestigation[]
}

export type ConditionEvent = {
  /** The stage it happens in, by ID. */
  stage: string
  /** A short name for the timeline, such as "PCI". */
  label: string
  /** When it happens, such as "Within 120 min". */
  time?: string
  /** What it is and why it matters then. */
  description: string
}

export type Condition = {
  name: string
  /** The ICD-10 code. */
  code: string
  summary: string
  /** One model per scale, the default first. */
  scales: readonly ConditionScale[]
  /** The course of the condition, the default first. */
  stages?: readonly ConditionStage[]
  /** Treatments, tests and turning points along the course, in order. */
  events?: readonly ConditionEvent[]
  investigations?: readonly ConditionInvestigation[]
}

// Affected structures share one amber, so a condition that involves a whole
// organ still reads as affected, and spared ones one muted tone. Amber, not
// red: red is kept for critical results.
export const AFFECTED = "#e0892f"
export const SPARED = "#a9a59c"

export function scaleOf(condition: Condition, id?: string) {
  return (
    condition.scales.find((scale) => scale.id === id) ?? condition.scales[0]!
  )
}

export function stageOf(condition: Condition, id?: string) {
  return (
    condition.stages?.find((stage) => stage.id === id) ?? condition.stages?.[0]
  )
}

/**
 * One scale of a condition at one stage, as an organ model: the base model's
 * GLB, views and credit, with its structures grouped as affected or spared,
 * the affected ones first.
 */
export function conditionModel(
  condition: Condition,
  scaleId?: string,
  stageId?: string
): OrganModel {
  const scale = scaleOf(condition, scaleId)
  const findings = {
    ...scale.findings,
    ...stageOf(condition, stageId)?.findings?.[scale.id],
  }
  return {
    ...scale.model,
    name: condition.name,
    defaultView: scale.defaultView ?? scale.model.defaultView,
    translucentIds: scale.translucentIds ?? scale.model.translucentIds,
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
