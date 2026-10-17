import type { OrganModel } from "@workspace/registry/organ-viewer/organ-viewer"

// One loader per organ registry item, so pages and previews only download the
// structure data of the organ they show. An organ item missing here has no
// docs page, which the browser suite catches.
export const organModels: Record<string, () => Promise<OrganModel>> = {
  adrenals: () =>
    import("@workspace/registry/organ-viewer/adrenals").then(
      (module) => module.adrenalsModel
    ),
  bladder: () =>
    import("@workspace/registry/organ-viewer/bladder").then(
      (module) => module.bladderModel
    ),
  brain: () =>
    import("@workspace/registry/organ-viewer/brain").then(
      (module) => module.brainModel
    ),
  ear: () =>
    import("@workspace/registry/organ-viewer/ear").then(
      (module) => module.earModel
    ),
  esophagus: () =>
    import("@workspace/registry/organ-viewer/esophagus").then(
      (module) => module.esophagusModel
    ),
  eye: () =>
    import("@workspace/registry/organ-viewer/eye").then(
      (module) => module.eyeModel
    ),
  gallbladder: () =>
    import("@workspace/registry/organ-viewer/gallbladder").then(
      (module) => module.gallbladderModel
    ),
  heart: () =>
    import("@workspace/registry/organ-viewer/heart").then(
      (module) => module.heartModel
    ),
  intestines: () =>
    import("@workspace/registry/organ-viewer/intestines").then(
      (module) => module.intestinesModel
    ),
  // Served by this site rather than an explorer repository, so docs load it
  // same-origin.
  joints: () =>
    import("@workspace/registry/organ-viewer/joints").then((module) => ({
      ...module.jointsModel,
      src: "/models/joints.glb",
    })),
  kidneys: () =>
    import("@workspace/registry/organ-viewer/kidneys").then(
      (module) => module.kidneysModel
    ),
  larynx: () =>
    import("@workspace/registry/organ-viewer/larynx").then(
      (module) => module.larynxModel
    ),
  liver: () =>
    import("@workspace/registry/organ-viewer/liver").then(
      (module) => module.liverModel
    ),
  lungs: () =>
    import("@workspace/registry/organ-viewer/lungs").then(
      (module) => module.lungsModel
    ),
  lymph: () =>
    import("@workspace/registry/organ-viewer/lymph").then(
      (module) => module.lymphModel
    ),
  muscles: () =>
    import("@workspace/registry/organ-viewer/muscles").then(
      (module) => module.musclesModel
    ),
  // Models built in this repository are served by the website itself, so
  // previews and local builds load them from the same origin.
  nerves: () =>
    import("@workspace/registry/organ-viewer/nerves").then((module) => ({
      ...module.nervesModel,
      src: "/models/nerves.glb",
    })),
  nose: () =>
    import("@workspace/registry/organ-viewer/nose").then(
      (module) => module.noseModel
    ),
  pancreas: () =>
    import("@workspace/registry/organ-viewer/pancreas").then(
      (module) => module.pancreasModel
    ),
  // Hosted by this site; the published item points at organui.com.
  parathyroid: () =>
    import("@workspace/registry/organ-viewer/parathyroid").then((module) => ({
      ...module.parathyroidModel,
      src: "/models/parathyroid.glb",
    })),
  pharynx: () =>
    import("@workspace/registry/organ-viewer/pharynx").then(
      (module) => module.pharynxModel
    ),
  prostate: () =>
    import("@workspace/registry/organ-viewer/prostate").then(
      (module) => module.prostateModel
    ),
  skeleton: () =>
    import("@workspace/registry/organ-viewer/skeleton").then(
      (module) => module.skeletonModel
    ),
  skin: () =>
    import("@workspace/registry/organ-viewer/skin").then(
      (module) => module.skinModel
    ),
  "spinal-cord": () =>
    import("@workspace/registry/organ-viewer/spinal-cord").then(
      (module) => module.spinalCordModel
    ),
  spleen: () =>
    import("@workspace/registry/organ-viewer/spleen").then(
      (module) => module.spleenModel
    ),
  stomach: () =>
    import("@workspace/registry/organ-viewer/stomach").then(
      (module) => module.stomachModel
    ),
  teeth: () =>
    import("@workspace/registry/organ-viewer/teeth").then(
      (module) => module.teethModel
    ),
  thymus: () =>
    import("@workspace/registry/organ-viewer/thymus").then(
      (module) => module.thymusModel
    ),
  thyroid: () =>
    import("@workspace/registry/organ-viewer/thyroid").then(
      (module) => module.thyroidModel
    ),
  tongue: () =>
    import("@workspace/registry/organ-viewer/tongue").then(
      (module) => module.tongueModel
    ),
  uterus: () =>
    import("@workspace/registry/organ-viewer/uterus").then(
      (module) => module.uterusModel
    ),
  vessels: () =>
    import("@workspace/registry/organ-viewer/vessels").then(
      (module) => module.vesselsModel
    ),
}
