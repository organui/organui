import type { Disease } from "@workspace/registry/disease-model"

// One loader per disease registry item, so a disease page loads only its own
// data. A disease missing here has no page, which the browser suite catches.
export const diseaseData: Record<string, () => Promise<Disease>> = {
  "acl-rupture": () =>
    import("@workspace/registry/acl-rupture").then(
      (module) => module.aclRupture
    ),
  "autoimmune-hepatitis": () =>
    import("@workspace/registry/autoimmune-hepatitis").then(
      (module) => module.autoimmuneHepatitis
    ),
}
