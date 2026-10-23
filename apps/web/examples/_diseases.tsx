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
}
