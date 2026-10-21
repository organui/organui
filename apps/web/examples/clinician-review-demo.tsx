"use client"
import { useState } from "react"
import {
  ClinicianReview,
  type ReviewDecision,
} from "@workspace/registry/clinician-review"

export function Example() {
  const [decision, setDecision] = useState<ReviewDecision>({
    status: "pending",
  })
  return (
    <ClinicianReview
      value={decision}
      onValueChange={setDecision}
      reviewer="Dr A. Rivera"
      subject="Emergency department note, drafted by AI"
      className="w-full max-w-md"
    />
  )
}
