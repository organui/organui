import type { Disease } from "@workspace/registry/disease-model"

// One loader per disease registry item, so a disease page loads only its own
// data. A disease missing here has no page, which the browser suite catches.
export const diseaseData: Record<string, () => Promise<Disease>> = {
  "acute-angle-closure-glaucoma": () =>
    import("@workspace/registry/acute-angle-closure-glaucoma").then(
      (module) => module.acuteAngleClosureGlaucoma
    ),
  "acute-appendicitis": () =>
    import("@workspace/registry/acute-appendicitis").then(
      (module) => module.acuteAppendicitis
    ),
  "autoimmune-hepatitis": () =>
    import("@workspace/registry/autoimmune-hepatitis").then(
      (module) => module.autoimmuneHepatitis
    ),
  "benign-prostatic-hyperplasia": () =>
    import("@workspace/registry/benign-prostatic-hyperplasia").then(
      (module) => module.benignProstaticHyperplasia
    ),
  "gallstone-disease": () =>
    import("@workspace/registry/gallstone-disease").then(
      (module) => module.gallstoneDisease
    ),
  "graves-disease": () =>
    import("@workspace/registry/graves-disease").then(
      (module) => module.gravesDisease
    ),
  "ischaemic-stroke": () =>
    import("@workspace/registry/ischaemic-stroke").then(
      (module) => module.ischaemicStroke
    ),
  "kidney-stones": () =>
    import("@workspace/registry/kidney-stones").then(
      (module) => module.kidneyStones
    ),
  "lobar-pneumonia": () =>
    import("@workspace/registry/lobar-pneumonia").then(
      (module) => module.lobarPneumonia
    ),
  melanoma: () =>
    import("@workspace/registry/melanoma").then((module) => module.melanoma),
  "myocardial-infarction": () =>
    import("@workspace/registry/myocardial-infarction").then(
      (module) => module.myocardialInfarction
    ),
  "peptic-ulcer-disease": () =>
    import("@workspace/registry/peptic-ulcer-disease").then(
      (module) => module.pepticUlcerDisease
    ),
  "pituitary-adenoma": () =>
    import("@workspace/registry/pituitary-adenoma").then(
      (module) => module.pituitaryAdenoma
    ),
}
