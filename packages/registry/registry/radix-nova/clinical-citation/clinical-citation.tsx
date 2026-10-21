"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

/** A record an AI answer relies on: a result, a note, an image, a guideline. */
export type ClinicalSource = {
  id: string
  title: string
  /** The chip's text, such as "Troponin". Defaults to the title. */
  label?: string
  /** What it is, such as "Lab result", "ECG" or "Nursing note". */
  kind?: string
  /** An ISO 8601 date, or any text you want shown as the date. */
  date?: string
  /** A quote or summary of the part the answer relies on. */
  detail?: string
  /** Where to read it in your record. */
  href?: string
}

export function clinicalSourceMeta(source: ClinicalSource) {
  return [source.kind, source.date].filter(Boolean).join(" · ")
}

/**
 * A record cited in the sentence that relies on it. It opens on hover or
 * focus, as shadcn's Inline Citation does, and shows what the record says.
 */
export function ClinicalCitation({ source }: { source: ClinicalSource }) {
  const meta = clinicalSourceMeta(source)
  return (
    <HoverCard openDelay={10} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button variant="secondary" size="xs" className="mx-0.5">
          {source.label ?? source.title}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-72 flex-col gap-1 text-sm">
        <div className="font-medium">{source.title}</div>
        {meta && <div className="text-xs text-muted-foreground">{meta}</div>}
        {source.detail && (
          <p className="text-muted-foreground">{source.detail}</p>
        )}
        {source.href && (
          <a
            href={source.href}
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Open in the record
          </a>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}
