// Named documentation examples for the diseases, on the public components
// consumers install. Imports stay explicit so each page loads only its own.
export const diseaseExamples = {
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
}
