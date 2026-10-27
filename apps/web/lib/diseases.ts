import type { Disease } from "@workspace/registry/disease-model"

// One loader per disease registry item, so a disease page loads only its own
// data. A disease missing here has no page, which the browser suite catches.
export const diseaseData: Record<string, () => Promise<Disease>> = {
  "abdominal-aortic-aneurysm": () =>
    import("@workspace/registry/abdominal-aortic-aneurysm").then(
      (module) => module.abdominalAorticAneurysm
    ),
  "acl-rupture": () =>
    import("@workspace/registry/acl-rupture").then(
      (module) => module.aclRupture
    ),
  "acute-angle-closure-glaucoma": () =>
    import("@workspace/registry/acute-angle-closure-glaucoma").then(
      (module) => module.acuteAngleClosureGlaucoma
    ),
  "acute-appendicitis": () =>
    import("@workspace/registry/acute-appendicitis").then(
      (module) => module.acuteAppendicitis
    ),
  "acute-otitis-media": () =>
    import("@workspace/registry/acute-otitis-media").then(
      (module) => module.acuteOtitisMedia
    ),
  "addisons-disease": () =>
    import("@workspace/registry/addisons-disease").then(
      (module) => module.addisonsDisease
    ),
  "autoimmune-hepatitis": () =>
    import("@workspace/registry/autoimmune-hepatitis").then(
      (module) => module.autoimmuneHepatitis
    ),
  "benign-prostatic-hyperplasia": () =>
    import("@workspace/registry/benign-prostatic-hyperplasia").then(
      (module) => module.benignProstaticHyperplasia
    ),
  "breast-cancer": () =>
    import("@workspace/registry/breast-cancer").then(
      (module) => module.breastCancer
    ),
  "crohns-disease": () =>
    import("@workspace/registry/crohns-disease").then(
      (module) => module.crohnsDisease
    ),
  "ectopic-pregnancy": () =>
    import("@workspace/registry/ectopic-pregnancy").then(
      (module) => module.ectopicPregnancy
    ),
  "gallstone-disease": () =>
    import("@workspace/registry/gallstone-disease").then(
      (module) => module.gallstoneDisease
    ),
  "graves-disease": () =>
    import("@workspace/registry/graves-disease").then(
      (module) => module.gravesDisease
    ),
  "hodgkin-lymphoma": () =>
    import("@workspace/registry/hodgkin-lymphoma").then(
      (module) => module.hodgkinLymphoma
    ),
  "ischaemic-stroke": () =>
    import("@workspace/registry/ischaemic-stroke").then(
      (module) => module.ischaemicStroke
    ),
  "kidney-stones": () =>
    import("@workspace/registry/kidney-stones").then(
      (module) => module.kidneyStones
    ),
  "laryngeal-cancer": () =>
    import("@workspace/registry/laryngeal-cancer").then(
      (module) => module.laryngealCancer
    ),
  "lobar-pneumonia": () =>
    import("@workspace/registry/lobar-pneumonia").then(
      (module) => module.lobarPneumonia
    ),
  "lumbar-disc-herniation": () =>
    import("@workspace/registry/lumbar-disc-herniation").then(
      (module) => module.lumbarDiscHerniation
    ),
  melanoma: () =>
    import("@workspace/registry/melanoma").then((module) => module.melanoma),
  "myasthenia-gravis": () =>
    import("@workspace/registry/myasthenia-gravis").then(
      (module) => module.myastheniaGravis
    ),
  "myocardial-infarction": () =>
    import("@workspace/registry/myocardial-infarction").then(
      (module) => module.myocardialInfarction
    ),
  "oesophageal-cancer": () =>
    import("@workspace/registry/oesophageal-cancer").then(
      (module) => module.oesophagealCancer
    ),
  "pancreatic-cancer": () =>
    import("@workspace/registry/pancreatic-cancer").then(
      (module) => module.pancreaticCancer
    ),
  "peptic-ulcer-disease": () =>
    import("@workspace/registry/peptic-ulcer-disease").then(
      (module) => module.pepticUlcerDisease
    ),
  "pituitary-adenoma": () =>
    import("@workspace/registry/pituitary-adenoma").then(
      (module) => module.pituitaryAdenoma
    ),
  "primary-hyperparathyroidism": () =>
    import("@workspace/registry/primary-hyperparathyroidism").then(
      (module) => module.primaryHyperparathyroidism
    ),
  "rheumatoid-arthritis": () =>
    import("@workspace/registry/rheumatoid-arthritis").then(
      (module) => module.rheumatoidArthritis
    ),
}
