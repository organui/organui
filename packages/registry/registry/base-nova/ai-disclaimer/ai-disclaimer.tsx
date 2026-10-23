import * as React from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { IconPlaceholder } from "@/icons/icon-placeholder"

export type AiReview = {
  /** The reviewer's name, as your record shows it. */
  by: string
  /** An ISO 8601 date-time. */
  at: string
  /** The decision, as ClinicianReview records it. Defaults to approved. */
  status?: "approved" | "changes-requested" | "rejected"
}

export type AiDisclaimerProps = React.ComponentProps<"div"> & {
  /** The model or service that produced the content. */
  model?: string
  /** When it was generated, an ISO 8601 date-time. */
  generatedAt?: string
  /** Who reviewed it and when, once someone has. */
  review?: AiReview | null
  /** Replaces the default guidance. */
  children?: React.ReactNode
  /** Defaults to a UTC date and time such as "Oct 21, 2026, 9:30 AM UTC". */
  formatDate?: (date: string) => string
}

const reviewText = {
  approved: { title: "AI-generated, reviewed", by: "Reviewed by" },
  "changes-requested": {
    title: "AI-generated, changes requested",
    by: "Changes requested by",
  },
  rejected: { title: "AI-generated, rejected", by: "Rejected by" },
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
  ...props
}: AiDisclaimerProps) {
  const text = review && reviewText[review.status ?? "approved"]
  const source = [
    model,
    generatedAt && `generated ${formatDate(generatedAt)}`,
  ].filter(Boolean)
  return (
    // A note, not an alert: it describes the content without interrupting.
    <Alert
      data-slot="ai-disclaimer"
      role="note"
      className={className}
      {...props}
    >
      <IconPlaceholder
        lucide="SparklesIcon"
        tabler="IconSparkles"
        hugeicons="SparklesIcon"
        phosphor="SparkleIcon"
        remixicon="RiSparklingLine"
        aria-hidden="true"
      />
      <AlertTitle>{text ? text.title : "AI-generated draft"}</AlertTitle>
      <AlertDescription>
        <p>
          {children ??
            (review && text
              ? `${text.by} ${review.by}, ${formatDate(review.at)}.${review.status && review.status !== "approved" ? " Don't rely on it until it is revised and approved." : ""}`
              : "Not yet reviewed by a clinician. Check it against the record before you rely on it; it is not a diagnosis.")}
        </p>
        {source.length > 0 && (
          <p className="text-xs text-muted-foreground">{source.join(" · ")}</p>
        )}
      </AlertDescription>
    </Alert>
  )
}
