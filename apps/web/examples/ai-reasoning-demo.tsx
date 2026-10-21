import { AiReasoning } from "@workspace/registry/ai-reasoning"
import { aiCaseReasoning } from "@/lib/ai-case"

export function Example() {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <p>
        <span className="font-medium">Suggestion:</span> low risk of acute
        myocardial infarction; consider outpatient exercise testing.
      </p>
      <AiReasoning steps={aiCaseReasoning} defaultOpen />
    </div>
  )
}
