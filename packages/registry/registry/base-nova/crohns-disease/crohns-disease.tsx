import { conditionModel, type Condition } from "@/components/condition-model"
import {
  ConditionViewer,
  type ConditionViewerProps,
} from "@/components/condition-viewer"
import { intestinesModel } from "@/components/intestines"

// Crohn's disease of the terminal ileum and right colon, its commonest
// pattern: patchy inflammation through the whole bowel wall, which in time
// either narrows the bowel or tunnels out of it.
export const crohnsDisease: Condition = {
  name: "Crohn's disease",
  code: "K50.8",
  summary:
    "A lifelong inflammatory bowel disease that can affect any part of the gut from mouth to anus, in patches, through the full thickness of the wall. It most often starts in young adults, with diarrhoea, abdominal pain and weight loss.",
  scales: [
    {
      id: "intestines",
      label: "Intestines",
      model: intestinesModel,
      findings: {
        ileum: {
          affected: true,
          description:
            "Its last 15–20 cm, the terminal ileum, are inflamed through the full thickness of the wall, with deep ulcers between swollen mucosa (cobblestoning); biopsies show granulomas in some. Pain sits in the right lower abdomen.",
        },
        "ascending-colon": {
          affected: true,
          description:
            "Patches of ulceration with normal bowel between them (skip lesions), unlike the continuous inflammation of ulcerative colitis.",
        },
        jejunum: {
          affected: false,
          description:
            "Normal here, though Crohn's can involve any part of the small bowel.",
        },
        "transverse-colon": {
          affected: false,
          description: "A normal stretch between the patches.",
        },
        "descending-colon": {
          affected: false,
          description: "Normal in this pattern of disease.",
        },
        rectum: {
          affected: false,
          description:
            "Usually spared in Crohn's, where ulcerative colitis almost always starts.",
        },
        appendix: {
          affected: false,
          description:
            "Next to the inflamed ileum, so a first flare can be mistaken for appendicitis.",
        },
      },
    },
  ],
  stages: [
    {
      id: "flare",
      label: "Flare",
      time: "Onset, often aged 15–30",
      summary:
        "Diarrhoea, right lower abdominal pain, weight loss and tiredness. The inflamed ileum absorbs bile acids poorly, causing diarrhoea; vitamin B12 falls when long stretches are diseased or removed.",
    },
    {
      id: "stricture",
      label: "Stricture",
      time: "Years",
      summary:
        "Repeated inflammation heals with scar, which narrows the bowel. Colicky pain and bloating after meals, and sometimes obstruction.",
      findings: {
        intestines: {
          ileum: {
            affected: true,
            description:
              "The terminal ileum is narrowed by fibrosis to a thin channel (the string sign on imaging), with dilated bowel above it. Scar does not respond to drugs, though any inflammation with it does. A short stricture can be widened with a balloon; otherwise it is removed or widened surgically (strictureplasty).",
          },
          jejunum: {
            affected: false,
            description:
              "Dilated, with the ileum above the stricture, when the narrowing obstructs.",
          },
        },
      },
      investigations: [
        {
          name: "MR enterography",
          result: "Ileal stricture, upstream dilatation",
          flag: "abnormal",
        },
        { name: "CRP", result: "Mildly raised", flag: "high" },
        { name: "Faecal calprotectin", result: "Raised", flag: "high" },
        { name: "Vitamin B12", result: "Low", flag: "low" },
      ],
    },
    {
      id: "fistula",
      label: "Fistula",
      alternative: true,
      time: "Years",
      summary:
        "Inflammation tunnels through the wall instead: a fistula to another loop of bowel, the bladder or the skin, or an abscess. Fistulas around the anus (perianal Crohn's) are also common.",
      findings: {
        intestines: {
          ileum: {
            affected: true,
            description:
              "Deep fissuring ulcers in the terminal ileum have broken through the wall into a neighbouring loop and formed an abscess in the right lower abdomen. The abscess is drained before any biologic is started.",
          },
        },
      },
      investigations: [
        {
          name: "MR enterography",
          result: "Fistula and abscess",
          flag: "abnormal",
        },
        { name: "Albumin", result: "Low", flag: "low" },
        { name: "CRP", result: "High", flag: "high" },
        { name: "White cells", result: "Raised", flag: "high" },
      ],
    },
  ],
  events: [
    {
      stage: "flare",
      label: "Colonoscopy",
      description:
        "With biopsies of the terminal ileum: patchy deep ulcers, and granulomas in some. MR enterography or intestinal ultrasound maps the small bowel the scope cannot reach.",
    },
    {
      stage: "flare",
      label: "Steroids",
      description:
        "Prednisolone, or budesonide for mild ileal disease, brings the flare under control; steroids are not used to keep remission.",
    },
    {
      stage: "flare",
      label: "Maintenance",
      description:
        "Azathioprine, after checking TPMT, for milder disease. For moderate to severe disease or poor prognostic features, a biologic early: infliximab or adalimumab, often with an immunomodulator, or ustekinumab, vedolizumab or risankizumab. Stopping smoking halves the risk of relapse.",
    },
    {
      stage: "stricture",
      label: "Resection",
      description:
        "An ileocaecal resection removes the strictured segment; disease often returns at the join, so a colonoscopy follows at six months.",
    },
    {
      stage: "fistula",
      label: "Drainage",
      description:
        "An abscess is drained, usually through the skin under imaging, and treated with antibiotics; then either anti-TNF therapy or a planned resection.",
    },
  ],
  investigations: [
    { name: "Faecal calprotectin", result: "High", flag: "high" },
    { name: "CRP", result: "Raised", flag: "high" },
    { name: "Haemoglobin", result: "Low", flag: "low" },
    {
      name: "Ileal biopsy",
      result: "Transmural inflammation, granulomas",
      flag: "abnormal",
    },
  ],
}

/** The intestines in a flare, the stage the viewer opens on. */
export const crohnsDiseaseModel = conditionModel(crohnsDisease)

export type CrohnsDiseaseProps = Omit<ConditionViewerProps, "condition">

export function CrohnsDisease(props: CrohnsDiseaseProps) {
  return <ConditionViewer condition={crohnsDisease} {...props} />
}
