import type { OrganModel } from "@workspace/registry/organ-viewer/organ-viewer"

// One loader per organ registry item, so pages and previews only download the
// structure data of the organ they show. An organ item missing here has no
// docs page, which the browser suite catches.
// Models hosted on organui.com load from this site's own public/models, so
// previews and local runs show the copy in the same commit.
const local = (model: OrganModel): OrganModel => ({
  ...model,
  src: model.src.replace("https://organui.com/models/", "/models/"),
})

export const organModels: Record<string, () => Promise<OrganModel>> = {
  adrenals: () =>
    import("@workspace/registry/organ-viewer/adrenals").then(
      (module) => module.adrenalsModel
    ),
  appendix: () =>
    import("@workspace/registry/organ-viewer/appendix").then((module) =>
      local(module.appendixModel)
    ),
  bladder: () =>
    import("@workspace/registry/organ-viewer/bladder").then(
      (module) => module.bladderModel
    ),
  brain: () =>
    import("@workspace/registry/organ-viewer/brain").then(
      (module) => module.brainModel
    ),
  breast: () =>
    import("@workspace/registry/organ-viewer/breast").then((module) =>
      local(module.breastModel)
    ),
  diaphragm: () =>
    import("@workspace/registry/organ-viewer/diaphragm").then((module) =>
      local(module.diaphragmModel)
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
  hair: () =>
    import("@workspace/registry/organ-viewer/hair").then((module) =>
      local(module.hairModel)
    ),
  heart: () =>
    import("@workspace/registry/organ-viewer/heart").then(
      (module) => module.heartModel
    ),
  intestines: () =>
    import("@workspace/registry/organ-viewer/intestines").then(
      (module) => module.intestinesModel
    ),
  joints: () =>
    import("@workspace/registry/organ-viewer/joints").then((module) =>
      local(module.jointsModel)
    ),
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
  nails: () =>
    import("@workspace/registry/organ-viewer/nails").then((module) =>
      local(module.nailsModel)
    ),
  nerves: () =>
    import("@workspace/registry/organ-viewer/nerves").then((module) =>
      local(module.nervesModel)
    ),
  nose: () =>
    import("@workspace/registry/organ-viewer/nose").then(
      (module) => module.noseModel
    ),
  pancreas: () =>
    import("@workspace/registry/organ-viewer/pancreas").then(
      (module) => module.pancreasModel
    ),
  parathyroid: () =>
    import("@workspace/registry/organ-viewer/parathyroid").then((module) =>
      local(module.parathyroidModel)
    ),
  pharynx: () =>
    import("@workspace/registry/organ-viewer/pharynx").then(
      (module) => module.pharynxModel
    ),
  pineal: () =>
    import("@workspace/registry/organ-viewer/pineal").then((module) =>
      local(module.pinealModel)
    ),
  pituitary: () =>
    import("@workspace/registry/organ-viewer/pituitary").then((module) =>
      local(module.pituitaryModel)
    ),
  prostate: () =>
    import("@workspace/registry/organ-viewer/prostate").then(
      (module) => module.prostateModel
    ),
  "salivary-glands": () =>
    import("@workspace/registry/organ-viewer/salivary-glands").then((module) =>
      local(module.salivaryGlandsModel)
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
  vestibular: () =>
    import("@workspace/registry/organ-viewer/vestibular").then((module) =>
      local(module.vestibularModel)
    ),
}
