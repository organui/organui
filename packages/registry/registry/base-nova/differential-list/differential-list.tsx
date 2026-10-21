"use client"

import * as React from "react"
import { cn } from "cn"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import { IconPlaceholder } from "@/icons/icon-placeholder"

export type Differential = {
  id: string
  name: string
  /** The model's confidence, from 0 to 1. Not a calibrated probability. */
  confidence: number
  /** A code such as ICD-10, shown beside the name. */
  code?: string
  /** Findings that support it. */
  supporting?: readonly string[]
  /** Findings that argue against it. */
  against?: readonly string[]
}

export type DifferentialListProps = {
  items: readonly Differential[]
  /** Names the list for assistive technology. */
  label?: string
  className?: string
}

function percent(confidence: number) {
  return Math.round(Math.min(Math.max(confidence, 0), 1) * 100)
}

/**
 * Suggested diagnoses, most confident first, each with the findings for and
 * against it. The confidence is the model's, shown as a bar and a number.
 */
export function DifferentialList({
  items,
  label = "Differential diagnosis",
  className,
}: DifferentialListProps) {
  const ranked = [...items].sort((a, b) => b.confidence - a.confidence)
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <ol
        aria-label={label}
        className="flex flex-col divide-y rounded-lg border"
      >
        {ranked.map((item, index) => (
          <DifferentialItem key={item.id} item={item} rank={index + 1} />
        ))}
      </ol>
      <p className="text-xs text-muted-foreground">
        Model confidence, not a probability of disease. A clinician decides the
        diagnosis.
      </p>
    </div>
  )
}

function DifferentialItem({
  item,
  rank,
}: {
  item: Differential
  rank: number
}) {
  const value = percent(item.confidence)
  const evidence = Boolean(item.supporting?.length || item.against?.length)
  return (
    <li className="flex flex-col gap-2 p-3 text-sm">
      <div className="flex items-baseline gap-2">
        <span className="w-4 shrink-0 text-right font-mono text-xs text-muted-foreground tabular-nums">
          {rank}
        </span>
        <span className="min-w-0 flex-1 font-medium">{item.name}</span>
        {item.code && (
          <span className="font-mono text-xs text-muted-foreground">
            {item.code}
          </span>
        )}
        <span className="w-10 text-right font-medium tabular-nums">
          {value}%
        </span>
      </div>
      <Progress
        value={value}
        aria-label={`${item.name}: model confidence`}
        className="ml-6"
      />
      {evidence && (
        <Collapsible className="ml-6">
          <CollapsibleTrigger className="group/evidence inline-flex items-center gap-1 rounded-sm text-xs font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50">
            Evidence
            <span className="sr-only"> for {item.name}</span>
            <IconPlaceholder
              lucide="ChevronDownIcon"
              tabler="IconChevronDown"
              hugeicons="ArrowDown01Icon"
              phosphor="CaretDownIcon"
              remixicon="RiArrowDownSLine"
              aria-hidden="true"
              className="size-3.5 transition-transform group-aria-expanded/evidence:rotate-180"
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <Findings title="Supports" findings={item.supporting} />
              <Findings title="Against" findings={item.against} />
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </li>
  )
}

function Findings({
  title,
  findings = [],
}: {
  title: string
  findings?: readonly string[]
}) {
  if (findings.length === 0) return null
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium">{title}</span>
      <ul className="flex list-disc flex-col gap-0.5 pl-4 text-muted-foreground">
        {findings.map((finding) => (
          <li key={finding}>{finding}</li>
        ))}
      </ul>
    </div>
  )
}
