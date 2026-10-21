"use client"
import { useState } from "react"
import { AiDisclaimer } from "@workspace/registry/ai-disclaimer"
import {
  ClinicianReview,
  type ReviewDecision,
} from "@workspace/registry/clinician-review"
import { AiNote } from "@workspace/registry/ai-note"
import { DifferentialList } from "@workspace/registry/differential-list"
import { Bubble, BubbleContent } from "@workspace/ui/components/bubble"
import { Message, MessageContent } from "@workspace/ui/components/message"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceLine,
  TraceTitle,
} from "@workspace/ui/components/trace"
import {
  aiCaseDifferential,
  aiCaseNote,
  aiCaseReasoning,
  aiCaseSources,
} from "@/lib/ai-case"

// A clinician asks an assistant to draft a note. shadcn's Message, Bubble
// and Trace carry the conversation; the OrganUI elements carry the care.
export function Example() {
  const [decision, setDecision] = useState<ReviewDecision>({
    status: "pending",
  })
  return (
    <div className="flex w-full max-w-xl flex-col gap-4 text-sm">
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="muted">
            <BubbleContent>
              Draft the ED note for bay 4 and list the differential.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent className="gap-4">
          <Trace>
            <TraceCollapsible>
              <TraceCollapsibleTrigger>
                <TraceLine>
                  <TraceTitle>Thought for 4s</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <ol className="flex list-decimal flex-col gap-1 pl-4">
                  {aiCaseReasoning.map((step) => (
                    <li key={step.title}>
                      {step.title}: {step.detail}
                    </li>
                  ))}
                </ol>
              </TraceCollapsibleContent>
            </TraceCollapsible>
          </Trace>
          <AiDisclaimer
            model="Example model"
            generatedAt="2026-10-21T09:30:00Z"
            review={
              decision.status === "approved" && decision.reviewer && decision.at
                ? { by: decision.reviewer, at: decision.at }
                : null
            }
          />
          <AiNote sections={aiCaseNote} sources={aiCaseSources} />
          <DifferentialList items={aiCaseDifferential} />
          <ClinicianReview
            value={decision}
            onValueChange={setDecision}
            reviewer="Dr A. Rivera"
            subject="Emergency department note"
          />
        </MessageContent>
      </Message>
    </div>
  )
}
