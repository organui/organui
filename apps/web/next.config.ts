import type { NextConfig } from "next"

// Workspace packages are transpiled automatically by Next.js 16.
const nextConfig: NextConfig = {
  // Registry items load hosted models from organui.com/models on any site.
  async headers() {
    return [
      {
        source: "/models/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ]
  },
}

export default nextConfig
