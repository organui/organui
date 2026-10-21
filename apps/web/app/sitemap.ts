import type { MetadataRoute } from "next"
import {
  chartTypes,
  componentsIndex,
  guides,
  installationGuides,
  organsPage,
  registryItems,
  utilitiesIndex,
  utilityItems,
  helpersIndex,
  helperItems,
  aiIndex,
  aiItems,
} from "@/lib/registry"
import { site } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  // Every page is rendered at build time, so each deploy updates them all.
  const lastModified = new Date()
  return [
    "/",
    ...guides.map((guide) => guide.href),
    ...installationGuides.map((guide) => guide.href),
    componentsIndex.href,
    organsPage.href,
    "/blocks",
    ...chartTypes.map(({ type }) => `/charts/${type}`),
    "/colors",
    "/create",
    ...registryItems.map((item) => item.href),
    aiIndex.href,
    ...aiItems.map((item) => item.href),
    helpersIndex.href,
    ...helperItems.map((item) => item.href),
    utilitiesIndex.href,
    ...utilityItems.map((item) => item.href),
  ].map((path) => ({
    url: new URL(path, site.url).href,
    lastModified,
  }))
}
