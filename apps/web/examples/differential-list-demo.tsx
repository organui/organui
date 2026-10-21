import { DifferentialList } from "@workspace/registry/differential-list"
import { aiCaseDifferential } from "@/lib/ai-case"

export function Example() {
  return <DifferentialList items={aiCaseDifferential} />
}
