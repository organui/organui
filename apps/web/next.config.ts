import type { NextConfig } from "next"

// Workspace packages are transpiled automatically by Next.js 16.
const nextConfig: NextConfig = {
  // Installed organ components load their GLB from organui.com on any origin.
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
