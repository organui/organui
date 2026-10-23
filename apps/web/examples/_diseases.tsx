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
