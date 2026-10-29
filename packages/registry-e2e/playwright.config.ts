import { defineConfig } from "@playwright/test"
import { fileURLToPath } from "node:url"
const web = fileURLToPath(new URL(".", import.meta.resolve("web/package.json")))
// CI runs one suite per job (docs, next, vite or radix): its projects and the
// one server they visit. Unset, everything runs. BROWSER_SHARD ("1/3") splits
// a suite further.
const suite = process.env.BROWSER_SUITE
const inSuite = (name: string) => !suite || name === suite
const [current, total] = (process.env.BROWSER_SHARD ?? "")
  .split("/")
  .map(Number)
const items =
  "**/{anatomy,organ,block,body-map,dermatome,ecg,growth,image,lab,medication,molecule,vitals}.spec.ts"
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  retries: 0,
  shard: current && total ? { current, total } : null,
  // Each worker renders WebGL in software. CI runs the suite in parallel;
  // locally one worker keeps a laptop usable (see AGENTS.md).
  workers: process.env.CI ? undefined : 1,
  use: {
    browserName: "chromium",
    trace: "retain-on-failure",
    // Headless Chromium only offers WebGL through SwiftShader when asked.
    launchOptions: { args: ["--enable-unsafe-swiftshader"] },
  },
  projects: [
    {
      name: "docs-desktop",
      testMatch: "**/docs.spec.ts",
      use: {
        baseURL: "http://127.0.0.1:4321",
        viewport: { width: 1280, height: 900 },
      },
    },
    {
      name: "docs-mobile",
      testMatch: "**/docs.spec.ts",
      use: {
        baseURL: "http://127.0.0.1:4321",
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: "next-desktop",
      testMatch: items,
      use: {
        baseURL: "http://127.0.0.1:4318",
        viewport: { width: 1280, height: 900 },
      },
    },
    {
      name: "vite-mobile",
      testMatch: items,
      use: {
        baseURL: "http://127.0.0.1:4319",
        viewport: { width: 390, height: 844 },
      },
    },
    // The items with a Radix copy, installed on a Radix style.
    {
      name: "radix-desktop",
      testMatch: "**/{anatomy,organ,block,image,molecule}.spec.ts",
      use: {
        baseURL: "http://127.0.0.1:4320",
        viewport: { width: 1280, height: 900 },
      },
    },
  ].filter(({ name }) => inSuite(name.replace(/-.*/, ""))),
  webServer: Object.entries({
    docs: {
      command: "bun run start --port 4321",
      cwd: web,
      url: "http://127.0.0.1:4321/docs/anatomy-tree",
    },
    next: {
      command: "bun run start",
      cwd: ".consumers/next",
      url: "http://127.0.0.1:4318",
    },
    vite: {
      command: "bun run start",
      cwd: ".consumers/vite",
      url: "http://127.0.0.1:4319",
    },
    radix: {
      command: "bun run start",
      cwd: ".consumers/radix",
      url: "http://127.0.0.1:4320",
    },
  })
    .filter(([name]) => inSuite(name))
    .map(([, server]) => ({ ...server, reuseExistingServer: false })),
})
