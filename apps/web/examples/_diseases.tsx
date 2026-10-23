// Named documentation examples for the diseases, on the public components
// consumers install. Imports stay explicit so each page loads only its own.
export const diseaseExamples = {
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
}
