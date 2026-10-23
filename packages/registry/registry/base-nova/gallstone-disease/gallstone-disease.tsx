import { diseaseModel, type Disease } from "@/components/disease-model"
import {
  DiseaseViewer,
  type DiseaseViewerProps,
} from "@/components/disease-viewer"
import { gallbladderModel } from "@/components/gallbladder"

// Gallstone disease: where the stone lodges decides the illness, from biliary
// colic in the cystic duct to cholangitis in the common duct and pancreatitis
// at the ampulla.
export const gallstoneDisease: Disease = {
  name: "Gallstone disease",
  code: "K80",
  summary:
    "Stones form in the gallbladder from bile overloaded with cholesterol. Most never cause trouble; the illness depends on where one gets stuck.",
  scales: [
    {
      id: "gallbladder",
      label: "Biliary tree",
      model: gallbladderModel,
      // From below, the gallbladder and its ducts show under the liver.
      defaultView: "Inferior",
      findings: {
        gallbladder: {
          affected: true,
          description:
            "Holds the stones. Risk factors are female sex, age, obesity, rapid weight loss and pregnancy.",
        },
        "cystic-duct": {
          affected: true,
          description:
            "A stone is squeezed into the duct as the gallbladder contracts after a fatty meal. Steady right upper quadrant pain lasts under six hours, until it falls back.",
        },
        liver: {
          affected: false,
          description:
            "Bile still drains from the liver through the common duct, so liver tests and bilirubin stay normal.",
        },
        "common-hepatic-duct": {
          affected: false,
          description:
            "Clear. The duct below the cystic junction (the common bile duct) is the next place a stone can lodge.",
        },
        pancreas: {
          affected: false,
          description:
            "Not involved while the stone stays in the gallbladder or cystic duct.",
        },
      },
    },
  ],
  stages: [
    {
      id: "biliary-colic",
      label: "Colic",
      summary:
        "Biliary colic: pain after fatty meals that settles on its own. Elective laparoscopic cholecystectomy prevents the complications.",
    },
    {
      id: "cholecystitis",
      label: "Cholecystitis",
      summary:
        "The stone stays stuck and the trapped gallbladder becomes inflamed: constant pain, fever and Murphy's sign.",
      findings: {
        gallbladder: {
          gallbladder: {
            affected: true,
            description:
              "Distended with a thick, inflamed wall. The patient stops breathing in when the examiner presses under the right ribs (Murphy's sign).",
          },
          "cystic-duct": {
            affected: true,
            description:
              "Blocked for hours. Without drainage the gallbladder can become gangrenous or perforate.",
          },
        },
      },
      investigations: [
        { name: "White cells", result: "Raised", flag: "high" },
        { name: "CRP", result: "Raised", flag: "high" },
        { name: "Ultrasound", result: "Thick wall, fluid", flag: "abnormal" },
        { name: "Murphy's sign", result: "Positive", flag: "abnormal" },
      ],
    },
    {
      id: "cholangitis",
      label: "Cholangitis",
      summary:
        "A stone passes into the common bile duct and blocks it. Infected bile backs up into the liver: fever, jaundice and pain (Charcot's triad).",
      findings: {
        gallbladder: {
          "cystic-duct": {
            affected: false,
            description: "The stone has passed through it.",
          },
          "common-hepatic-duct": {
            affected: true,
            description:
              "The stone blocks the common duct below this one, and the ducts above dilate. ERCP removes the stone and drains the infection.",
          },
          "intrahepatic-ducts": {
            affected: true,
            description:
              "Dilated and full of infected bile under pressure, which seeds bacteria into the blood. Untreated, cholangitis can kill within hours.",
          },
          liver: {
            affected: true,
            description:
              "Bile cannot leave, so bilirubin and ALP rise and the patient turns yellow.",
          },
        },
      },
      investigations: [
        { name: "Bilirubin", result: "Raised", flag: "high" },
        { name: "ALP", result: "Raised", flag: "high" },
        { name: "Blood cultures", result: "E. coli", flag: "abnormal" },
        { name: "MRCP", result: "Common duct stone", flag: "abnormal" },
      ],
    },
    {
      id: "pancreatitis",
      label: "Pancreatitis",
      summary:
        "A small stone lodges where the bile and pancreatic ducts open into the duodenum. Pancreatic enzymes activate inside the gland and digest it.",
      findings: {
        gallbladder: {
          "cystic-duct": {
            affected: false,
            description: "The stone has passed through it.",
          },
          "pancreatic-duct": {
            affected: true,
            description:
              "Blocked at the ampulla, so pancreatic juice backs up and its enzymes switch on inside the gland.",
          },
          pancreas: {
            affected: true,
            description:
              "Swollen and inflamed: severe epigastric pain through to the back. Most attacks are mild; severe ones cause organ failure.",
          },
          duodenum: {
            affected: true,
            description:
              "The stone sits at the ampulla of Vater in its wall. Most pass on their own; cholecystectomy in the same admission prevents another attack.",
          },
        },
      },
      investigations: [
        { name: "Lipase", result: "> 3× upper limit", flag: "high" },
        { name: "CRP at 48 h", result: "Raised", flag: "high" },
        { name: "ALT", result: "Raised", flag: "high" },
        { name: "Glasgow score", result: "2, mild" },
      ],
    },
  ],
  investigations: [
    { name: "Ultrasound", result: "Gallstones", flag: "abnormal" },
    { name: "Liver tests", result: "Normal" },
    { name: "White cells", result: "Normal" },
    { name: "Lipase", result: "Normal" },
  ],
}

/** The biliary tree in biliary colic, the stage the viewer opens on. */
export const gallstoneDiseaseModel = diseaseModel(gallstoneDisease)

export type GallstoneDiseaseProps = Omit<DiseaseViewerProps, "disease">

export function GallstoneDisease(props: GallstoneDiseaseProps) {
  return <DiseaseViewer disease={gallstoneDisease} {...props} />
}
