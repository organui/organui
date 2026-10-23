import type { OrganModel } from "@workspace/registry/organ-viewer"

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
  "acute-angle-closure-glaucoma": () =>
    import("@workspace/registry/acute-angle-closure-glaucoma").then((module) =>
      local(module.acuteAngleClosureGlaucomaModel)
    ),
  "acute-appendicitis": () =>
    import("@workspace/registry/acute-appendicitis").then((module) =>
      local(module.acuteAppendicitisModel)
    ),
  adrenals: () =>
    import("@workspace/registry/adrenals").then(
      (module) => module.adrenalsModel
    ),
  appendix: () =>
    import("@workspace/registry/appendix").then((module) =>
      local(module.appendixModel)
    ),
  "autoimmune-hepatitis": () =>
    import("@workspace/registry/autoimmune-hepatitis").then((module) =>
      local(module.autoimmuneHepatitisModel)
    ),
  "benign-prostatic-hyperplasia": () =>
    import("@workspace/registry/benign-prostatic-hyperplasia").then((module) =>
      local(module.benignProstaticHyperplasiaModel)
    ),
  bladder: () =>
    import("@workspace/registry/bladder").then((module) => module.bladderModel),
  brain: () =>
    import("@workspace/registry/brain").then((module) => module.brainModel),
  breast: () =>
    import("@workspace/registry/breast").then((module) =>
      local(module.breastModel)
    ),
  cell: () =>
    import("@workspace/registry/cell").then((module) =>
      local(module.cellModel)
    ),
  diaphragm: () =>
    import("@workspace/registry/diaphragm").then((module) =>
      local(module.diaphragmModel)
    ),
  ear: () =>
    import("@workspace/registry/ear").then((module) => module.earModel),
  esophagus: () =>
    import("@workspace/registry/esophagus").then(
      (module) => module.esophagusModel
    ),
  eye: () =>
    import("@workspace/registry/eye").then((module) => module.eyeModel),
  gallbladder: () =>
    import("@workspace/registry/gallbladder").then(
      (module) => module.gallbladderModel
    ),
  "gallstone-disease": () =>
    import("@workspace/registry/gallstone-disease").then((module) =>
      local(module.gallstoneDiseaseModel)
    ),
  "graves-disease": () =>
    import("@workspace/registry/graves-disease").then((module) =>
      local(module.gravesDiseaseModel)
    ),
  hair: () =>
    import("@workspace/registry/hair").then((module) =>
      local(module.hairModel)
    ),
  heart: () =>
    import("@workspace/registry/heart").then((module) => module.heartModel),
  intestines: () =>
    import("@workspace/registry/intestines").then(
      (module) => module.intestinesModel
    ),
  "ischaemic-stroke": () =>
    import("@workspace/registry/ischaemic-stroke").then((module) =>
      local(module.ischaemicStrokeModel)
    ),
  joints: () =>
    import("@workspace/registry/joints").then((module) =>
      local(module.jointsModel)
    ),
  "kidney-stones": () =>
    import("@workspace/registry/kidney-stones").then((module) =>
      local(module.kidneyStonesModel)
    ),
  kidneys: () =>
    import("@workspace/registry/kidneys").then((module) => module.kidneysModel),
  larynx: () =>
    import("@workspace/registry/larynx").then((module) => module.larynxModel),
  liver: () =>
    import("@workspace/registry/liver").then((module) => module.liverModel),
  "liver-lobule": () =>
    import("@workspace/registry/liver-lobule").then((module) =>
      local(module.liverLobuleModel)
    ),
  "lobar-pneumonia": () =>
    import("@workspace/registry/lobar-pneumonia").then((module) =>
      local(module.lobarPneumoniaModel)
    ),
  lungs: () =>
    import("@workspace/registry/lungs").then((module) => module.lungsModel),
  lymph: () =>
    import("@workspace/registry/lymph").then((module) => module.lymphModel),
  muscles: () =>
    import("@workspace/registry/muscles").then((module) => module.musclesModel),
  "myocardial-infarction": () =>
    import("@workspace/registry/myocardial-infarction").then((module) =>
      local(module.myocardialInfarctionModel)
    ),
  nails: () =>
    import("@workspace/registry/nails").then((module) =>
      local(module.nailsModel)
    ),
  nerves: () =>
    import("@workspace/registry/nerves").then((module) =>
      local(module.nervesModel)
    ),
  nose: () =>
    import("@workspace/registry/nose").then((module) => module.noseModel),
  pancreas: () =>
    import("@workspace/registry/pancreas").then(
      (module) => module.pancreasModel
    ),
  parathyroid: () =>
    import("@workspace/registry/parathyroid").then((module) =>
      local(module.parathyroidModel)
    ),
  "peptic-ulcer-disease": () =>
    import("@workspace/registry/peptic-ulcer-disease").then((module) =>
      local(module.pepticUlcerDiseaseModel)
    ),
  pharynx: () =>
    import("@workspace/registry/pharynx").then((module) => module.pharynxModel),
  pineal: () =>
    import("@workspace/registry/pineal").then((module) =>
      local(module.pinealModel)
    ),
  pituitary: () =>
    import("@workspace/registry/pituitary").then((module) =>
      local(module.pituitaryModel)
    ),
  prostate: () =>
    import("@workspace/registry/prostate").then(
      (module) => module.prostateModel
    ),
  "salivary-glands": () =>
    import("@workspace/registry/salivary-glands").then((module) =>
      local(module.salivaryGlandsModel)
    ),
  skeleton: () =>
    import("@workspace/registry/skeleton").then(
      (module) => module.skeletonModel
    ),
  skin: () =>
    import("@workspace/registry/skin").then((module) => module.skinModel),
  "spinal-cord": () =>
    import("@workspace/registry/spinal-cord").then(
      (module) => module.spinalCordModel
    ),
  spleen: () =>
    import("@workspace/registry/spleen").then((module) => module.spleenModel),
  stomach: () =>
    import("@workspace/registry/stomach").then((module) => module.stomachModel),
  teeth: () =>
    import("@workspace/registry/teeth").then((module) => module.teethModel),
  thymus: () =>
    import("@workspace/registry/thymus").then((module) => module.thymusModel),
  thyroid: () =>
    import("@workspace/registry/thyroid").then((module) => module.thyroidModel),
  tongue: () =>
    import("@workspace/registry/tongue").then((module) => module.tongueModel),
  uterus: () =>
    import("@workspace/registry/uterus").then((module) => module.uterusModel),
  vessels: () =>
    import("@workspace/registry/vessels").then((module) => module.vesselsModel),
  vestibular: () =>
    import("@workspace/registry/vestibular").then((module) =>
      local(module.vestibularModel)
    ),
}
