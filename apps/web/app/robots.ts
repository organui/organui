import type { MetadataRoute } from "next"
import { isProduction, site } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return isProduction
    ? {
        rules: { userAgent: "*", allow: "/" },
        sitemap: `${site.url}/sitemap.xml`,
      }
    : { rules: { userAgent: "*", disallow: "/" } }
}
