"use client"

import * as React from "react"
import { cn } from "cn"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { IconPlaceholder } from "@/icons/icon-placeholder"

export type AiReasoningStep = {
  title: string
  /** What the step looked at or concluded. */
  detail?: React.ReactNode
}

export type AiReasoningProps = {
  steps: readonly AiReasoningStep[]
  /** The trigger's text. Defaults to "How this was reached". */
  label?: string
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

/**
 * The steps a model reports it took, closed until a reviewer opens it. Show
 * it beside the suggestion it explains.
 */
export function AiReasoning({
  steps,
  label = "How this was reached",
  defaultOpen = false,
  open,
  onOpenChange,
  className,
}: AiReasoningProps) {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      className={cn("flex flex-col gap-2 text-sm", className)}
    >
      <CollapsibleTrigger className="group/reasoning inline-flex w-fit items-center gap-1.5 rounded-md font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-expanded:text-foreground">
        <IconPlaceholder
          lucide="SparklesIcon"
          tabler="IconSparkles"
          hugeicons="SparklesIcon"
          phosphor="SparkleIcon"
          remixicon="RiSparklingLine"
          aria-hidden="true"
          className="size-4"
        />
        {label}
        <span className="font-normal">
          ({steps.length} {steps.length === 1 ? "step" : "steps"})
        </span>
        <IconPlaceholder
          lucide="ChevronDownIcon"
          tabler="IconChevronDown"
          hugeicons="ArrowDown01Icon"
          phosphor="CaretDownIcon"
          remixicon="RiArrowDownSLine"
          aria-hidden="true"
          className="size-4 transition-transform group-aria-expanded/reasoning:rotate-180"
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ol className="ml-2 flex flex-col gap-3 border-l pl-4">
          {steps.map((step, index) => (
            <li key={index} className="flex flex-col gap-0.5">
              <span className="font-medium">{step.title}</span>
              {step.detail && (
                <span className="text-muted-foreground">{step.detail}</span>
              )}
            </li>
          ))}
        </ol>
      </CollapsibleContent>
    </Collapsible>
  )
}
