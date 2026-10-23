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
