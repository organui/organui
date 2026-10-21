import { ClinicalCitation } from "@workspace/registry/clinical-citation"
import { aiCaseSources } from "@/lib/ai-case"

export function Example() {
  const [, ecg, troponin] = aiCaseSources
  return (
    <p className="max-w-md text-sm leading-relaxed">
      Sinus rhythm without ST changes
      <ClinicalCitation source={ecg!} />, and high-sensitivity troponin below
      the 99th percentile on both samples
      <ClinicalCitation source={troponin!} />.
    </p>
  )
}
