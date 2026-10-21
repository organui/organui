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
) as { items: { name: string; type: string; categories?: string[] }[] }

// Workspace packages are transpiled automatically by Next.js 16.
const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      // Vercel already sends Strict-Transport-Security. Blocks are framed
      // only by /blocks, on this origin.
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      // Organ models built in this repository load into installed viewers on
      // other origins, so they need CORS.
      {
        source: "/models/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          // Names carry no content hash, so browsers keep a model for an hour
          // rather than revalidating megabytes of GLB on every view.
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      // Every docs page is also served as Markdown at its address plus .md.
      { source: "/docs.md", destination: "/llm" },
      { source: "/docs/:path*.md", destination: "/llm/:path*" },
      // A registry URL with {style} in it gets the build for the project's
      // library: base-nova, base-vega and so on share one, radix-* the other.
      {
        source: "/r/styles/:style(base-[a-z0-9-]+)/:name",
        destination: "/r/:name",
      },
      {
        source: "/r/styles/:style(radix-[a-z0-9-]+)/:name",
        destination: "/r/radix/:name",
      },
    ]
  },
  // Component pages moved from /docs/<name> to /docs/components/<name>.
  // Items installed from v0.3.0 and earlier print the old address after
  // install, so these stay. Each is listed by name because /docs/<slug> is
  // also where the guides live.
  async redirects() {
    return [
      // Only components: AI Elements, helpers and utilities were never there.
      ...catalog.items
        .filter(
          (item) =>
            item.type !== "registry:block" &&
            !["ai", "helper", "utility"].some((category) =>
              item.categories?.includes(category)
            )
        )
        .map((item) => ({
          source: `/docs/${item.name}`,
          destination: `/docs/components/${item.name}`,
          permanent: true,
        })),
      // Charts open on their first type, as on shadcn/ui.
      { source: "/charts", destination: "/charts/area", permanent: false },
      // Themes live in Create, as on shadcn/ui.
      { source: "/themes", destination: "/create", permanent: true },
      // The organs gallery's first address.
      {
        source: "/organs",
        destination: "/docs/components/organs",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
