import type { NextConfig } from "next"

// Workspace packages are transpiled automatically by Next.js 16.
const nextConfig: NextConfig = {
  // Organ models hosted here load from other origins once installed.
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
