"use client"

import * as React from "react"
import { cn } from "cn"

import {
  ClinicalCitation,
  type ClinicalSource,
} from "@/components/ui/clinical-citation"
import { ClinicalSources } from "@/components/ui/clinical-sources"

/**
 * Text joining claims, or a claim with the ids of the sources it relies on.
 * A claim with no sources is marked as unsupported.
 */
export type AiNoteSegment =
  string | { text: string; sources?: readonly string[] }

export type AiNoteSection = {
  id: string
  /** The section's name, such as "Assessment". */
  title: string
  /** The section's text, claim by claim. */
  content: readonly AiNoteSegment[]
}

export type AiNoteProps = React.ComponentProps<"article"> & {
  /** The note's sections, in order. */
  sections: readonly AiNoteSection[]
  /** The records the note may cite; the list under it shows those it does. */
  sources?: readonly ClinicalSource[]
  /** Marks claims without a source. Defaults to true. */
  markUnsupported?: boolean
  /** Names the note for assistive technology. */
  label?: string
}

// A dotted underline marks a claim without a source, here and in the key.
const unsupportedMark =
  "underline decoration-muted-foreground decoration-dotted decoration-2 underline-offset-4"

/**
 * An AI-drafted clinical note: each claim cites the records it relies on,
 * and claims without one are marked, so a reviewer can see what to
 * check. Pair it with AiDisclaimer and ClinicianReview.
 */
export function AiNote({
  sections,
  sources = [],
  markUnsupported = true,
  label = "AI-drafted note",
  className,
  ...props
}: AiNoteProps) {
  const unsupported = sections.some((section) =>
    section.content.some(
      (segment) => typeof segment !== "string" && !segment.sources?.length
    )
  )
  // The records the note cites, in the order it first cites them.
  const citedIds = new Set(
    sections.flatMap((section) =>
      section.content.flatMap((segment) =>
        typeof segment === "string" ? [] : (segment.sources ?? [])
      )
    )
  )
  const cited = [...citedIds].flatMap(
    (id) => sources.find((source) => source.id === id) ?? []
  )
  return (
    <article
      data-slot="ai-note"
      aria-label={label}
      className={cn("flex flex-col gap-4 text-sm", className)}
      {...props}
    >
      {sections.map((section) => (
        // Named sections rather than headings, so the note fits under any
        // heading level on the page that shows it.
        <section
          key={section.id}
          aria-label={section.title}
          className="flex flex-col gap-1"
        >
          <p className="font-medium">{section.title}</p>
          <p className="leading-relaxed">
            {section.content.map((segment, index) => {
              if (typeof segment === "string")
                return <React.Fragment key={index}>{segment}</React.Fragment>
              const cited = (segment.sources ?? []).flatMap((id) => {
                const source = sources.find((entry) => entry.id === id)
                return source ? [source] : []
              })
              if (cited.length === 0 && markUnsupported)
                return (
                  <span key={index} className={unsupportedMark}>
                    {segment.text}
                    <span className="sr-only"> (no source)</span>
                  </span>
                )
              return (
                <React.Fragment key={index}>
                  {segment.text}
                  {cited.map((source) => (
                    <ClinicalCitation key={source.id} source={source} />
                  ))}
                </React.Fragment>
              )
            })}
          </p>
        </section>
      ))}
      {markUnsupported && unsupported && (
        <p className="text-xs text-muted-foreground">
          <span className={unsupportedMark}>Dotted text</span> has no source.
          Check it against the record.
        </p>
      )}
      <ClinicalSources sources={cited} />
    </article>
  )
}
