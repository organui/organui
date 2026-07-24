import type { MetadataRoute } from "next"

import { catalog } from "@/lib/catalog"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: "https://organui.com", lastModified, priority: 1 },
    { url: "https://organui.com/foundations", lastModified, priority: 0.7 },
    ...catalog.map((item) => ({
      url: `https://organui.com/components/${item.slug}`,
      lastModified,
      priority: 0.8,
    })),
  ]
}
