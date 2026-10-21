import { getReleases } from "@/lib/releases"
import { site } from "@/lib/site"

export const revalidate = 86400

const escape = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")

// The changelog as a feed, one item per release.
export async function GET() {
  const changelog = new URL("/docs/changelog", site.url).href
  const items = (await getReleases())
    .map(
      (release) => `    <item>
      <title>${escape(release.name)}</title>
      <link>${changelog}#${escape(release.tag)}</link>
      <guid isPermaLink="false">${escape(release.tag)}</guid>
      <pubDate>${new Date(release.date).toUTCString()}</pubDate>
      <description>${escape(release.html)}</description>
    </item>`
    )
    .join("\n")
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${site.name} changelog</title>
    <link>${changelog}</link>
    <description>${escape(site.description)}</description>
${items}
  </channel>
</rss>
`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } }
  )
}
