import type { MetadataRoute } from "next"
import { site } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/docs/anatomy-tree"].map((path) => ({
    url: new URL(path, site.url).href,
  }))
}
