import { AiCitation, AiSources } from "@workspace/registry/ai-sources"
import { aiCaseSources } from "@/lib/ai-case"

export function Example() {
  const [, ecg, troponin] = aiCaseSources
  return (
    <div className="flex flex-col gap-6 text-sm">
      <p className="leading-relaxed">
        Sinus rhythm without ST changes
        <AiCitation source={ecg!} number={1} />, and high-sensitivity troponin
        below the 99th percentile on both samples
        <AiCitation source={troponin!} number={2} />.
      </p>
      <AiSources sources={[ecg!, troponin!]} />
    </div>
  )
}
