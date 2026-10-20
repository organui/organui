import type { MetadataRoute } from "next"
import {
  componentsIndex,
  guides,
  organsPage,
  registryItems,
} from "@/lib/registry"
import { site } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  // Every page is rendered at build time, so each deploy updates them all.
  const lastModified = new Date()
  return [
    "/",
    ...guides.map((guide) => guide.href),
    componentsIndex.href,
    organsPage.href,
    "/blocks",
    ...registryItems.map((item) => item.href),
  ].map((path) => ({
    url: new URL(path, site.url).href,
    lastModified,
  }))
}
