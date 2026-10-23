"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Textarea } from "@/components/ui/textarea"
import { IconPlaceholder } from "@/icons/icon-placeholder"

export type ReviewStatus =
  "pending" | "approved" | "changes-requested" | "rejected"

export type ReviewDecision = {
  status: ReviewStatus
  /** Who decided, from the `reviewer` prop. */
  reviewer?: string
  /** When, an ISO 8601 date-time. */
  at?: string
  /** Why, required to request changes or reject. */
  comment?: string
}

export type ClinicianReviewProps = React.ComponentProps<"div"> & {
  /** The current decision; store it with the content it reviews. */
  value: ReviewDecision
  /** Called with each new decision, or with pending after an undo. */
  onValueChange: (decision: ReviewDecision) => void
  /** The signed-in clinician, recorded with each decision. */
  reviewer: string
  /** What is being reviewed, such as "Discharge summary". */
  subject?: string
  /** The time recorded with a decision. Defaults to now, as ISO 8601. */
  now?: () => string
  /** Defaults to a UTC date and time such as "Oct 21, 2026, 9:30 AM UTC". */
  formatDate?: (date: string) => string
}

export const reviewStatusLabels: Record<ReviewStatus, string> = {
  pending: "Awaiting review",
  approved: "Approved",
  "changes-requested": "Changes requested",
  rejected: "Rejected",
}

const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
})

function defaultFormatDate(date: string) {
  const time = Date.parse(date)
  return Number.isNaN(time) ? date : `${dateFormat.format(time)} UTC`
}

type Pending = "changes-requested" | "rejected"

// Each status has its own shape, so it reads without colour.
function StatusIcon({ status }: { status: ReviewStatus }) {
  switch (status) {
    case "pending":
      return (
        <IconPlaceholder
          lucide="ClockIcon"
          tabler="IconClock"
          hugeicons="Clock01Icon"
          phosphor="ClockIcon"
          remixicon="RiTimeLine"
          aria-hidden="true"
        />
      )
    case "approved":
      return (
        <IconPlaceholder
          lucide="CheckIcon"
          tabler="IconCheck"
          hugeicons="Tick02Icon"
          phosphor="CheckIcon"
          remixicon="RiCheckLine"
          aria-hidden="true"
        />
      )
    case "changes-requested":
      return (
        <IconPlaceholder
          lucide="CircleAlertIcon"
          tabler="IconExclamationCircle"
          hugeicons="AlertCircleIcon"
          phosphor="WarningCircleIcon"
          remixicon="RiErrorWarningLine"
          aria-hidden="true"
        />
      )
    case "rejected":
      return (
        <IconPlaceholder
          lucide="XIcon"
          tabler="IconX"
          hugeicons="Cancel01Icon"
          phosphor="XIcon"
          remixicon="RiCloseLine"
          aria-hidden="true"
        />
      )
  }
}

/**
 * A clinician's sign-off on AI-generated content, built like shadcn's
 * Confirmation from an Item and Buttons: approve it, or request changes or
 * reject it with a reason. Each decision records who and when, and can be
 * undone. You store the decision; the component holds no state beyond the
 * reason being typed.
 */
export function ClinicianReview({
  value,
  onValueChange,
  reviewer,
  subject = "AI-generated content",
  now = () => new Date().toISOString(),
  formatDate = defaultFormatDate,
  className,
  ...props
}: ClinicianReviewProps) {
  const [asking, setAsking] = React.useState<Pending | null>(null)
  const [comment, setComment] = React.useState("")
  const reasonId = React.useId()
  const reason = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (asking) reason.current?.focus()
  }, [asking])

  function decide(status: ReviewStatus, text?: string) {
    onValueChange({ status, reviewer, at: now(), comment: text })
    setAsking(null)
    setComment("")
  }

  const decided = value.status !== "pending"
  return (
    <Item
      data-slot="clinician-review"
      data-status={value.status}
      variant="outline"
      className={className}
      {...props}
    >
      <ItemMedia variant="icon">
        <StatusIcon status={value.status} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{subject}</ItemTitle>
        <ItemDescription aria-live="polite">
          {decided
            ? `${reviewStatusLabels[value.status]}${value.reviewer ? ` by ${value.reviewer}` : ""}${value.at ? `, ${formatDate(value.at)}` : ""}.`
            : `${reviewStatusLabels.pending}. Review as ${reviewer} before this is used.`}
        </ItemDescription>
        {decided && value.comment && (
          <blockquote className="mt-1 border-l-2 pl-3 text-sm text-muted-foreground">
            {value.comment}
          </blockquote>
        )}
      </ItemContent>
      <ItemActions className="flex-wrap">
        {decided ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onValueChange({ status: "pending" })}
          >
            <IconPlaceholder
              lucide="Undo2Icon"
              tabler="IconArrowBackUp"
              hugeicons="Undo02Icon"
              phosphor="ArrowCounterClockwiseIcon"
              remixicon="RiArrowGoBackLine"
              aria-hidden="true"
              data-icon="inline-start"
            />
            Undo
          </Button>
        ) : (
          !asking && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAsking("rejected")}
              >
                Reject
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAsking("changes-requested")}
              >
                Request changes
              </Button>
              <Button size="sm" onClick={() => decide("approved")}>
                Approve
              </Button>
            </>
          )
        )}
      </ItemActions>
      {asking && (
        <ItemFooter className="flex-col items-stretch gap-3">
          <Field>
            <FieldLabel htmlFor={reasonId}>
              {asking === "rejected"
                ? "Reason for rejecting"
                : "Changes needed"}
            </FieldLabel>
            <Textarea
              ref={reason}
              id={reasonId}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              required
            />
            <FieldDescription>Recorded with your decision.</FieldDescription>
          </Field>
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setAsking(null)
                setComment("")
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant={asking === "rejected" ? "destructive" : "default"}
              disabled={!comment.trim()}
              onClick={() => decide(asking, comment.trim())}
            >
              {asking === "rejected" ? "Reject" : "Request changes"}
            </Button>
          </div>
        </ItemFooter>
      )}
    </Item>
  )
}
