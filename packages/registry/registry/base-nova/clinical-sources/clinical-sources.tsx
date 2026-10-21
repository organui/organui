"use client"

import * as React from "react"

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
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
export function ClinicalSources({
  sources,
  defaultOpen = false,
}: {
  sources: readonly ClinicalSource[]
  defaultOpen?: boolean
}) {
  if (sources.length === 0) return null
  return (
    <Trace>
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
              const line = (
                <TraceLine>
                  <TraceTitle>
                    {[source.title, clinicalSourceMeta(source)]
                      .filter(Boolean)
                      .join(" · ")}
                  </TraceTitle>
                </TraceLine>
              )
              return source.href ? (
                <a key={source.id} href={source.href}>
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
