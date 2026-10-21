import { ClinicalSources } from "@workspace/registry/clinical-sources"
import { aiCaseSources } from "@/lib/ai-case"

export function Example() {
  return (
    <div className="w-full max-w-md">
      <ClinicalSources sources={aiCaseSources} defaultOpen />
    </div>
  )
}
