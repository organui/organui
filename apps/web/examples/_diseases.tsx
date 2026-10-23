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
}
