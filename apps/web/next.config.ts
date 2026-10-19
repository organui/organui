import type { NextConfig } from "next"
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { join } from "node:path"

// Read rather than imported: Next.js loads this file as CommonJS or, on
// Node's own TypeScript support, as ESM, and JSON imports differ between them.
const catalog = JSON.parse(
  readFileSync(
    createRequire(join(process.cwd(), "package.json")).resolve(
      "@workspace/registry/registry.json"
    ),
    "utf8"
  )
) as { items: { name: string; type: string }[] }

// Workspace packages are transpiled automatically by Next.js 16.
const nextConfig: NextConfig = {
  // Organ models built in this repository load into installed viewers on
  // other origins, so they need CORS.
  async headers() {
    return [
      {
        source: "/models/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ]
  },
  // Component pages moved from /docs/<name> to /docs/components/<name>.
  // Items installed from v0.3.0 and earlier print the old address after
  // install, so these stay. Each is listed by name because /docs/<slug> is
  // also where the guides live.
  async redirects() {
    return catalog.items
      .filter((item) => item.type !== "registry:block")
      .map((item) => ({
        source: `/docs/${item.name}`,
        destination: `/docs/components/${item.name}`,
        permanent: true,
      }))
  },
}

export default nextConfig
