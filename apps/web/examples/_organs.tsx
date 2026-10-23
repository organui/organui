// Named documentation examples use the same public components consumers install.
// Keep imports explicit so each page loads only the examples it needs.
export const organExamples = {
  "adrenals-demo": {
    title: "Adrenals",
    file: "adrenals-demo.tsx",
    render: async () => {
      const { Example } = await import("./adrenals-demo")
      return <Example />
    },
  },
  "adrenals-without-controls": {
    title: "Adrenals Without Controls",
    file: "adrenals-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./adrenals-without-controls")
      return <Example />
    },
  },
  "adrenals-controlled": {
    title: "Adrenals Controlled Selection",
    file: "adrenals-controlled.tsx",
    render: async () => {
      const { Example } = await import("./adrenals-controlled")
      return <Example />
    },
  },
  "adrenals-with-anatomy": {
    title: "Adrenals With Anatomy Panel",
    file: "adrenals-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./adrenals-with-anatomy")
      return <Example />
    },
  },
  "appendix-demo": {
    title: "Appendix",
    file: "appendix-demo.tsx",
    render: async () => {
      const { Example } = await import("./appendix-demo")
      return <Example />
    },
  },
  "appendix-without-controls": {
    title: "Appendix Without Controls",
    file: "appendix-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./appendix-without-controls")
      return <Example />
    },
  },
  "appendix-controlled": {
    title: "Appendix Controlled Selection",
    file: "appendix-controlled.tsx",
    render: async () => {
      const { Example } = await import("./appendix-controlled")
      return <Example />
    },
  },
  "appendix-with-anatomy": {
    title: "Appendix With Anatomy Panel",
    file: "appendix-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./appendix-with-anatomy")
      return <Example />
    },
  },
  "bladder-demo": {
    title: "Bladder",
    file: "bladder-demo.tsx",
    render: async () => {
      const { Example } = await import("./bladder-demo")
      return <Example />
    },
  },
  "bladder-without-controls": {
    title: "Bladder Without Controls",
    file: "bladder-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./bladder-without-controls")
      return <Example />
    },
  },
  "bladder-controlled": {
    title: "Bladder Controlled Selection",
    file: "bladder-controlled.tsx",
    render: async () => {
      const { Example } = await import("./bladder-controlled")
      return <Example />
    },
  },
  "bladder-with-anatomy": {
    title: "Bladder With Anatomy Panel",
    file: "bladder-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./bladder-with-anatomy")
      return <Example />
    },
  },
  "brain-demo": {
    title: "Brain",
    file: "brain-demo.tsx",
    render: async () => {
      const { Example } = await import("./brain-demo")
      return <Example />
    },
  },
  "brain-without-controls": {
    title: "Brain Without Controls",
    file: "brain-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./brain-without-controls")
      return <Example />
    },
  },
  "brain-controlled": {
    title: "Brain Controlled Selection",
    file: "brain-controlled.tsx",
    render: async () => {
      const { Example } = await import("./brain-controlled")
      return <Example />
    },
  },
  "brain-with-anatomy": {
    title: "Brain With Anatomy Panel",
    file: "brain-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./brain-with-anatomy")
      return <Example />
    },
  },
  "breast-demo": {
    title: "Breast",
    file: "breast-demo.tsx",
    render: async () => {
      const { Example } = await import("./breast-demo")
      return <Example />
    },
  },
  "breast-without-controls": {
    title: "Breast Without Controls",
    file: "breast-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./breast-without-controls")
      return <Example />
    },
  },
  "breast-controlled": {
    title: "Breast Controlled Selection",
    file: "breast-controlled.tsx",
    render: async () => {
      const { Example } = await import("./breast-controlled")
      return <Example />
    },
  },
  "breast-with-anatomy": {
    title: "Breast With Anatomy Panel",
    file: "breast-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./breast-with-anatomy")
      return <Example />
    },
  },
  "diaphragm-demo": {
    title: "Diaphragm",
    file: "diaphragm-demo.tsx",
    render: async () => {
      const { Example } = await import("./diaphragm-demo")
      return <Example />
    },
  },
  "diaphragm-without-controls": {
    title: "Diaphragm Without Controls",
    file: "diaphragm-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./diaphragm-without-controls")
      return <Example />
    },
  },
  "diaphragm-controlled": {
    title: "Diaphragm Controlled Selection",
    file: "diaphragm-controlled.tsx",
    render: async () => {
      const { Example } = await import("./diaphragm-controlled")
      return <Example />
    },
  },
  "diaphragm-with-anatomy": {
    title: "Diaphragm With Anatomy Panel",
    file: "diaphragm-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./diaphragm-with-anatomy")
      return <Example />
    },
  },
  "ear-demo": {
    title: "Ear",
    file: "ear-demo.tsx",
    render: async () => {
      const { Example } = await import("./ear-demo")
      return <Example />
    },
  },
  "ear-without-controls": {
    title: "Ear Without Controls",
    file: "ear-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./ear-without-controls")
      return <Example />
    },
  },
  "ear-controlled": {
    title: "Ear Controlled Selection",
    file: "ear-controlled.tsx",
    render: async () => {
      const { Example } = await import("./ear-controlled")
      return <Example />
    },
  },
  "ear-with-anatomy": {
    title: "Ear With Anatomy Panel",
    file: "ear-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./ear-with-anatomy")
      return <Example />
    },
  },
  "esophagus-demo": {
    title: "Esophagus",
    file: "esophagus-demo.tsx",
    render: async () => {
      const { Example } = await import("./esophagus-demo")
      return <Example />
    },
  },
  "esophagus-without-controls": {
    title: "Esophagus Without Controls",
    file: "esophagus-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./esophagus-without-controls")
      return <Example />
    },
  },
  "esophagus-controlled": {
    title: "Esophagus Controlled Selection",
    file: "esophagus-controlled.tsx",
    render: async () => {
      const { Example } = await import("./esophagus-controlled")
      return <Example />
    },
  },
  "esophagus-with-anatomy": {
    title: "Esophagus With Anatomy Panel",
    file: "esophagus-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./esophagus-with-anatomy")
      return <Example />
    },
  },
  "eye-demo": {
    title: "Eye",
    file: "eye-demo.tsx",
    render: async () => {
      const { Example } = await import("./eye-demo")
      return <Example />
    },
  },
  "eye-without-controls": {
    title: "Eye Without Controls",
    file: "eye-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./eye-without-controls")
      return <Example />
    },
  },
  "eye-controlled": {
    title: "Eye Controlled Selection",
    file: "eye-controlled.tsx",
    render: async () => {
      const { Example } = await import("./eye-controlled")
      return <Example />
    },
  },
  "eye-with-anatomy": {
    title: "Eye With Anatomy Panel",
    file: "eye-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./eye-with-anatomy")
      return <Example />
    },
  },
  "gallbladder-demo": {
    title: "Gallbladder",
    file: "gallbladder-demo.tsx",
    render: async () => {
      const { Example } = await import("./gallbladder-demo")
      return <Example />
    },
  },
  "gallbladder-without-controls": {
    title: "Gallbladder Without Controls",
    file: "gallbladder-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./gallbladder-without-controls")
      return <Example />
    },
  },
  "gallbladder-controlled": {
    title: "Gallbladder Controlled Selection",
    file: "gallbladder-controlled.tsx",
    render: async () => {
      const { Example } = await import("./gallbladder-controlled")
      return <Example />
    },
  },
  "gallbladder-with-anatomy": {
    title: "Gallbladder With Anatomy Panel",
    file: "gallbladder-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./gallbladder-with-anatomy")
      return <Example />
    },
  },
  "hair-demo": {
    title: "Hair",
    file: "hair-demo.tsx",
    render: async () => {
      const { Example } = await import("./hair-demo")
      return <Example />
    },
  },
  "hair-without-controls": {
    title: "Hair Without Controls",
    file: "hair-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./hair-without-controls")
      return <Example />
    },
  },
  "hair-controlled": {
    title: "Hair Controlled Selection",
    file: "hair-controlled.tsx",
    render: async () => {
      const { Example } = await import("./hair-controlled")
      return <Example />
    },
  },
  "hair-with-anatomy": {
    title: "Hair With Anatomy Panel",
    file: "hair-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./hair-with-anatomy")
      return <Example />
    },
  },
  "heart-demo": {
    title: "Heart",
    file: "heart-demo.tsx",
    render: async () => {
      const { Example } = await import("./heart-demo")
      return <Example />
    },
  },
  "heart-without-controls": {
    title: "Heart Without Controls",
    file: "heart-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./heart-without-controls")
      return <Example />
    },
  },
  "heart-controlled": {
    title: "Heart Controlled Selection",
    file: "heart-controlled.tsx",
    render: async () => {
      const { Example } = await import("./heart-controlled")
      return <Example />
    },
  },
  "heart-with-anatomy": {
    title: "Heart With Anatomy Panel",
    file: "heart-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./heart-with-anatomy")
      return <Example />
    },
  },
  "intestines-demo": {
    title: "Intestines",
    file: "intestines-demo.tsx",
    render: async () => {
      const { Example } = await import("./intestines-demo")
      return <Example />
    },
  },
  "intestines-without-controls": {
    title: "Intestines Without Controls",
    file: "intestines-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./intestines-without-controls")
      return <Example />
    },
  },
  "intestines-controlled": {
    title: "Intestines Controlled Selection",
    file: "intestines-controlled.tsx",
    render: async () => {
      const { Example } = await import("./intestines-controlled")
      return <Example />
    },
  },
  "intestines-with-anatomy": {
    title: "Intestines With Anatomy Panel",
    file: "intestines-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./intestines-with-anatomy")
      return <Example />
    },
  },
  "joints-demo": {
    title: "Joints",
    file: "joints-demo.tsx",
    render: async () => {
      const { Example } = await import("./joints-demo")
      return <Example />
    },
  },
  "joints-without-controls": {
    title: "Joints Without Controls",
    file: "joints-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./joints-without-controls")
      return <Example />
    },
  },
  "joints-controlled": {
    title: "Joints Controlled Selection",
    file: "joints-controlled.tsx",
    render: async () => {
      const { Example } = await import("./joints-controlled")
      return <Example />
    },
  },
  "joints-with-anatomy": {
    title: "Joints With Anatomy Panel",
    file: "joints-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./joints-with-anatomy")
      return <Example />
    },
  },
  "kidneys-demo": {
    title: "Kidneys",
    file: "kidneys-demo.tsx",
    render: async () => {
      const { Example } = await import("./kidneys-demo")
      return <Example />
    },
  },
  "kidneys-without-controls": {
    title: "Kidneys Without Controls",
    file: "kidneys-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./kidneys-without-controls")
      return <Example />
    },
  },
  "kidneys-controlled": {
    title: "Kidneys Controlled Selection",
    file: "kidneys-controlled.tsx",
    render: async () => {
      const { Example } = await import("./kidneys-controlled")
      return <Example />
    },
  },
  "kidneys-with-anatomy": {
    title: "Kidneys With Anatomy Panel",
    file: "kidneys-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./kidneys-with-anatomy")
      return <Example />
    },
  },
  "larynx-demo": {
    title: "Larynx",
    file: "larynx-demo.tsx",
    render: async () => {
      const { Example } = await import("./larynx-demo")
      return <Example />
    },
  },
  "larynx-without-controls": {
    title: "Larynx Without Controls",
    file: "larynx-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./larynx-without-controls")
      return <Example />
    },
  },
  "larynx-controlled": {
    title: "Larynx Controlled Selection",
    file: "larynx-controlled.tsx",
    render: async () => {
      const { Example } = await import("./larynx-controlled")
      return <Example />
    },
  },
  "larynx-with-anatomy": {
    title: "Larynx With Anatomy Panel",
    file: "larynx-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./larynx-with-anatomy")
      return <Example />
    },
  },
  "liver-demo": {
    title: "Liver",
    file: "liver-demo.tsx",
    render: async () => {
      const { Example } = await import("./liver-demo")
      return <Example />
    },
  },
  "liver-without-controls": {
    title: "Liver Without Controls",
    file: "liver-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./liver-without-controls")
      return <Example />
    },
  },
  "liver-controlled": {
    title: "Liver Controlled Selection",
    file: "liver-controlled.tsx",
    render: async () => {
      const { Example } = await import("./liver-controlled")
      return <Example />
    },
  },
  "liver-with-anatomy": {
    title: "Liver With Anatomy Panel",
    file: "liver-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./liver-with-anatomy")
      return <Example />
    },
  },
  "liver-lobule-demo": {
    title: "Liver lobule",
    file: "liver-lobule-demo.tsx",
    render: async () => {
      const { Example } = await import("./liver-lobule-demo")
      return <Example />
    },
  },
  "liver-lobule-without-controls": {
    title: "Liver lobule Without Controls",
    file: "liver-lobule-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./liver-lobule-without-controls")
      return <Example />
    },
  },
  "liver-lobule-controlled": {
    title: "Liver lobule Controlled Selection",
    file: "liver-lobule-controlled.tsx",
    render: async () => {
      const { Example } = await import("./liver-lobule-controlled")
      return <Example />
    },
  },
  "liver-lobule-with-anatomy": {
    title: "Liver lobule With Anatomy Panel",
    file: "liver-lobule-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./liver-lobule-with-anatomy")
      return <Example />
    },
  },
  "lungs-demo": {
    title: "Lungs",
    file: "lungs-demo.tsx",
    render: async () => {
      const { Example } = await import("./lungs-demo")
      return <Example />
    },
  },
  "lungs-without-controls": {
    title: "Lungs Without Controls",
    file: "lungs-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./lungs-without-controls")
      return <Example />
    },
  },
  "lungs-controlled": {
    title: "Lungs Controlled Selection",
    file: "lungs-controlled.tsx",
    render: async () => {
      const { Example } = await import("./lungs-controlled")
      return <Example />
    },
  },
  "lungs-with-anatomy": {
    title: "Lungs With Anatomy Panel",
    file: "lungs-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./lungs-with-anatomy")
      return <Example />
    },
  },
  "lymph-demo": {
    title: "Lymph node",
    file: "lymph-demo.tsx",
    render: async () => {
      const { Example } = await import("./lymph-demo")
      return <Example />
    },
  },
  "lymph-without-controls": {
    title: "Lymph node Without Controls",
    file: "lymph-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./lymph-without-controls")
      return <Example />
    },
  },
  "lymph-controlled": {
    title: "Lymph node Controlled Selection",
    file: "lymph-controlled.tsx",
    render: async () => {
      const { Example } = await import("./lymph-controlled")
      return <Example />
    },
  },
  "lymph-with-anatomy": {
    title: "Lymph node With Anatomy Panel",
    file: "lymph-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./lymph-with-anatomy")
      return <Example />
    },
  },
  "muscles-demo": {
    title: "Muscles",
    file: "muscles-demo.tsx",
    render: async () => {
      const { Example } = await import("./muscles-demo")
      return <Example />
    },
  },
  "muscles-without-controls": {
    title: "Muscles Without Controls",
    file: "muscles-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./muscles-without-controls")
      return <Example />
    },
  },
  "muscles-controlled": {
    title: "Muscles Controlled Selection",
    file: "muscles-controlled.tsx",
    render: async () => {
      const { Example } = await import("./muscles-controlled")
      return <Example />
    },
  },
  "muscles-with-anatomy": {
    title: "Muscles With Anatomy Panel",
    file: "muscles-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./muscles-with-anatomy")
      return <Example />
    },
  },
  "nails-demo": {
    title: "Nails",
    file: "nails-demo.tsx",
    render: async () => {
      const { Example } = await import("./nails-demo")
      return <Example />
    },
  },
  "nails-without-controls": {
    title: "Nails Without Controls",
    file: "nails-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./nails-without-controls")
      return <Example />
    },
  },
  "nails-controlled": {
    title: "Nails Controlled Selection",
    file: "nails-controlled.tsx",
    render: async () => {
      const { Example } = await import("./nails-controlled")
      return <Example />
    },
  },
  "nails-with-anatomy": {
    title: "Nails With Anatomy Panel",
    file: "nails-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./nails-with-anatomy")
      return <Example />
    },
  },
  "nerves-demo": {
    title: "Nerves",
    file: "nerves-demo.tsx",
    render: async () => {
      const { Example } = await import("./nerves-demo")
      return <Example />
    },
  },
  "nerves-without-controls": {
    title: "Nerves Without Controls",
    file: "nerves-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./nerves-without-controls")
      return <Example />
    },
  },
  "nerves-controlled": {
    title: "Nerves Controlled Selection",
    file: "nerves-controlled.tsx",
    render: async () => {
      const { Example } = await import("./nerves-controlled")
      return <Example />
    },
  },
  "nerves-with-anatomy": {
    title: "Nerves With Anatomy Panel",
    file: "nerves-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./nerves-with-anatomy")
      return <Example />
    },
  },
  "nose-demo": {
    title: "Nose",
    file: "nose-demo.tsx",
    render: async () => {
      const { Example } = await import("./nose-demo")
      return <Example />
    },
  },
  "nose-without-controls": {
    title: "Nose Without Controls",
    file: "nose-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./nose-without-controls")
      return <Example />
    },
  },
  "nose-controlled": {
    title: "Nose Controlled Selection",
    file: "nose-controlled.tsx",
    render: async () => {
      const { Example } = await import("./nose-controlled")
      return <Example />
    },
  },
  "nose-with-anatomy": {
    title: "Nose With Anatomy Panel",
    file: "nose-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./nose-with-anatomy")
      return <Example />
    },
  },
  "pancreas-demo": {
    title: "Pancreas",
    file: "pancreas-demo.tsx",
    render: async () => {
      const { Example } = await import("./pancreas-demo")
      return <Example />
    },
  },
  "pancreas-without-controls": {
    title: "Pancreas Without Controls",
    file: "pancreas-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./pancreas-without-controls")
      return <Example />
    },
  },
  "pancreas-controlled": {
    title: "Pancreas Controlled Selection",
    file: "pancreas-controlled.tsx",
    render: async () => {
      const { Example } = await import("./pancreas-controlled")
      return <Example />
    },
  },
  "pancreas-with-anatomy": {
    title: "Pancreas With Anatomy Panel",
    file: "pancreas-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./pancreas-with-anatomy")
      return <Example />
    },
  },
  "parathyroid-demo": {
    title: "Parathyroid",
    file: "parathyroid-demo.tsx",
    render: async () => {
      const { Example } = await import("./parathyroid-demo")
      return <Example />
    },
  },
  "parathyroid-without-controls": {
    title: "Parathyroid Without Controls",
    file: "parathyroid-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./parathyroid-without-controls")
      return <Example />
    },
  },
  "parathyroid-controlled": {
    title: "Parathyroid Controlled Selection",
    file: "parathyroid-controlled.tsx",
    render: async () => {
      const { Example } = await import("./parathyroid-controlled")
      return <Example />
    },
  },
  "parathyroid-with-anatomy": {
    title: "Parathyroid With Anatomy Panel",
    file: "parathyroid-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./parathyroid-with-anatomy")
      return <Example />
    },
  },
  "pharynx-demo": {
    title: "Pharynx",
    file: "pharynx-demo.tsx",
    render: async () => {
      const { Example } = await import("./pharynx-demo")
      return <Example />
    },
  },
  "pharynx-without-controls": {
    title: "Pharynx Without Controls",
    file: "pharynx-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./pharynx-without-controls")
      return <Example />
    },
  },
  "pharynx-controlled": {
    title: "Pharynx Controlled Selection",
    file: "pharynx-controlled.tsx",
    render: async () => {
      const { Example } = await import("./pharynx-controlled")
      return <Example />
    },
  },
  "pharynx-with-anatomy": {
    title: "Pharynx With Anatomy Panel",
    file: "pharynx-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./pharynx-with-anatomy")
      return <Example />
    },
  },
  "pineal-demo": {
    title: "Pineal",
    file: "pineal-demo.tsx",
    render: async () => {
      const { Example } = await import("./pineal-demo")
      return <Example />
    },
  },
  "pineal-without-controls": {
    title: "Pineal Without Controls",
    file: "pineal-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./pineal-without-controls")
      return <Example />
    },
  },
  "pineal-controlled": {
    title: "Pineal Controlled Selection",
    file: "pineal-controlled.tsx",
    render: async () => {
      const { Example } = await import("./pineal-controlled")
      return <Example />
    },
  },
  "pineal-with-anatomy": {
    title: "Pineal With Anatomy Panel",
    file: "pineal-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./pineal-with-anatomy")
      return <Example />
    },
  },
  "pituitary-demo": {
    title: "Pituitary",
    file: "pituitary-demo.tsx",
    render: async () => {
      const { Example } = await import("./pituitary-demo")
      return <Example />
    },
  },
  "pituitary-without-controls": {
    title: "Pituitary Without Controls",
    file: "pituitary-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./pituitary-without-controls")
      return <Example />
    },
  },
  "pituitary-controlled": {
    title: "Pituitary Controlled Selection",
    file: "pituitary-controlled.tsx",
    render: async () => {
      const { Example } = await import("./pituitary-controlled")
      return <Example />
    },
  },
  "pituitary-with-anatomy": {
    title: "Pituitary With Anatomy Panel",
    file: "pituitary-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./pituitary-with-anatomy")
      return <Example />
    },
  },
  "prostate-demo": {
    title: "Prostate",
    file: "prostate-demo.tsx",
    render: async () => {
      const { Example } = await import("./prostate-demo")
      return <Example />
    },
  },
  "prostate-without-controls": {
    title: "Prostate Without Controls",
    file: "prostate-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./prostate-without-controls")
      return <Example />
    },
  },
  "prostate-controlled": {
    title: "Prostate Controlled Selection",
    file: "prostate-controlled.tsx",
    render: async () => {
      const { Example } = await import("./prostate-controlled")
      return <Example />
    },
  },
  "prostate-with-anatomy": {
    title: "Prostate With Anatomy Panel",
    file: "prostate-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./prostate-with-anatomy")
      return <Example />
    },
  },
  "salivary-glands-demo": {
    title: "Salivary glands",
    file: "salivary-glands-demo.tsx",
    render: async () => {
      const { Example } = await import("./salivary-glands-demo")
      return <Example />
    },
  },
  "salivary-glands-without-controls": {
    title: "Salivary glands Without Controls",
    file: "salivary-glands-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./salivary-glands-without-controls")
      return <Example />
    },
  },
  "salivary-glands-controlled": {
    title: "Salivary glands Controlled Selection",
    file: "salivary-glands-controlled.tsx",
    render: async () => {
      const { Example } = await import("./salivary-glands-controlled")
      return <Example />
    },
  },
  "salivary-glands-with-anatomy": {
    title: "Salivary glands With Anatomy Panel",
    file: "salivary-glands-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./salivary-glands-with-anatomy")
      return <Example />
    },
  },
  "skeleton-demo": {
    title: "Skeleton",
    file: "skeleton-demo.tsx",
    render: async () => {
      const { Example } = await import("./skeleton-demo")
      return <Example />
    },
  },
  "skeleton-without-controls": {
    title: "Skeleton Without Controls",
    file: "skeleton-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./skeleton-without-controls")
      return <Example />
    },
  },
  "skeleton-controlled": {
    title: "Skeleton Controlled Selection",
    file: "skeleton-controlled.tsx",
    render: async () => {
      const { Example } = await import("./skeleton-controlled")
      return <Example />
    },
  },
  "skeleton-with-anatomy": {
    title: "Skeleton With Anatomy Panel",
    file: "skeleton-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./skeleton-with-anatomy")
      return <Example />
    },
  },
  "skin-demo": {
    title: "Skin",
    file: "skin-demo.tsx",
    render: async () => {
      const { Example } = await import("./skin-demo")
      return <Example />
    },
  },
  "skin-without-controls": {
    title: "Skin Without Controls",
    file: "skin-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./skin-without-controls")
      return <Example />
    },
  },
  "skin-controlled": {
    title: "Skin Controlled Selection",
    file: "skin-controlled.tsx",
    render: async () => {
      const { Example } = await import("./skin-controlled")
      return <Example />
    },
  },
  "skin-with-anatomy": {
    title: "Skin With Anatomy Panel",
    file: "skin-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./skin-with-anatomy")
      return <Example />
    },
  },
  "spinal-cord-demo": {
    title: "Spinal cord",
    file: "spinal-cord-demo.tsx",
    render: async () => {
      const { Example } = await import("./spinal-cord-demo")
      return <Example />
    },
  },
  "spinal-cord-without-controls": {
    title: "Spinal cord Without Controls",
    file: "spinal-cord-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./spinal-cord-without-controls")
      return <Example />
    },
  },
  "spinal-cord-controlled": {
    title: "Spinal cord Controlled Selection",
    file: "spinal-cord-controlled.tsx",
    render: async () => {
      const { Example } = await import("./spinal-cord-controlled")
      return <Example />
    },
  },
  "spinal-cord-with-anatomy": {
    title: "Spinal cord With Anatomy Panel",
    file: "spinal-cord-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./spinal-cord-with-anatomy")
      return <Example />
    },
  },
  "spleen-demo": {
    title: "Spleen",
    file: "spleen-demo.tsx",
    render: async () => {
      const { Example } = await import("./spleen-demo")
      return <Example />
    },
  },
  "spleen-without-controls": {
    title: "Spleen Without Controls",
    file: "spleen-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./spleen-without-controls")
      return <Example />
    },
  },
  "spleen-controlled": {
    title: "Spleen Controlled Selection",
    file: "spleen-controlled.tsx",
    render: async () => {
      const { Example } = await import("./spleen-controlled")
      return <Example />
    },
  },
  "spleen-with-anatomy": {
    title: "Spleen With Anatomy Panel",
    file: "spleen-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./spleen-with-anatomy")
      return <Example />
    },
  },
  "stomach-demo": {
    title: "Stomach",
    file: "stomach-demo.tsx",
    render: async () => {
      const { Example } = await import("./stomach-demo")
      return <Example />
    },
  },
  "stomach-without-controls": {
    title: "Stomach Without Controls",
    file: "stomach-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./stomach-without-controls")
      return <Example />
    },
  },
  "stomach-controlled": {
    title: "Stomach Controlled Selection",
    file: "stomach-controlled.tsx",
    render: async () => {
      const { Example } = await import("./stomach-controlled")
      return <Example />
    },
  },
  "stomach-with-anatomy": {
    title: "Stomach With Anatomy Panel",
    file: "stomach-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./stomach-with-anatomy")
      return <Example />
    },
  },
  "teeth-demo": {
    title: "Teeth",
    file: "teeth-demo.tsx",
    render: async () => {
      const { Example } = await import("./teeth-demo")
      return <Example />
    },
  },
  "teeth-without-controls": {
    title: "Teeth Without Controls",
    file: "teeth-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./teeth-without-controls")
      return <Example />
    },
  },
  "teeth-controlled": {
    title: "Teeth Controlled Selection",
    file: "teeth-controlled.tsx",
    render: async () => {
      const { Example } = await import("./teeth-controlled")
      return <Example />
    },
  },
  "teeth-with-anatomy": {
    title: "Teeth With Anatomy Panel",
    file: "teeth-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./teeth-with-anatomy")
      return <Example />
    },
  },
  "thymus-demo": {
    title: "Thymus",
    file: "thymus-demo.tsx",
    render: async () => {
      const { Example } = await import("./thymus-demo")
      return <Example />
    },
  },
  "thymus-without-controls": {
    title: "Thymus Without Controls",
    file: "thymus-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./thymus-without-controls")
      return <Example />
    },
  },
  "thymus-controlled": {
    title: "Thymus Controlled Selection",
    file: "thymus-controlled.tsx",
    render: async () => {
      const { Example } = await import("./thymus-controlled")
      return <Example />
    },
  },
  "thymus-with-anatomy": {
    title: "Thymus With Anatomy Panel",
    file: "thymus-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./thymus-with-anatomy")
      return <Example />
    },
  },
  "thyroid-demo": {
    title: "Thyroid",
    file: "thyroid-demo.tsx",
    render: async () => {
      const { Example } = await import("./thyroid-demo")
      return <Example />
    },
  },
  "thyroid-without-controls": {
    title: "Thyroid Without Controls",
    file: "thyroid-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./thyroid-without-controls")
      return <Example />
    },
  },
  "thyroid-controlled": {
    title: "Thyroid Controlled Selection",
    file: "thyroid-controlled.tsx",
    render: async () => {
      const { Example } = await import("./thyroid-controlled")
      return <Example />
    },
  },
  "thyroid-with-anatomy": {
    title: "Thyroid With Anatomy Panel",
    file: "thyroid-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./thyroid-with-anatomy")
      return <Example />
    },
  },
  "tongue-demo": {
    title: "Tongue",
    file: "tongue-demo.tsx",
    render: async () => {
      const { Example } = await import("./tongue-demo")
      return <Example />
    },
  },
  "tongue-without-controls": {
    title: "Tongue Without Controls",
    file: "tongue-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./tongue-without-controls")
      return <Example />
    },
  },
  "tongue-controlled": {
    title: "Tongue Controlled Selection",
    file: "tongue-controlled.tsx",
    render: async () => {
      const { Example } = await import("./tongue-controlled")
      return <Example />
    },
  },
  "tongue-with-anatomy": {
    title: "Tongue With Anatomy Panel",
    file: "tongue-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./tongue-with-anatomy")
      return <Example />
    },
  },
  "uterus-demo": {
    title: "Uterus",
    file: "uterus-demo.tsx",
    render: async () => {
      const { Example } = await import("./uterus-demo")
      return <Example />
    },
  },
  "uterus-without-controls": {
    title: "Uterus Without Controls",
    file: "uterus-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./uterus-without-controls")
      return <Example />
    },
  },
  "uterus-controlled": {
    title: "Uterus Controlled Selection",
    file: "uterus-controlled.tsx",
    render: async () => {
      const { Example } = await import("./uterus-controlled")
      return <Example />
    },
  },
  "uterus-with-anatomy": {
    title: "Uterus With Anatomy Panel",
    file: "uterus-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./uterus-with-anatomy")
      return <Example />
    },
  },
  "vessels-demo": {
    title: "Vessels",
    file: "vessels-demo.tsx",
    render: async () => {
      const { Example } = await import("./vessels-demo")
      return <Example />
    },
  },
  "vessels-without-controls": {
    title: "Vessels Without Controls",
    file: "vessels-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./vessels-without-controls")
      return <Example />
    },
  },
  "vessels-controlled": {
    title: "Vessels Controlled Selection",
    file: "vessels-controlled.tsx",
    render: async () => {
      const { Example } = await import("./vessels-controlled")
      return <Example />
    },
  },
  "vessels-with-anatomy": {
    title: "Vessels With Anatomy Panel",
    file: "vessels-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./vessels-with-anatomy")
      return <Example />
    },
  },
  "vestibular-demo": {
    title: "Vestibular system",
    file: "vestibular-demo.tsx",
    render: async () => {
      const { Example } = await import("./vestibular-demo")
      return <Example />
    },
  },
  "vestibular-without-controls": {
    title: "Vestibular system Without Controls",
    file: "vestibular-without-controls.tsx",
    render: async () => {
      const { Example } = await import("./vestibular-without-controls")
      return <Example />
    },
  },
  "vestibular-controlled": {
    title: "Vestibular system Controlled Selection",
    file: "vestibular-controlled.tsx",
    render: async () => {
      const { Example } = await import("./vestibular-controlled")
      return <Example />
    },
  },
  "vestibular-with-anatomy": {
    title: "Vestibular system With Anatomy Panel",
    file: "vestibular-with-anatomy.tsx",
    render: async () => {
      const { Example } = await import("./vestibular-with-anatomy")
      return <Example />
    },
  },
}
