"use client"
import { useState } from "react"
import { AiDisclaimer } from "@workspace/registry/ai-disclaimer"
import { AiNote } from "@workspace/registry/ai-note"
import { AiReasoning } from "@workspace/registry/ai-reasoning"
import {
  ClinicianReview,
  type ReviewDecision,
} from "@workspace/registry/clinician-review"
import { aiCaseNote, aiCaseReasoning, aiCaseSources } from "@/lib/ai-case"

// Reviewing an AI-drafted note: what made it, what it relies on, how it got
// there, and the clinician's decision.
export function Example() {
  const [decision, setDecision] = useState<ReviewDecision>({
    status: "pending",
  })
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex min-w-0 flex-col gap-4">
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
        <AiReasoning steps={aiCaseReasoning} />
      </div>
      <ClinicianReview
        value={decision}
        onValueChange={setDecision}
        reviewer="Dr A. Rivera"
        subject="Emergency department note"
      />
    </div>
  )
}
