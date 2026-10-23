import { diseaseModel, type Disease } from "@/components/disease-model"
import {
  DiseaseViewer,
  type DiseaseViewerProps,
} from "@/components/disease-viewer"
import { brainModel } from "@/components/brain"

// An ischaemic stroke of the left middle cerebral artery territory: an
// embolus, here from atrial fibrillation, blocks the artery, and the lateral
// frontal, parietal and temporal lobes it supplies lose their blood.
export const ischaemicStroke: Disease = {
  name: "Ischaemic stroke",
  code: "I63.4",
  summary:
    "A clot blocks the left middle cerebral artery. A core of brain dies within minutes; the penumbra around it can be saved if the artery is reopened in time.",
  scales: [
    {
      id: "brain",
      label: "Brain",
      model: brainModel,
      defaultView: "Left lateral",
      findings: {
        "left-frontal": {
          affected: true,
          description:
            "The lateral motor cortex: the right face and arm are weakest. An M1 occlusion also cuts off the deep branches to the internal capsule, so the leg is weak too. Broca's area is here, so speech becomes effortful and broken (expressive aphasia).",
        },
        "left-parietal": {
          affected: true,
          description:
            "The sensory cortex: touch and position sense are lost on the right side. Damage to the optic radiations below it adds a right-sided field loss.",
        },
        "left-temporal": {
          affected: true,
          description:
            "Wernicke's area: speech stays fluent but makes little sense and understanding fails (receptive aphasia). With the parietal loss, a right homonymous hemianopia.",
        },
        "left-occipital": {
          affected: false,
          description:
            "Supplied by the posterior cerebral artery and spared, so the visual cortex itself works.",
        },
        "right-frontal": {
          affected: false,
          description:
            "The other hemisphere is spared. A right MCA stroke would weaken the left side and cause neglect of the left of space instead of aphasia.",
        },
        cerebellum: {
          affected: false,
          description:
            "The posterior circulation is spared, so coordination is intact; on the weak side, weakness limits testing it.",
        },
        pons: {
          affected: false,
          description:
            "The brainstem is spared, so the patient is awake and breathing normally.",
        },
        "left-lateral-ventricle": {
          affected: false,
          description:
            "Normal in the first hours; swelling compresses it later.",
        },
      },
    },
  ],
  stages: [
    {
      id: "hyperacute",
      label: "Hyperacute",
      summary:
        "Up to 24 hours. Time is brain: thrombolysis within 4.5 hours and thrombectomy up to 24 hours reopen the artery and save the penumbra.",
    },
    {
      id: "acute",
      label: "Acute",
      summary:
        "Days 2–7. The infarct is complete. Swelling peaks around days 3–5, and the risks are aspiration, a second stroke and, in large infarcts, brain shift.",
      findings: {
        brain: {
          "left-frontal": {
            affected: true,
            description:
              "Infarcted and swollen. Swallowing is often impaired, so nothing by mouth until a swallow screen is passed.",
          },
          "left-lateral-ventricle": {
            affected: true,
            description:
              "Squeezed by the swelling around it. A large MCA infarct can push the midline across (malignant oedema), which needs decompressive surgery.",
          },
        },
      },
      investigations: [
        { name: "CT head", result: "Left MCA hypodensity", flag: "abnormal" },
        { name: "NIHSS", result: "12", flag: "high" },
        { name: "Swallow screen", result: "Failed", flag: "abnormal" },
        { name: "Carotid Doppler", result: "No stenosis" },
      ],
    },
    {
      id: "chronic",
      label: "Chronic",
      summary:
        "Months later. The dead tissue has gone and rehabilitation retrains what survives; anticoagulation prevents the next embolus.",
      findings: {
        brain: {
          "left-frontal": {
            affected: true,
            description:
              "Replaced by a fluid-filled cavity (encephalomalacia). Neighbouring cortex takes over some movement and speech with therapy.",
          },
          "left-parietal": {
            affected: true,
            description:
              "Gliosis and tissue loss; sensation often recovers less than movement.",
          },
          "left-lateral-ventricle": {
            affected: true,
            description:
              "Enlarged towards the lost tissue (ex vacuo dilatation), the opposite of the acute swelling.",
          },
        },
      },
      investigations: [
        {
          name: "Modified Rankin Scale",
          result: "2, slight disability",
          flag: "high",
        },
        { name: "MRI", result: "Encephalomalacia", flag: "abnormal" },
        { name: "ECG", result: "Atrial fibrillation", flag: "abnormal" },
        { name: "Anticoagulation", result: "Started" },
      ],
    },
  ],
  investigations: [
    { name: "NIHSS", result: "16", flag: "high" },
    { name: "CT head", result: "No bleed" },
    { name: "CT angiogram", result: "Left M1 occlusion", flag: "abnormal" },
    { name: "Glucose", result: "Normal" },
    { name: "ECG", result: "Atrial fibrillation", flag: "abnormal" },
  ],
}

/** The brain in the first hours, the stage the viewer opens on. */
export const ischaemicStrokeModel = diseaseModel(ischaemicStroke)

export type IschaemicStrokeProps = Omit<DiseaseViewerProps, "disease">

export function IschaemicStroke(props: IschaemicStrokeProps) {
  return <DiseaseViewer disease={ischaemicStroke} {...props} />
}
