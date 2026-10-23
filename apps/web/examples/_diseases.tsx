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
}
