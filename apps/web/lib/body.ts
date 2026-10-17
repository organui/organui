import type { OrganModel } from "@workspace/registry/organ-viewer/organ-viewer"

// The homepage body model, built by scripts/models/body.ts from BodyParts3D
// 4.3. Each structure is named after the registry item it opens; its parts,
// such as the skull or the hand bones, are child nodes in the GLB.
export type BodyRegion =
  "Head and neck" | "Chest" | "Abdomen" | "Pelvis" | "Whole body"

export const bodyRegions: readonly BodyRegion[] = [
  "Head and neck",
  "Chest",
  "Abdomen",
  "Pelvis",
  "Whole body",
]

export type BodyPlace = {
  region: BodyRegion
  /** One line for the card shown when the organ is picked. */
  summary: string
  /**
   * Structures or parts to frame. Organs drawn on the body frame themselves;
   * small ones may add their neighbours, and undrawn ones frame the area
   * they belong to.
   */
  frame?: readonly string[]
  /**
   * Share of the stage the framed anatomy takes; tiny glands take less so
   * their surroundings stay in sight. Defaults to 0.4.
   */
  fill?: number
  /** Structures hidden while picked, when they bury the organ. */
  hide?: readonly string[]
  /** Hidden layers shown while picked, such as bones the frame relies on. */
  show?: readonly string[]
  /** Set when the organ is not drawn on the body model. */
  note?: string
}

// One entry per organ registry item; the web tests check none is missing.
export const bodyPlaces: Record<string, BodyPlace> = {
  adrenals: {
    region: "Abdomen",
    summary:
      "Small glands on top of each kidney that make cortisol and adrenaline.",
    frame: ["adrenals", "kidneys"],
  },
  appendix: {
    region: "Abdomen",
    summary: "A narrow pouch off the start of the large intestine.",
  },
  bladder: {
    region: "Pelvis",
    summary: "The muscular bag that stores urine until it is passed.",
  },
  brain: {
    region: "Head and neck",
    summary:
      "Runs thought, movement, the senses and the body's automatic work.",
  },
  breast: {
    region: "Chest",
    summary: "Fat, ducts and milk-making lobes on the front of the chest.",
    frame: ["rib-cage"],
    show: ["skeleton"],
    note: "This body model is male, so the breast component shows the HuBMAP female breasts instead.",
  },
  diaphragm: {
    region: "Chest",
    summary: "The dome of muscle under the lungs that drives breathing.",
  },
  ear: {
    region: "Head and neck",
    summary:
      "Collects sound and passes it through the middle ear to the cochlea.",
  },
  esophagus: {
    region: "Chest",
    summary:
      "The muscular tube that carries food from the throat to the stomach.",
  },
  eye: {
    region: "Head and neck",
    summary:
      "Focuses light onto the retina and sends what it sees to the brain.",
  },
  gallbladder: {
    region: "Abdomen",
    summary:
      "Stores bile from the liver and squeezes it into the gut after meals.",
  },
  hair: {
    region: "Whole body",
    summary:
      "Grows from follicles in the skin; the component shows one follicle.",
  },
  heart: {
    region: "Chest",
    summary: "Four chambers that pump blood through the lungs and the body.",
  },
  intestines: {
    region: "Abdomen",
    summary:
      "The small intestine absorbs food and the large intestine absorbs water.",
  },
  joints: {
    region: "Whole body",
    summary: "Where bones meet, held together by capsules and ligaments.",
    frame: ["skeleton"],
    show: ["skeleton"],
    note: "Joint ligaments are not drawn on this body; the component shows them all.",
  },
  kidneys: {
    region: "Abdomen",
    summary: "Filter the blood and make urine.",
  },
  larynx: {
    region: "Head and neck",
    summary:
      "The voice box: cartilages and folds that protect the airway and make sound.",
  },
  liver: {
    region: "Abdomen",
    summary:
      "The largest organ inside the body; it processes nutrients and makes bile.",
  },
  lungs: {
    region: "Chest",
    summary:
      "Branching airways ending in air sacs, where oxygen enters the blood.",
  },
  lymph: {
    region: "Whole body",
    summary:
      "Lymph nodes filter lymph and gather immune cells; the component shows one node.",
    note: "Lymph nodes are not drawn on this body.",
  },
  muscles: {
    region: "Whole body",
    summary:
      "Skeletal muscles move the bones; this body shows the larger ones.",
  },
  nails: {
    region: "Whole body",
    summary:
      "Hard plates of keratin protecting the tips of the fingers and toes.",
    frame: ["hand-bones"],
    show: ["skeleton"],
    note: "Nails are not drawn on this body; the component shows a fingertip.",
  },
  nerves: {
    region: "Whole body",
    summary:
      "Carry signals between the spinal cord and the body; this body shows the main ones.",
  },
  nose: {
    region: "Head and neck",
    summary:
      "Warms and filters the air you breathe, and holds the sense of smell.",
  },
  pancreas: {
    region: "Abdomen",
    summary: "Makes digestive juices and the hormones insulin and glucagon.",
  },
  parathyroid: {
    region: "Head and neck",
    summary: "Four tiny glands behind the thyroid that control calcium.",
    fill: 0.25,
  },
  pharynx: {
    region: "Head and neck",
    summary: "The throat, shared by food and air behind the nose and mouth.",
  },
  pineal: {
    region: "Head and neck",
    summary: "A small gland deep in the brain that makes melatonin.",
    fill: 0.2,
    hide: ["skeleton", "eye", "nose", "teeth"],
  },
  pituitary: {
    region: "Head and neck",
    summary: "A pea-sized gland under the brain that runs many other glands.",
    fill: 0.2,
    hide: ["skeleton", "eye", "nose", "teeth"],
  },
  prostate: {
    region: "Pelvis",
    summary: "A gland below the bladder that adds fluid to semen.",
  },
  "salivary-glands": {
    region: "Head and neck",
    summary:
      "Make saliva; this body shows the glands under the jaw and tongue.",
  },
  skeleton: {
    region: "Whole body",
    summary:
      "The bones that support the body, protect organs and anchor muscles.",
  },
  skin: {
    region: "Whole body",
    summary: "The body's outer layer, which protects it and senses touch.",
  },
  "spinal-cord": {
    region: "Whole body",
    summary: "Carries signals between the brain and the body inside the spine.",
  },
  spleen: {
    region: "Abdomen",
    summary: "Filters the blood and stores immune cells, under the left ribs.",
  },
  stomach: {
    region: "Abdomen",
    summary:
      "Mixes food with acid and enzymes before it moves on to the intestine.",
  },
  teeth: {
    region: "Head and neck",
    summary: "Cut and grind food, set in the upper and lower jaws.",
  },
  thymus: {
    region: "Chest",
    summary:
      "Trains immune T cells behind the breastbone; largest in childhood.",
  },
  thyroid: {
    region: "Head and neck",
    summary:
      "A butterfly-shaped gland in the neck that sets the body's metabolism.",
  },
  tongue: {
    region: "Head and neck",
    summary: "A muscle for tasting, chewing, swallowing and speech.",
  },
  uterus: {
    region: "Pelvis",
    summary: "The womb, where a pregnancy grows.",
    frame: ["bladder", "hip-bones"],
    show: ["skeleton"],
    note: "This body model is male, so the uterus component shows its own female model.",
  },
  vessels: {
    region: "Whole body",
    summary: "Arteries carry blood from the heart and veins bring it back.",
  },
  vestibular: {
    region: "Head and neck",
    summary:
      "The inner ear's balance organs, shown here by the nerve that serves them.",
    fill: 0.25,
    hide: ["skeleton"],
  },
}

