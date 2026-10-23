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
  "hodgkin-lymphoma-demo": {
    title: "Hodgkin lymphoma",
    file: "hodgkin-lymphoma-demo.tsx",
    render: async () => {
      const { Example } = await import("./hodgkin-lymphoma-demo")
      return <Example />
    },
  },
  "hodgkin-lymphoma-without-panel": {
    title: "Hodgkin lymphoma Without Panel",
    file: "hodgkin-lymphoma-without-panel.tsx",
    render: async () => {
      const { Example } = await import("./hodgkin-lymphoma-without-panel")
      return <Example />
    },
  },
  "hodgkin-lymphoma-controlled": {
    title: "Hodgkin lymphoma Controlled",
    file: "hodgkin-lymphoma-controlled.tsx",
    render: async () => {
      const { Example } = await import("./hodgkin-lymphoma-controlled")
      return <Example />
    },
  },
}
