import { autoimmuneHepatitis } from "@workspace/registry/autoimmune-hepatitis"
import { cellModel } from "@workspace/registry/cell"
import { conditionModel } from "@workspace/registry/condition-model"
import { OrganTour, type Tour } from "@workspace/registry/organ-tour"

// Explaining a new diagnosis: from the organ down to one cell and back, with a
// question at the end of each chapter so the patient says it back. The models
// come from the condition, so its amber shows what it affects.
const understandingAutoimmuneHepatitis: Tour = {
  name: "Understanding autoimmune hepatitis",
  chapters: [
    {
      id: "liver",
      label: "Your liver",
      model: conditionModel(autoimmuneHepatitis, "liver"),
      span: 220,
      captions: [
        {
          text: "Your liver sits under your right ribs. It stores energy, clears your blood and makes many of the proteins you need.",
          view: "Anterior",
        },
        {
          text: "In autoimmune hepatitis your immune system attacks your own liver by mistake. The inflammation runs through the whole organ.",
          structureId: "liver",
        },
      ],
      question: {
        question: "What is happening to your liver?",
        options: [
          "My immune system is attacking it by mistake",
          "I caught an infection that I could pass on",
          "It was caused by something I drank",
        ],
        answer: 0,
        explanation:
          "Your immune system is attacking your liver cells by mistake. It is not an infection you can pass on, and you did not cause it.",
      },
    },
    {
      id: "lobule",
      label: "Inside the liver",
      model: conditionModel(autoimmuneHepatitis, "liver-lobule"),
      span: 1.5,
      captions: [
        {
          text: "Up close, your liver is built from tiny units like this one, called lobules.",
          view: "Cross-section",
        },
        {
          text: "Blood comes in at the corners, through the portal tracts. In this condition, immune cells gather there.",
          structureId: "portal-tract-stroma",
        },
        {
          text: "They then break through this border and damage the liver cells beside it. This is what a biopsy looks for.",
          structureId: "limiting-plate",
        },
      ],
      question: {
        question: "What can this inflammation do if it carries on?",
        options: [
          "Leave scars in the liver",
          "Nothing, it always settles by itself",
          "Spread to other people in my family",
        ],
        answer: 0,
        explanation:
          "Inflammation that carries on leaves scar tissue, called fibrosis. Treatment calms it, and early scarring can improve.",
      },
    },
    {
      id: "cell",
      label: "A liver cell",
      model: cellModel,
      span: 0.03,
      captions: [
        {
          text: "Closer still, this is one cell. Liver cells, called hepatocytes, have the same parts as this typical cell.",
        },
        {
          text: "They hold an enzyme called ALT. When the outer wall of the cell is damaged, ALT leaks into your blood.",
          structureId: "plasma-membrane",
          view: "Surface",
        },
      ],
      question: {
        question: "Why do we keep checking your ALT?",
        options: [
          "It shows whether liver cells are still being damaged",
          "It shows how well my kidneys are working",
          "It shows whether I have eaten recently",
        ],
        answer: 0,
        explanation:
          "A high ALT means liver cells are still being damaged. When ALT and IgG come back to normal, treatment is working.",
      },
    },
    {
      id: "treatment",
      label: "Why treatment matters",
      model: conditionModel(autoimmuneHepatitis, "liver", "cirrhosis"),
      span: 220,
      captions: [
        {
          text: "Steroids calm your immune system. Another medicine, azathioprine, is often added so the steroid dose can come down.",
          view: "Anterior",
        },
        {
          text: "Without treatment, scarring can become cirrhosis. Blood then struggles to get through the liver, and pressure builds in this vein.",
          structureId: "portal",
        },
      ],
      question: {
        question:
          "You feel well after a few months. What should you do with your medicine?",
        options: [
          "Keep taking it, and talk to my team before changing anything",
          "Stop it, because feeling well means I am cured",
          "Only take it on days I feel unwell",
        ],
        answer: 0,
        explanation:
          "Feeling well does not mean the inflammation has gone. Stopping can bring on a flare, and steroids have to be reduced slowly, so your team will guide any change.",
      },
    },
  ],
}

export function Example() {
  return <OrganTour tour={understandingAutoimmuneHepatitis} />
}
