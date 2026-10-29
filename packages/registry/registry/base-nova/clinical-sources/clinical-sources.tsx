"use client"

import * as React from "react"

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"
import {
  clinicalSourceMeta,
  type ClinicalSource,
} from "@/components/ui/clinical-citation"
import { IconPlaceholder } from "@/icons/icon-placeholder"

/**
 * The records an AI answer used, under one line that opens into the list,
 * as shadcn's Sources does with its links.
 */
export type ClinicalSourcesProps = React.ComponentProps<"div"> & {
  /** The records the answer used. Nothing renders without any. */
  sources: readonly ClinicalSource[]
  /** Shows the list open at first. */
  defaultOpen?: boolean
}

export function ClinicalSources({
  sources,
  defaultOpen = false,
  className,
  ...props
}: ClinicalSourcesProps) {
  if (sources.length === 0) return null
  return (
    <Trace data-slot="clinical-sources" className={className} {...props}>
      <TraceCollapsible defaultOpen={defaultOpen}>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <IconPlaceholder
                lucide="FileTextIcon"
                tabler="IconFileText"
                hugeicons="File01Icon"
                phosphor="FileTextIcon"
                remixicon="RiFileTextLine"
              />
            </TraceIcon>
            <TraceTitle>
              Used {sources.length}{" "}
              {sources.length === 1 ? "record" : "records"}
            </TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {sources.map((source) => {
              const meta = clinicalSourceMeta(source)
              // Titles wrap rather than truncate: a reviewer reads them whole.
              const line = (
                <TraceLine className="items-baseline">
                  <TraceTitle className="whitespace-normal">
                    {source.title}
                  </TraceTitle>
                  {meta && (
                    // Trace dims its description to 70%, too faint for
                    // text a reviewer reads; muted-foreground meets AA.
                    <TraceDescription className="text-muted-foreground">
                      {meta}
                    </TraceDescription>
                  )}
                </TraceLine>
              )
              return source.href ? (
                <a
                  key={source.id}
                  href={source.href}
                  className="underline-offset-4 hover:underline"
                >
                  {line}
                </a>
              ) : (
                <div key={source.id}>{line}</div>
              )
            })}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
