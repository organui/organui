// Explicit loaders keep catalog previews opt-in and avoid loading other organs.
import type { ComponentType } from "react"
import type { OrganViewerProps } from "@workspace/registry/organ-viewer"

export const organComponents: Record<
  string,
  () => Promise<ComponentType<Omit<OrganViewerProps, "model">>>
> = {
  adrenals: () =>
    import("@workspace/registry/adrenals").then((module) => module.Adrenals),
  appendix: () =>
    import("@workspace/registry/appendix").then((module) => module.Appendix),
  bladder: () =>
    import("@workspace/registry/bladder").then((module) => module.Bladder),
  brain: () =>
    import("@workspace/registry/brain").then((module) => module.Brain),
  breast: () =>
    import("@workspace/registry/breast").then((module) => module.Breast),
  diaphragm: () =>
    import("@workspace/registry/diaphragm").then((module) => module.Diaphragm),
  ear: () => import("@workspace/registry/ear").then((module) => module.Ear),
  esophagus: () =>
    import("@workspace/registry/esophagus").then((module) => module.Esophagus),
  eye: () => import("@workspace/registry/eye").then((module) => module.Eye),
  gallbladder: () =>
    import("@workspace/registry/gallbladder").then(
      (module) => module.Gallbladder
    ),
  hair: () => import("@workspace/registry/hair").then((module) => module.Hair),
  heart: () =>
    import("@workspace/registry/heart").then((module) => module.Heart),
  intestines: () =>
    import("@workspace/registry/intestines").then(
      (module) => module.Intestines
    ),
  joints: () =>
    import("@workspace/registry/joints").then((module) => module.Joints),
  kidneys: () =>
    import("@workspace/registry/kidneys").then((module) => module.Kidneys),
  larynx: () =>
    import("@workspace/registry/larynx").then((module) => module.Larynx),
  liver: () =>
    import("@workspace/registry/liver").then((module) => module.Liver),
  lungs: () =>
    import("@workspace/registry/lungs").then((module) => module.Lungs),
  lymph: () =>
    import("@workspace/registry/lymph").then((module) => module.Lymph),
  muscles: () =>
    import("@workspace/registry/muscles").then((module) => module.Muscles),
  nails: () =>
    import("@workspace/registry/nails").then((module) => module.Nails),
  nerves: () =>
    import("@workspace/registry/nerves").then((module) => module.Nerves),
  nose: () => import("@workspace/registry/nose").then((module) => module.Nose),
  pancreas: () =>
    import("@workspace/registry/pancreas").then((module) => module.Pancreas),
  parathyroid: () =>
    import("@workspace/registry/parathyroid").then(
      (module) => module.Parathyroid
    ),
  pharynx: () =>
    import("@workspace/registry/pharynx").then((module) => module.Pharynx),
  pineal: () =>
    import("@workspace/registry/pineal").then((module) => module.Pineal),
  pituitary: () =>
    import("@workspace/registry/pituitary").then((module) => module.Pituitary),
  prostate: () =>
    import("@workspace/registry/prostate").then((module) => module.Prostate),
  "salivary-glands": () =>
    import("@workspace/registry/salivary-glands").then(
      (module) => module.SalivaryGlands
    ),
  skeleton: () =>
    import("@workspace/registry/skeleton").then((module) => module.Skeleton),
  skin: () => import("@workspace/registry/skin").then((module) => module.Skin),
  "spinal-cord": () =>
    import("@workspace/registry/spinal-cord").then(
      (module) => module.SpinalCord
    ),
  spleen: () =>
    import("@workspace/registry/spleen").then((module) => module.Spleen),
  stomach: () =>
    import("@workspace/registry/stomach").then((module) => module.Stomach),
  teeth: () =>
    import("@workspace/registry/teeth").then((module) => module.Teeth),
  thymus: () =>
    import("@workspace/registry/thymus").then((module) => module.Thymus),
  thyroid: () =>
    import("@workspace/registry/thyroid").then((module) => module.Thyroid),
  tongue: () =>
    import("@workspace/registry/tongue").then((module) => module.Tongue),
  uterus: () =>
    import("@workspace/registry/uterus").then((module) => module.Uterus),
  vessels: () =>
    import("@workspace/registry/vessels").then((module) => module.Vessels),
  vestibular: () =>
    import("@workspace/registry/vestibular").then(
      (module) => module.Vestibular
    ),
}
