import { AiNote } from "@workspace/registry/ai-note"
import { aiCaseNote, aiCaseSources } from "@/lib/ai-case"

export function Example() {
  return <AiNote sections={aiCaseNote} sources={aiCaseSources} />
}
