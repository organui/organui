import type { ItemDoc } from "@/components/item-docs"

// The content of each AI element's page: how to use it, its props, and what
// to know before relying on it.
export const aiDocs: Record<string, ItemDoc> = {
  "ai-disclaimer": {
    usageLang: "tsx",
    usage: `import { AiDisclaimer } from "@/components/ui/ai-disclaimer"

<AiDisclaimer
  model="Example model"
  generatedAt="2026-10-21T09:30:00Z"
  review={decision.status === "approved" ? { by, at } : null}
/>`,
    reference: [
      {
        name: "model",
        description: "The model or service that produced the content.",
      },
      {
        name: "generatedAt",
        description: "When it ran, an ISO 8601 date-time.",
      },
      {
        name: "review",
        description:
          "{ by, at } once a clinician has reviewed it; the title and text change to say so.",
      },
      { name: "children", description: "Replaces the default guidance." },
      {
        name: "formatDate",
        description:
          'Defaults to a UTC date and time such as "Oct 21, 2026, 9:30 AM UTC".',
      },
    ],
    notes: [
      "It is a note rather than an alert, so screen readers don't interrupt the reader to announce it.",
      "Keep it beside the content it describes, including in print and exports, wherever that content goes.",
    ],
  },
  "ai-note": {
    usageLang: "tsx",
    usage: `import { AiNote } from "@/components/ui/ai-note"

<AiNote
  sources={[{ id: "ecg", title: "12-lead ECG", kind: "ECG" }]}
  sections={[
    {
      id: "objective",
      title: "Objective",
      content: [
        { text: "Sinus rhythm without ST changes", sources: ["ecg"] },
        ". ",
        { text: "No previous cardiac history" }, // marked: no source
      ],
    },
  ]}
/>`,
    reference: [
      {
        name: "sections",
        description:
          "{ id, title, content }. Content mixes plain strings, which join claims, with claims: { text, sources }.",
      },
      {
        name: "sources",
        description:
          "Every source the note cites, numbered in this order. See AI sources.",
      },
      {
        name: "markUnsupported",
        description:
          "Underlines claims with no source and says so to screen readers. Defaults to true.",
      },
      {
        name: "label",
        description: 'Names the note. Defaults to "AI-drafted note".',
      },
    ],
    notes: [
      "Make every factual statement a claim, with its sources, so the ones the model couldn't support stand out.",
      "Installing it also installs AI sources, which draws the citations and the list.",
    ],
  },
  "ai-sources": {
    usageLang: "tsx",
    usage: `import { AiCitation, AiSources } from "@/components/ui/ai-sources"

<p>
  Troponin below the 99th percentile
  <AiCitation source={troponin} number={1} />.
</p>
<AiSources sources={[troponin]} />`,
    reference: [
      {
        name: "AiSource",
        description:
          "{ id, title, kind?, date?, detail?, href? }. detail quotes the part relied on; href opens it in your record.",
      },
      {
        name: "AiCitation",
        description:
          "source and number. A button that opens the source in a popover, named for screen readers.",
      },
      {
        name: "AiSources",
        description:
          'sources and title, which defaults to "Sources". A numbered list.',
      },
    ],
    notes: [
      "Number sources in the order the content first cites them, and keep the numbers the same in the list.",
      "Link to the source in your record, not a copy, so a reviewer sees it as it is now.",
    ],
  },
  "ai-reasoning": {
    usageLang: "tsx",
    usage: `import { AiReasoning } from "@/components/ui/ai-reasoning"

<AiReasoning
  steps={[
    { title: "Compared serial troponin", detail: "18 and 21 ng/L." },
    { title: "Applied the 0/3-hour pathway" },
  ]}
/>`,
    reference: [
      { name: "steps", description: "{ title, detail? }, in the order taken." },
      {
        name: "label",
        description: `The trigger's text. Defaults to "How this was reached".`,
      },
      {
        name: "defaultOpen",
        description: "Opens it on first render. Defaults to false.",
      },
      {
        name: "open, onOpenChange",
        description: "Controls it from your state.",
      },
    ],
    notes: [
      "Steps are what the model reports, not a proof. Show them so a reviewer can check them against the record.",
    ],
  },
  "differential-list": {
    usageLang: "tsx",
    usage: `import { DifferentialList } from "@/components/ui/differential-list"

<DifferentialList
  items={[
    {
      id: "angina",
      name: "Stable angina",
      code: "I20.8",
      confidence: 0.42,
      supporting: ["Tightness brought on by exertion"],
    },
  ]}
/>`,
    reference: [
      {
        name: "items",
        description:
          "{ id, name, confidence, code?, supporting?, against? }. confidence runs from 0 to 1; the list sorts by it.",
      },
      {
        name: "label",
        description: 'Names the list. Defaults to "Differential diagnosis".',
      },
    ],
    notes: [
      "A model's confidence isn't a calibrated probability of disease, and the list says so below itself.",
      "Each item's evidence opens on its own, so the list stays short until someone asks why.",
    ],
  },
  "clinician-review": {
    usageLang: "tsx",
    usage: `import {
  ClinicianReview,
  type ReviewDecision,
} from "@/components/ui/clinician-review"

const [decision, setDecision] = useState<ReviewDecision>({ status: "pending" })

<ClinicianReview
  value={decision}
  onValueChange={setDecision}
  reviewer={user.name}
  subject="Discharge summary"
/>`,
    reference: [
      {
        name: "value, onValueChange",
        description:
          "The decision: { status, reviewer?, at?, comment? }. status is pending, approved, changes-requested or rejected.",
      },
      {
        name: "reviewer",
        description: "The signed-in clinician, recorded with each decision.",
      },
      { name: "subject", description: "What is being reviewed." },
      {
        name: "now",
        description: "The time to record. Defaults to now, as ISO 8601.",
      },
      { name: "formatDate", description: "How the decision's time is shown." },
    ],
    notes: [
      "Requesting changes or rejecting needs a reason, which is recorded with the decision.",
      "Store each decision in your audit trail; Undo returns to pending, it doesn't erase the record you keep.",
    ],
  },
}
