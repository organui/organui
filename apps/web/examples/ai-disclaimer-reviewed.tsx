import { AiDisclaimer } from "@workspace/registry/ai-disclaimer"

// Once a clinician has reviewed the content, the disclaimer says who and when.
export function Example() {
  return (
    <AiDisclaimer
      model="Example model"
      generatedAt="2026-10-21T09:30:00Z"
      review={{ by: "Dr A. Rivera", at: "2026-10-21T10:05:00Z" }}
    />
  )
}
