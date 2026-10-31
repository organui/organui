import {
  OrganViewer,
  type OrganModel,
  type OrganViewerProps,
} from "@/components/organ-viewer"

// Generated from organui/kidneys-3d at 880b7c9. The GLB stays in that
// repository under its own licence; see attribution.source.
export const kidneysModel: OrganModel = {
  name: "Kidneys",
  src: "https://cdn.jsdelivr.net/gh/organui/kidneys-3d@880b7c9cdf9f2272eee7741b01ccb34454adb30c/public/models/kidneys.glb",
  bytes: 380208,
  defaultView: "Anterior",
  views: [
    {
      name: "Anterior",
      direction: [0, 0, 1],
    },
    {
      name: "Posterior",
      direction: [0, 0, -1],
    },
    {
      name: "Left lateral",
      direction: [1, 0, 0],
    },
    {
      name: "Right lateral",
      direction: [-1, 0, 0],
    },
  ],
  structures: [
    {
      id: "right-kidney",
      label: "Right kidney",
      group: "Kidneys",
      color: "#9f4e45",
      description:
        "One of the two bean-shaped organs that filter blood and make urine. It sits a little lower than the left kidney because the liver lies above it.",
    },
    {
      id: "left-kidney",
      label: "Left kidney",
      group: "Kidneys",
      color: "#b56256",
      description:
        "Lies against the back wall of the abdomen beside the spine, a little higher than the right kidney. Its vessels and ureter leave from the hilum on its inner border.",
    },
    {
      id: "right-ureter",
      label: "Right ureter",
      group: "Urinary tract",
      color: "#d09b73",
      description:
        "A narrow muscular tube, about 25 to 30 cm long, that carries urine from the right kidney down to the bladder by waves of contraction.",
    },
    {
      id: "left-ureter",
      label: "Left ureter",
      group: "Urinary tract",
      color: "#dcad86",
      description:
        "Carries urine from the left kidney to the bladder. It runs down over the psoas muscle and crosses into the pelvis near the split of the common iliac artery.",
    },
    {
      id: "right-renal-artery",
      label: "Right renal artery",
      group: "Arterial supply",
      color: "#bd514c",
      description:
        "Carries blood from the aorta to the right kidney. It is longer than the left artery and passes behind the inferior vena cava.",
    },
    {
      id: "left-renal-artery",
      label: "Left renal artery",
      group: "Arterial supply",
      color: "#cf6960",
      description:
        "Carries blood from the aorta to the left kidney. It is shorter than the right artery because the aorta lies left of the midline.",
    },
  ],
  attribution: {
    credit:
      "BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International",
    license: "CC BY 4.0",
    licenseUrl: "https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html",
    source:
      "https://github.com/organui/kidneys-3d/blob/880b7c9cdf9f2272eee7741b01ccb34454adb30c/public/models/LICENSE.txt",
  },
}

export type KidneysProps = Omit<OrganViewerProps, "model">

export function Kidneys(props: KidneysProps) {
  return <OrganViewer model={kidneysModel} {...props} />
}
