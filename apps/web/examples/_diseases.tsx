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
}
