import type { AiNoteSection } from "@workspace/registry/ai-note"
import type { ClinicalSource } from "@workspace/registry/clinical-citation"
import type { Differential } from "@workspace/registry/differential-list"

// A fictional emergency department case for the AI Elements examples. Not
// patient data, and not clinical guidance.
export const aiCaseSources: ClinicalSource[] = [
  {
    id: "triage",
    label: "Triage",
    title: "Triage note",
    kind: "Nursing note",
    date: "Oct 21, 2026",
    detail: "Central chest tightness for two hours, worse on climbing stairs.",
  },
  {
    id: "ecg",
    label: "ECG",
    title: "12-lead ECG",
    kind: "ECG",
    date: "Oct 21, 2026",
    detail: "Sinus rhythm, 78 bpm. No ST elevation or depression.",
  },
  {
    id: "troponin",
    label: "Troponin",
    title: "Troponin I, high-sensitivity",
    kind: "Lab result",
    date: "Oct 21, 2026",
    detail: "18 ng/L at 0 hours, 21 ng/L at 3 hours. 99th percentile 26 ng/L.",
  },
  {
    id: "pathway",
    label: "Pathway",
    title: "Chest pain pathway",
    kind: "Local guideline",
    detail:
      "Serial troponin below the 99th percentile with a change under 5 ng/L: low risk of myocardial infarction.",
  },
]

export const aiCaseNote: AiNoteSection[] = [
  {
    id: "subjective",
    title: "Subjective",
    content: [
      "58-year-old with ",
      {
        text: "central chest tightness for two hours, worse on exertion",
        sources: ["triage"],
      },
      ". ",
      { text: "No previous cardiac history" },
      ".",
    ],
  },
  {
    id: "objective",
    title: "Objective",
    content: [
      { text: "Sinus rhythm at 78 bpm without ST changes", sources: ["ecg"] },
      "; ",
      {
        text: "high-sensitivity troponin 18 then 21 ng/L, below the 99th percentile",
        sources: ["troponin"],
      },
      ".",
    ],
  },
  {
    id: "assessment",
    title: "Assessment",
    content: [
      {
        text: "Low risk of acute myocardial infarction on the 0/3-hour pathway",
        sources: ["troponin", "pathway"],
      },
      "; stable angina remains possible.",
    ],
  },
  {
    id: "plan",
    title: "Plan",
    content: [
      "Outpatient exercise testing. ",
      { text: "Return if pain comes on at rest" },
      ".",
    ],
  },
]

// What the model reports it did, shown with shadcn's Trace, as its
// Reasoning and Chain of Thought do.
export const aiCaseReasoning: { title: string; detail: string }[] = [
  {
    title: "Read the triage note",
    detail: "Central chest tightness for two hours, worse on exertion.",
  },
  {
    title: "Compared serial troponin",
    detail: "18 and 21 ng/L: below the 99th percentile, a change under 5 ng/L.",
  },
  { title: "Checked the ECG", detail: "No ST elevation or depression." },
  {
    title: "Applied the 0/3-hour pathway",
    detail: "Low risk of myocardial infarction. It does not rule out angina.",
  },
]

export const aiCaseDifferential: Differential[] = [
  {
    id: "angina",
    name: "Stable angina",
    code: "I20.8",
    confidence: 0.42,
    supporting: ["Tightness brought on by exertion"],
    against: ["No symptoms at rest recorded"],
  },
  {
    id: "reflux",
    name: "Gastro-oesophageal reflux",
    code: "K21.9",
    confidence: 0.27,
    supporting: ["Central location"],
    against: ["Worse on exertion rather than after meals"],
  },
  {
    id: "costochondritis",
    name: "Costochondritis",
    code: "M94.0",
    confidence: 0.14,
    against: ["No chest wall tenderness recorded"],
  },
  {
    id: "acs",
    name: "Acute coronary syndrome",
    code: "I24.9",
    confidence: 0.09,
    supporting: ["Exertional chest tightness"],
    against: ["Troponin stable and below the 99th percentile", "No ST changes"],
  },
]
