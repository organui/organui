import type { Disease } from "@workspace/registry/disease-model"

// One loader per disease registry item, so a disease page loads only its own
// data. A disease missing here has no page, which the browser suite catches.
export const diseaseData: Record<string, () => Promise<Disease>> = {
  "autoimmune-hepatitis": () =>
    import("@workspace/registry/autoimmune-hepatitis").then(
      (module) => module.autoimmuneHepatitis
    ),
  "ectopic-pregnancy": () =>
    import("@workspace/registry/ectopic-pregnancy").then(
      (module) => module.ectopicPregnancy
    ),
}
