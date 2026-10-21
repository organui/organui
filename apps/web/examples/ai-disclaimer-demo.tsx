import { AiDisclaimer } from "@workspace/registry/ai-disclaimer"

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <AiDisclaimer model="Example model" generatedAt="2026-10-21T09:30:00Z" />
      <AiDisclaimer
        model="Example model"
        generatedAt="2026-10-21T09:30:00Z"
        review={{ by: "Dr A. Rivera", at: "2026-10-21T10:05:00Z" }}
      />
    </div>
  )
}
