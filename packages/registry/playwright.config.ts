import { defineConfig } from "@playwright/test"
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  retries: 0,
  use: { browserName: "chromium", trace: "retain-on-failure" },
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
      testMatch: "**/anatomy.spec.ts",
      use: {
        baseURL: "http://127.0.0.1:4318",
        viewport: { width: 1280, height: 900 },
      },
    },
    {
      name: "vite-mobile",
      testMatch: "**/anatomy.spec.ts",
      use: {
        baseURL: "http://127.0.0.1:4319",
        viewport: { width: 390, height: 844 },
      },
    },
  ],
  webServer: [
    {
      command: "bun run start --port 4321",
      cwd: "../../apps/web",
      url: "http://127.0.0.1:4321/docs/anatomy-tree",
      reuseExistingServer: false,
    },
    {
      command: "bun run start",
      cwd: "../../.consumers/next",
      url: "http://127.0.0.1:4318",
      reuseExistingServer: false,
    },
    {
      command: "bun run start",
      cwd: "../../.consumers/vite",
      url: "http://127.0.0.1:4319",
      reuseExistingServer: false,
    },
  ],
})
