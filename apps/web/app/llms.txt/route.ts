import {
  componentGroups,
  componentsIndex,
  guides,
  installationGuides,
  organsPage,
  diseasesPage,
  registryBlocks,
  registryItems,
  utilitiesIndex,
  utilityItems,
  helpersIndex,
  helperItems,
  aiIndex,
  aiItems,
} from "@/lib/registry"
import { site } from "@/lib/site"

export const dynamic = "force-static"

const markdown = (href: string) => new URL(`${href}.md`, site.url).href

const entry = (title: string, href: string, description?: string) =>
  `- [${title}](${markdown(href)})${description ? `: ${description}` : ""}`

// An index of the docs for language models, each page linked as Markdown.
export function GET() {
  const sections = [
    `# ${site.name}`,
    `> ${site.description} Components install as source with the shadcn CLI from the @organui registry at ${site.url}/r.`,
    [
      "## Docs",
      ...[...guides, ...installationGuides, componentsIndex].map((page) =>
        entry(page.title, page.href, page.description)
      ),
    ],
    ...componentGroups.map(({ id, title }) => [
      `## ${title}`,
      ...(id === "organs"
        ? [entry(organsPage.title, organsPage.href, organsPage.description)]
        : []),
      ...(id === "diseases"
        ? [
            entry(
              diseasesPage.title,
              diseasesPage.href,
              diseasesPage.description
            ),
          ]
        : []),
      ...registryItems
        .filter((item) => item.group === id)
        .map((item) => entry(item.title, item.href, item.description)),
    ]),
    [
      `## ${aiIndex.title}`,
      entry(aiIndex.title, aiIndex.href, aiIndex.description),
      ...aiItems.map((item) => entry(item.title, item.href, item.description)),
    ],
    [
      `## ${helpersIndex.title}`,
      entry(helpersIndex.title, helpersIndex.href, helpersIndex.description),
      ...helperItems.map((item) =>
        entry(item.title, item.href, item.description)
      ),
    ],
    [
      `## ${utilitiesIndex.title}`,
      entry(
        utilitiesIndex.title,
        utilitiesIndex.href,
        utilitiesIndex.description
      ),
      ...utilityItems.map((item) =>
        entry(item.title, item.href, item.description)
      ),
    ],
    [
      "## Blocks",
      ...registryBlocks.map(
        (block) =>
          `- [${block.title}](${new URL(block.href, site.url).href})${block.description ? `: ${block.description}` : ""}`
      ),
    ],
  ]
  // Sections are separated by a blank line; a section's lines are not.
  const text = sections
    .map((section) => (Array.isArray(section) ? section.join("\n") : section))
    .join("\n\n")
  return new Response(`${text}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
