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
    notes: [
      "Make every factual statement a claim, with its sources, so the ones the model couldn't support stand out.",
      "Installing it also installs Clinical citation and Clinical sources, which draw the citations and the list.",
    ],
  },
  "clinical-citation": {
    usageLang: "tsx",
    usage: `import { ClinicalCitation } from "@/components/ui/clinical-citation"

<p>
  Troponin below the 99th percentile
  <ClinicalCitation
    source={{
      id: "troponin",
      label: "Troponin",
      title: "Troponin I, high-sensitivity",
      kind: "Lab result",
      date: "Oct 21, 2026",
      detail: "18 ng/L at 0 hours, 21 ng/L at 3 hours.",
      href: "/patients/42/labs/troponin",
    }}
  />
  .
</p>`,
    notes: [
      "Built like shadcn's Inline Citation, from its Hover Card and Button: it opens on hover or keyboard focus.",
      "Link to the record itself, not a copy, so the reviewer sees it as it is now.",
    ],
  },
  "clinical-sources": {
    usageLang: "tsx",
    usage: `import { ClinicalSources } from "@/components/ui/clinical-sources"

<ClinicalSources sources={records} />`,
    notes: [
      'Built like shadcn\'s Sources, on its Trace: one line, "Used 4 records", that opens into the list.',
      "For the model's reasoning, use shadcn's Reasoning or Chain of Thought, also built on Trace; the example on the AI Elements page shows one beside these.",
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
    notes: [
      "Requesting changes or rejecting needs a reason, which is recorded with the decision.",
      "Store each decision in your audit trail; Undo returns to pending, it doesn't erase the record you keep.",
    ],
  },
}
