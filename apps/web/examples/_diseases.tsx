// Named documentation examples for the diseases, on the public components
// consumers install. Imports stay explicit so each page loads only its own.
export const diseaseExamples = {
  "acute-angle-closure-glaucoma-demo": {
    title: "Acute angle-closure glaucoma",
    file: "acute-angle-closure-glaucoma-demo.tsx",
    render: async () => {
      const { Example } = await import("./acute-angle-closure-glaucoma-demo")
      return <Example />
    },
  },
  "acute-angle-closure-glaucoma-without-panel": {
    title: "Acute angle-closure glaucoma Without Panel",
    file: "acute-angle-closure-glaucoma-without-panel.tsx",
    render: async () => {
      const { Example } =
        await import("./acute-angle-closure-glaucoma-without-panel")
      return <Example />
    },
  },
  "acute-angle-closure-glaucoma-controlled": {
    title: "Acute angle-closure glaucoma Controlled",
    file: "acute-angle-closure-glaucoma-controlled.tsx",
    render: async () => {
      const { Example } =
        await import("./acute-angle-closure-glaucoma-controlled")
      return <Example />
    },
  },
  "acute-appendicitis-demo": {
    title: "Acute appendicitis",
    file: "acute-appendicitis-demo.tsx",
    render: async () => {
      const { Example } = await import("./acute-appendicitis-demo")
      return <Example />
    },
  },
  "acute-appendicitis-without-panel": {
    title: "Acute appendicitis Without Panel",
    file: "acute-appendicitis-without-panel.tsx",
    render: async () => {
      const { Example } = await import("./acute-appendicitis-without-panel")
      return <Example />
    },
  },
  "acute-appendicitis-controlled": {
    title: "Acute appendicitis Controlled",
    file: "acute-appendicitis-controlled.tsx",
    render: async () => {
      const { Example } = await import("./acute-appendicitis-controlled")
      return <Example />
    },
  },
  "autoimmune-hepatitis-demo": {
    title: "Autoimmune hepatitis",
    file: "autoimmune-hepatitis-demo.tsx",
    render: async () => {
      const { Example } = await import("./autoimmune-hepatitis-demo")
      return <Example />
    },
  },
  "autoimmune-hepatitis-without-panel": {
    title: "Autoimmune hepatitis Without Panel",
    file: "autoimmune-hepatitis-without-panel.tsx",
    render: async () => {
      const { Example } = await import("./autoimmune-hepatitis-without-panel")
      return <Example />
    },
  },
  "autoimmune-hepatitis-controlled": {
    title: "Autoimmune hepatitis Controlled",
    file: "autoimmune-hepatitis-controlled.tsx",
    render: async () => {
      const { Example } = await import("./autoimmune-hepatitis-controlled")
      return <Example />
    },
  },
  "benign-prostatic-hyperplasia-demo": {
    title: "Benign prostatic hyperplasia",
    file: "benign-prostatic-hyperplasia-demo.tsx",
    render: async () => {
      const { Example } = await import("./benign-prostatic-hyperplasia-demo")
      return <Example />
    },
  },
  "benign-prostatic-hyperplasia-without-panel": {
    title: "Benign prostatic hyperplasia Without Panel",
    file: "benign-prostatic-hyperplasia-without-panel.tsx",
    render: async () => {
      const { Example } =
        await import("./benign-prostatic-hyperplasia-without-panel")
      return <Example />
    },
  },
  "benign-prostatic-hyperplasia-controlled": {
    title: "Benign prostatic hyperplasia Controlled",
    file: "benign-prostatic-hyperplasia-controlled.tsx",
    render: async () => {
      const { Example } =
        await import("./benign-prostatic-hyperplasia-controlled")
      return <Example />
    },
  },
  "ectopic-pregnancy-demo": {
    title: "Ectopic pregnancy",
    file: "ectopic-pregnancy-demo.tsx",
    render: async () => {
      const { Example } = await import("./ectopic-pregnancy-demo")
      return <Example />
    },
  },
  "ectopic-pregnancy-without-panel": {
    title: "Ectopic pregnancy Without Panel",
    file: "ectopic-pregnancy-without-panel.tsx",
    render: async () => {
      const { Example } = await import("./ectopic-pregnancy-without-panel")
      return <Example />
    },
  },
  "ectopic-pregnancy-controlled": {
    title: "Ectopic pregnancy Controlled",
    file: "ectopic-pregnancy-controlled.tsx",
    render: async () => {
      const { Example } = await import("./ectopic-pregnancy-controlled")
      return <Example />
    },
  },
  "gallstone-disease-demo": {
    title: "Gallstone disease",
    file: "gallstone-disease-demo.tsx",
    render: async () => {
      const { Example } = await import("./gallstone-disease-demo")
      return <Example />
    },
  },
  "gallstone-disease-without-panel": {
    title: "Gallstone disease Without Panel",
    file: "gallstone-disease-without-panel.tsx",
    render: async () => {
      const { Example } = await import("./gallstone-disease-without-panel")
      return <Example />
    },
  },
  "gallstone-disease-controlled": {
    title: "Gallstone disease Controlled",
    file: "gallstone-disease-controlled.tsx",
    render: async () => {
      const { Example } = await import("./gallstone-disease-controlled")
      return <Example />
    },
  },
  "graves-disease-demo": {
    title: "Graves' disease",
    file: "graves-disease-demo.tsx",
    render: async () => {
      const { Example } = await import("./graves-disease-demo")
      return <Example />
    },
  },
  "graves-disease-without-panel": {
    title: "Graves' disease Without Panel",
    file: "graves-disease-without-panel.tsx",
    render: async () => {
      const { Example } = await import("./graves-disease-without-panel")
      return <Example />
    },
  },
  "graves-disease-controlled": {
    title: "Graves' disease Controlled",
    file: "graves-disease-controlled.tsx",
    render: async () => {
      const { Example } = await import("./graves-disease-controlled")
      return <Example />
    },
  },
  "ischaemic-stroke-demo": {
    title: "Ischaemic stroke",
    file: "ischaemic-stroke-demo.tsx",
    render: async () => {
      const { Example } = await import("./ischaemic-stroke-demo")
      return <Example />
    },
  },
  "ischaemic-stroke-without-panel": {
    title: "Ischaemic stroke Without Panel",
    file: "ischaemic-stroke-without-panel.tsx",
    render: async () => {
      const { Example } = await import("./ischaemic-stroke-without-panel")
      return <Example />
    },
  },
  "ischaemic-stroke-controlled": {
    title: "Ischaemic stroke Controlled",
    file: "ischaemic-stroke-controlled.tsx",
    render: async () => {
      const { Example } = await import("./ischaemic-stroke-controlled")
      return <Example />
    },
  },
  "kidney-stones-demo": {
    title: "Kidney stones",
    file: "kidney-stones-demo.tsx",
    render: async () => {
      const { Example } = await import("./kidney-stones-demo")
      return <Example />
    },
  },
  "kidney-stones-without-panel": {
    title: "Kidney stones Without Panel",
    file: "kidney-stones-without-panel.tsx",
    render: async () => {
      const { Example } = await import("./kidney-stones-without-panel")
      return <Example />
    },
  },
  "kidney-stones-controlled": {
    title: "Kidney stones Controlled",
    file: "kidney-stones-controlled.tsx",
    render: async () => {
      const { Example } = await import("./kidney-stones-controlled")
      return <Example />
    },
  },
  "lobar-pneumonia-demo": {
    title: "Lobar pneumonia",
    file: "lobar-pneumonia-demo.tsx",
    render: async () => {
      const { Example } = await import("./lobar-pneumonia-demo")
      return <Example />
    },
  },
  "lobar-pneumonia-without-panel": {
    title: "Lobar pneumonia Without Panel",
    file: "lobar-pneumonia-without-panel.tsx",
    render: async () => {
      const { Example } = await import("./lobar-pneumonia-without-panel")
      return <Example />
    },
  },
  "lobar-pneumonia-controlled": {
    title: "Lobar pneumonia Controlled",
    file: "lobar-pneumonia-controlled.tsx",
    render: async () => {
      const { Example } = await import("./lobar-pneumonia-controlled")
      return <Example />
    },
  },
  "melanoma-demo": {
    title: "Melanoma",
    file: "melanoma-demo.tsx",
    render: async () => {
      const { Example } = await import("./melanoma-demo")
      return <Example />
    },
  },
  "melanoma-without-panel": {
    title: "Melanoma Without Panel",
    file: "melanoma-without-panel.tsx",
    render: async () => {
      const { Example } = await import("./melanoma-without-panel")
      return <Example />
    },
  },
  "melanoma-controlled": {
    title: "Melanoma Controlled",
    file: "melanoma-controlled.tsx",
    render: async () => {
      const { Example } = await import("./melanoma-controlled")
      return <Example />
    },
  },
  "myocardial-infarction-demo": {
    title: "Myocardial infarction",
    file: "myocardial-infarction-demo.tsx",
    render: async () => {
      const { Example } = await import("./myocardial-infarction-demo")
      return <Example />
    },
  },
  "myocardial-infarction-without-panel": {
    title: "Myocardial infarction Without Panel",
    file: "myocardial-infarction-without-panel.tsx",
    render: async () => {
      const { Example } = await import("./myocardial-infarction-without-panel")
      return <Example />
    },
  },
  "myocardial-infarction-controlled": {
    title: "Myocardial infarction Controlled",
    file: "myocardial-infarction-controlled.tsx",
    render: async () => {
      const { Example } = await import("./myocardial-infarction-controlled")
      return <Example />
    },
  },
  "peptic-ulcer-disease-demo": {
    title: "Peptic ulcer disease",
    file: "peptic-ulcer-disease-demo.tsx",
    render: async () => {
      const { Example } = await import("./peptic-ulcer-disease-demo")
      return <Example />
    },
  },
  "peptic-ulcer-disease-without-panel": {
    title: "Peptic ulcer disease Without Panel",
    file: "peptic-ulcer-disease-without-panel.tsx",
    render: async () => {
      const { Example } = await import("./peptic-ulcer-disease-without-panel")
      return <Example />
    },
  },
  "peptic-ulcer-disease-controlled": {
    title: "Peptic ulcer disease Controlled",
    file: "peptic-ulcer-disease-controlled.tsx",
    render: async () => {
      const { Example } = await import("./peptic-ulcer-disease-controlled")
      return <Example />
    },
  },
  "pituitary-adenoma-demo": {
    title: "Pituitary adenoma",
    file: "pituitary-adenoma-demo.tsx",
    render: async () => {
      const { Example } = await import("./pituitary-adenoma-demo")
      return <Example />
    },
  },
  "pituitary-adenoma-without-panel": {
    title: "Pituitary adenoma Without Panel",
    file: "pituitary-adenoma-without-panel.tsx",
    render: async () => {
      const { Example } = await import("./pituitary-adenoma-without-panel")
      return <Example />
    },
  },
  "pituitary-adenoma-controlled": {
    title: "Pituitary adenoma Controlled",
    file: "pituitary-adenoma-controlled.tsx",
    render: async () => {
      const { Example } = await import("./pituitary-adenoma-controlled")
      return <Example />
    },
  },
}
