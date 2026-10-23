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
}