// Body systems that would crowd the organs are drawn only once picked.
export const bodyLayers = ["skeleton", "muscles", "vessels", "nerves"] as const

const structure = (
  id: string,
  label: string,
  color: string
): OrganModel["structures"][number] => ({
  id,
  label,
  group: bodyPlaces[id]?.region ?? "Whole body",
  color,
})

export const bodyModel: OrganModel = {
  name: "Human body",
  src: "/models/body.glb",
  bytes: 1596424,
  defaultView: "Anterior",
  views: [
    { name: "Anterior", direction: [0, 0, 1] },
    { name: "Posterior", direction: [0, 0, -1] },
    { name: "Left lateral", direction: [1, 0, 0] },
    { name: "Right lateral", direction: [-1, 0, 0] },
  ],
  hiddenIds: [...bodyLayers],
  structures: [
    { ...structure("skin", "Skin", "#e8c4a8"), opacity: 0.12 },
    structure("hair", "Hair", "#5b4636"),
    { ...structure("skeleton", "Skeleton", "#e9e1cc"), opacity: 0.4 },
    structure("brain", "Brain", "#e3a7a0"),
    structure("pituitary", "Pituitary", "#d68a6e"),
    structure("pineal", "Pineal", "#c9a27a"),
    structure("eye", "Eye", "#f2efe8"),
    structure("ear", "Ear", "#e0ae95"),
    structure("vestibular", "Vestibular system", "#e8d27a"),
    structure("nose", "Nose", "#d9b8a6"),
    structure("tongue", "Tongue", "#d4767a"),
    structure("teeth", "Teeth", "#f5f1e6"),
    structure("salivary-glands", "Salivary glands", "#d9a35f"),
    structure("pharynx", "Pharynx", "#c46f6a"),
    structure("larynx", "Larynx", "#a9c6d9"),
    structure("thyroid", "Thyroid", "#b8475a"),
    structure("parathyroid", "Parathyroid", "#e2b25c"),
    structure("thymus", "Thymus", "#d9a0a9"),
    structure("esophagus", "Esophagus", "#c97b6b"),
    structure("lungs", "Lungs", "#e9a0a8"),
    structure("heart", "Heart", "#c0392b"),
    structure("diaphragm", "Diaphragm", "#b5655a"),
    structure("liver", "Liver", "#8e3b33"),
    structure("gallbladder", "Gallbladder", "#5f8a3a"),
    structure("stomach", "Stomach", "#d98b7a"),
    structure("spleen", "Spleen", "#7d3f5c"),
    structure("pancreas", "Pancreas", "#e6b77a"),
    structure("adrenals", "Adrenals", "#e0a43a"),
    structure("kidneys", "Kidneys", "#9c4a3c"),
    structure("intestines", "Intestines", "#e3a58c"),
    structure("appendix", "Appendix", "#c9826a"),
    structure("bladder", "Bladder", "#e2c35a"),
    structure("prostate", "Prostate", "#b97a8f"),
    structure("spinal-cord", "Spinal cord", "#f0d9a0"),
    structure("muscles", "Muscles", "#b5524a"),
    structure("vessels", "Vessels", "#c4302b"),
    structure("nerves", "Nerves", "#f1c94b"),
  ],
  attribution: {
    credit:
      "BodyParts3D / Anatomography, © The Database Center for Life Science. CC BY-SA 2.1 Japan. Adapted by OrganUI.",
    license: "CC BY-SA 2.1 JP",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en",
    source:
      "https://github.com/organui/organui/blob/master/apps/web/public/models/body.ATTRIBUTION.md",
  },
}
