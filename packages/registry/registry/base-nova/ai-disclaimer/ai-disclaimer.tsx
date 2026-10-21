import * as React from "react"
import { cn } from "cn"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { IconPlaceholder } from "@/icons/icon-placeholder"

export type AiReview = {
  /** The reviewer's name, as your record shows it. */
  by: string
  /** An ISO 8601 date-time. */
  at: string
}

export type AiDisclaimerProps = {
  /** The model or service that produced the content. */
  model?: string
  /** When it was generated, an ISO 8601 date-time. */
  generatedAt?: string
  /** Who reviewed it and when, once someone has. */
  review?: AiReview | null
  /** Replaces the default guidance. */
  children?: React.ReactNode
  /** Defaults to a UTC date and time such as "Oct 21, 2026, 9:30 AM". */
  formatDate?: (date: string) => string
  className?: string
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
})

// A fixed locale and time zone render the same on the server and the client.
function defaultFormatDate(date: string) {
  const time = Date.parse(date)
  return Number.isNaN(time) ? date : `${dateFormat.format(time)} UTC`
}

/**
 * Marks content as AI-generated: what produced it, when, and whether a
 * clinician has reviewed it. Place it above the content it describes.
 */
export function AiDisclaimer({
  model,
  generatedAt,
  review = null,
  children,
  formatDate = defaultFormatDate,
  className,
}: AiDisclaimerProps) {
  const source = [
    model,
    generatedAt && `generated ${formatDate(generatedAt)}`,
  ].filter(Boolean)
  return (
    // A note, not an alert: it describes the content without interrupting.
    <Alert role="note" className={cn(className)}>
      <IconPlaceholder
        lucide="SparklesIcon"
        tabler="IconSparkles"
        hugeicons="SparklesIcon"
        phosphor="SparkleIcon"
        remixicon="RiSparklingLine"
        aria-hidden="true"
      />
      <AlertTitle>
        {review ? "AI-generated, reviewed" : "AI-generated draft"}
      </AlertTitle>
      <AlertDescription>
        <p>
          {children ??
            (review
              ? `Reviewed by ${review.by}, ${formatDate(review.at)}.`
              : "Not yet reviewed by a clinician. Check it against the record before you rely on it; it is not a diagnosis.")}
        </p>
        {source.length > 0 && (
          <p className="text-xs text-muted-foreground">{source.join(" · ")}</p>
        )}
      </AlertDescription>
    </Alert>
  )
}
