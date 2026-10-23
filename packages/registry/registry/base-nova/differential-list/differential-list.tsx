"use client"

import * as React from "react"
import { cn } from "cn"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemFooter,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
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

export type DifferentialListProps = React.ComponentProps<"div"> & {
  /** The suggested diagnoses, in any order; they show most confident first. */
  items: readonly Differential[]
  /** Names the list for assistive technology. */
  label?: string
}

function percent(confidence: number) {
  return Math.round(Math.min(Math.max(confidence, 0), 1) * 100)
}

/**
 * Suggested diagnoses as shadcn Items, most confident first, each with the
 * findings for and against it. The confidence is the model's.
 */
export function DifferentialList({
  items,
  label = "Differential diagnosis",
  className,
  ...props
}: DifferentialListProps) {
  const ranked = [...items].sort((a, b) => b.confidence - a.confidence)
  return (
    <div
      data-slot="differential-list"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      <ItemGroup aria-label={label}>
        {ranked.map((item, index) => (
          <DifferentialItem key={item.id} item={item} rank={index + 1} />
        ))}
      </ItemGroup>
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
    <Item role="listitem" variant="outline" size="sm">
      <ItemMedia className="w-4 justify-end font-mono text-xs text-muted-foreground tabular-nums">
        {rank}
      </ItemMedia>
      <ItemContent className="gap-2">
        <ItemTitle>
          {item.name}
          {item.code && (
            <span className="font-mono text-xs font-normal text-muted-foreground">
              {item.code}
            </span>
          )}
        </ItemTitle>
        <Progress value={value} aria-label={`${item.name}: model confidence`} />
      </ItemContent>
      <ItemActions className="w-10 justify-end font-medium tabular-nums">
        {value}%
      </ItemActions>
      {evidence && (
        <ItemFooter className="pl-6.5">
          <Collapsible className="w-full">
            <CollapsibleTrigger className="group/evidence inline-flex items-center gap-1 rounded-sm text-xs font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50">
              Evidence
              <span className="sr-only"> for {item.name}</span>
              <IconPlaceholder
                lucide="ChevronRightIcon"
                tabler="IconChevronRight"
                hugeicons="ArrowRight01Icon"
                phosphor="CaretRightIcon"
                remixicon="RiArrowRightSLine"
                aria-hidden="true"
                className="size-3.5 transition-transform group-aria-expanded/evidence:rotate-90"
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid gap-3 pt-2 sm:grid-cols-2">
                <Findings
                  title="Supports"
                  icon={
                    <IconPlaceholder
                      lucide="PlusIcon"
                      tabler="IconPlus"
                      hugeicons="PlusSignIcon"
                      phosphor="PlusIcon"
                      remixicon="RiAddLine"
                      aria-hidden="true"
                      className="size-3.5"
                    />
                  }
                  findings={item.supporting}
                />
                <Findings
                  title="Against"
                  icon={
                    <IconPlaceholder
                      lucide="MinusIcon"
                      tabler="IconMinus"
                      hugeicons="MinusSignIcon"
                      phosphor="MinusIcon"
                      remixicon="RiSubtractLine"
                      aria-hidden="true"
                      className="size-3.5"
                    />
                  }
                  findings={item.against}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </ItemFooter>
      )}
    </Item>
  )
}

function Findings({
  title,
  icon,
  findings = [],
}: {
  title: string
  icon: React.ReactNode
  findings?: readonly string[]
}) {
  if (findings.length === 0) return null
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-1 text-xs font-medium">
        {icon}
        {title}
      </span>
      <ul className="flex list-disc flex-col gap-0.5 pl-4 text-muted-foreground">
        {findings.map((finding, index) => (
          <li key={index}>{finding}</li>
        ))}
      </ul>
    </div>
  )
}
