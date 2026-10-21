import type { NextRequest } from "next/server"
import { socialImage } from "@/lib/social-image"

// A docs page's social card, from the title and summary in its metadata.
export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  return socialImage({
    title: params.get("title")?.slice(0, 80) || "OrganUI",
    description: params.get("description")?.slice(0, 160) || undefined,
  })
}
