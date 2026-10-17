import type { OrganModel } from "@workspace/registry/organ-viewer/organ-viewer"

// One loader per organ registry item, so pages and previews only download the
// structure data of the organ they show. An organ item missing here has no
// docs page, which the browser suite catches.
export const organModels: Record<string, () => Promise<OrganModel>> = {
  "adrenals-viewer": () =>
    import("@workspace/registry/organ-viewer/adrenals-viewer").then(
      (module) => module.adrenalsModel
    ),
  "bladder-viewer": () =>
    import("@workspace/registry/organ-viewer/bladder-viewer").then(
      (module) => module.bladderModel
    ),
  "brain-viewer": () =>
    import("@workspace/registry/organ-viewer/brain-viewer").then(
      (module) => module.brainModel
    ),
  "ear-viewer": () =>
    import("@workspace/registry/organ-viewer/ear-viewer").then(
      (module) => module.earModel
    ),
  "esophagus-viewer": () =>
    import("@workspace/registry/organ-viewer/esophagus-viewer").then(
      (module) => module.esophagusModel
    ),
  "eye-viewer": () =>
    import("@workspace/registry/organ-viewer/eye-viewer").then(
      (module) => module.eyeModel
    ),
  "gallbladder-viewer": () =>
    import("@workspace/registry/organ-viewer/gallbladder-viewer").then(
      (module) => module.gallbladderModel
    ),
  "heart-viewer": () =>
    import("@workspace/registry/organ-viewer/heart-viewer").then(
      (module) => module.heartModel
    ),
  "intestines-viewer": () =>
    import("@workspace/registry/organ-viewer/intestines-viewer").then(
      (module) => module.intestinesModel
    ),
  "kidneys-viewer": () =>
    import("@workspace/registry/organ-viewer/kidneys-viewer").then(
      (module) => module.kidneysModel
    ),
  "larynx-viewer": () =>
    import("@workspace/registry/organ-viewer/larynx-viewer").then(
      (module) => module.larynxModel
    ),
  "liver-viewer": () =>
    import("@workspace/registry/organ-viewer/liver-viewer").then(
      (module) => module.liverModel
    ),
  "lungs-viewer": () =>
    import("@workspace/registry/organ-viewer/lungs-viewer").then(
      (module) => module.lungsModel
    ),
  "lymph-viewer": () =>
    import("@workspace/registry/organ-viewer/lymph-viewer").then(
      (module) => module.lymphModel
    ),
  "muscles-viewer": () =>
    import("@workspace/registry/organ-viewer/muscles-viewer").then(
      (module) => module.musclesModel
    ),
  "nose-viewer": () =>
    import("@workspace/registry/organ-viewer/nose-viewer").then(
      (module) => module.noseModel
    ),
  "pancreas-viewer": () =>
    import("@workspace/registry/organ-viewer/pancreas-viewer").then(
      (module) => module.pancreasModel
    ),
  "pharynx-viewer": () =>
    import("@workspace/registry/organ-viewer/pharynx-viewer").then(
      (module) => module.pharynxModel
    ),
  "prostate-viewer": () =>
    import("@workspace/registry/organ-viewer/prostate-viewer").then(
      (module) => module.prostateModel
    ),
  "skeleton-viewer": () =>
    import("@workspace/registry/organ-viewer/skeleton-viewer").then(
      (module) => module.skeletonModel
    ),
  "skin-viewer": () =>
    import("@workspace/registry/organ-viewer/skin-viewer").then(
      (module) => module.skinModel
    ),
  "spinal-cord-viewer": () =>
    import("@workspace/registry/organ-viewer/spinal-cord-viewer").then(
      (module) => module.spinalCordModel
    ),
  "spleen-viewer": () =>
    import("@workspace/registry/organ-viewer/spleen-viewer").then(
      (module) => module.spleenModel
    ),
  "stomach-viewer": () =>
    import("@workspace/registry/organ-viewer/stomach-viewer").then(
      (module) => module.stomachModel
    ),
  "teeth-viewer": () =>
    import("@workspace/registry/organ-viewer/teeth-viewer").then(
      (module) => module.teethModel
    ),
  "thymus-viewer": () =>
    import("@workspace/registry/organ-viewer/thymus-viewer").then(
      (module) => module.thymusModel
    ),
  "thyroid-viewer": () =>
    import("@workspace/registry/organ-viewer/thyroid-viewer").then(
      (module) => module.thyroidModel
    ),
  "tongue-viewer": () =>
    import("@workspace/registry/organ-viewer/tongue-viewer").then(
      (module) => module.tongueModel
    ),
  "uterus-viewer": () =>
    import("@workspace/registry/organ-viewer/uterus-viewer").then(
      (module) => module.uterusModel
    ),
  "vessels-viewer": () =>
    import("@workspace/registry/organ-viewer/vessels-viewer").then(
      (module) => module.vesselsModel
    ),
}
