import type { Disease } from "@workspace/registry/disease-model"

// One loader per disease registry item, so a disease page loads only its own
// data. A disease missing here has no page, which the browser suite catches.
export const diseaseData: Record<string, () => Promise<Disease>> = {
  "acute-appendicitis": () =>
    import("@workspace/registry/acute-appendicitis").then(
      (module) => module.acuteAppendicitis
    ),
  "autoimmune-hepatitis": () =>
    import("@workspace/registry/autoimmune-hepatitis").then(
      (module) => module.autoimmuneHepatitis
    ),
  "ischaemic-stroke": () =>
    import("@workspace/registry/ischaemic-stroke").then(
      (module) => module.ischaemicStroke
    ),
  "lobar-pneumonia": () =>
    import("@workspace/registry/lobar-pneumonia").then(
      (module) => module.lobarPneumonia
    ),
  "myocardial-infarction": () =>
    import("@workspace/registry/myocardial-infarction").then(
      (module) => module.myocardialInfarction
    ),
}
