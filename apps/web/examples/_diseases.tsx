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
  "acl-rupture-demo": {
    title: "ACL rupture",
    file: "acl-rupture-demo.tsx",
    render: async () => {
      const { Example } = await import("./acl-rupture-demo")
      return <Example />
    },
  },
  "acl-rupture-without-panel": {
    title: "ACL rupture Without Panel",
    file: "acl-rupture-without-panel.tsx",
    render: async () => {
      const { Example } = await import("./acl-rupture-without-panel")
      return <Example />
    },
  },
  "acl-rupture-controlled": {
    title: "ACL rupture Controlled",
    file: "acl-rupture-controlled.tsx",
    render: async () => {
      const { Example } = await import("./acl-rupture-controlled")
      return <Example />
    },
  },
}
