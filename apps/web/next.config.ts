import type { NextConfig } from "next"

// Workspace packages are transpiled automatically by Next.js 16.
const nextConfig: NextConfig = {
  // Installed organ components fetch hosted models from other origins.
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
