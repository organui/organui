import type { NextConfig } from "next"

// Workspace packages are transpiled automatically by Next.js 16.
const nextConfig: NextConfig = {
  // Organ components installed in other apps load these models cross-origin.
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
