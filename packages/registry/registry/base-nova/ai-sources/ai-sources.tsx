"use client"

import * as React from "react"
import { cn } from "cn"

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export type AiSource = {
  id: string
  title: string
  /** What it is, such as "Lab result", "Guideline" or "Progress note". */
  kind?: string
  /** An ISO 8601 date, or any text you want shown as the date. */
  date?: string
  /** A quote or summary of the part the content relies on. */
  detail?: string
  /** Where to read it, such as a link into your record. */
  href?: string
}

function meta(source: AiSource) {
  return [source.kind, source.date].filter(Boolean).join(" · ")
}

/**
 * A numbered marker after a claim. It opens the source the claim relies on,
 * so a reviewer can check it without leaving the page.
 */
export function AiCitation({
  source,
  number,
  className,
}: {
  source: AiSource
  /** The source's position in the list, counting from 1. */
  number: number
  className?: string
}) {
  return (
    <Popover>
      <PopoverTrigger
        aria-label={`Source ${number}: ${source.title}`}
        className={cn(
          "mx-0.5 inline-flex h-4 min-w-4 -translate-y-1 items-center justify-center rounded-sm bg-muted px-1 align-baseline font-mono text-[0.65rem] font-medium text-foreground tabular-nums outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-expanded:bg-accent aria-expanded:text-accent-foreground",
          className
        )}
      >
        {number}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <PopoverHeader>
          <PopoverTitle>{source.title}</PopoverTitle>
          {meta(source) && (
            <PopoverDescription>{meta(source)}</PopoverDescription>
          )}
        </PopoverHeader>
        {source.detail && (
          <blockquote className="border-l-2 pl-3 text-sm text-muted-foreground">
            {source.detail}
          </blockquote>
        )}
        {source.href && (
          <a
            href={source.href}
            className="text-sm font-medium underline underline-offset-4"
          >
            Open source
          </a>
        )}
      </PopoverContent>
    </Popover>
  )
}

/** The sources a piece of content cites, in citation order. */
export function AiSources({
  sources,
  title = "Sources",
  className,
}: {
  sources: readonly AiSource[]
  title?: string
  className?: string
}) {
  if (sources.length === 0) return null
  return (
    // Named by its title, without an id, so a page's table of contents
    // leaves it out.
    <section
      aria-label={title}
      className={cn("flex flex-col gap-2 text-sm", className)}
    >
      <h3 className="font-medium">{title}</h3>
      <ol className="flex flex-col gap-2">
        {sources.map((source, index) => (
          <li key={source.id} className="flex gap-2">
            <span className="w-4 shrink-0 text-right font-mono text-xs leading-5 text-muted-foreground tabular-nums">
              {index + 1}
            </span>
            <span className="flex min-w-0 flex-col">
              {source.href ? (
                <a
                  href={source.href}
                  className="font-medium underline-offset-4 hover:underline"
                >
                  {source.title}
                </a>
              ) : (
                <span className="font-medium">{source.title}</span>
              )}
              {meta(source) && (
                <span className="text-xs text-muted-foreground">
                  {meta(source)}
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
