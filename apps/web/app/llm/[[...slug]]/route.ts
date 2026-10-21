import { parseHTML } from "linkedom"
import type { NextRequest } from "next/server"
import { pageMarkdown } from "@/lib/page-markdown"
import { pageOrder } from "@/lib/registry"
import { site } from "@/lib/site"

// /docs/<page>.md, rewritten here by next.config.ts: the page's Markdown,
// read from its rendered HTML with the same code as Copy Page.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug = [] } = await params
  const path = ["/docs", ...slug].join("/")
  if (!pageOrder.some(({ href }) => href === path))
    return new Response("Not found", { status: 404 })
  const response = await fetch(new URL(path, request.nextUrl.origin), {
    next: { revalidate: 3600 },
  })
  if (!response.ok)
    return new Response("The page could not be read", { status: 502 })
  const { document } = parseHTML(await response.text())
  const content = document.querySelector("[data-docs-content]")
  if (!content)
    return new Response("The page could not be read", { status: 502 })
  return new Response(pageMarkdown(content, new URL(path, site.url).href), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
