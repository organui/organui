import type { MetadataRoute } from "next"
import { registryItems } from "@/lib/registry"
import { site } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/docs", ...registryItems.map((item) => item.href)].map(
    (path) => ({
      url: new URL(path, site.url).href,
    })
  )
}
