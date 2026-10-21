import Link from "next/link"
import { BlockViewer } from "@/components/block-viewer"
import { CodeSnippet } from "@/components/code-snippet"
import { PageHeader } from "@/components/page-header"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { blockFiles } from "@/lib/blocks"
import { docsMetadata, registryBlocks } from "@/lib/registry"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

export const metadata = docsMetadata(
  "Blocks",
  "Ready-made layouts, from organ explorers to a patient dashboard, installed as source with the shadcn CLI.",
  "/blocks"
)

export default async function Page() {
  const blocks = await Promise.all(
    registryBlocks.map(async (block) => ({
      ...block,
      sources: await blockFiles(block.name),
    }))
  )
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main id="main" className="flex flex-1 flex-col">
        <PageHeader
          title="Blocks"
          description="Ready-made layouts: organ explorers built on the viewer and anatomy tree, and a patient dashboard of vitals, ECG, labs and medicines. Each installs its page and components as source, yours to change."
        >
          <a
            href="#blocks"
            className={cn(buttonVariants({ size: "sm" }), "h-[35px] px-4")}
          >
            Browse Blocks
          </a>
          <Link
            href="/docs/components"
            className={cn(
              buttonVariants({ size: "sm", variant: "secondary" }),
              "h-[35px] px-4"
            )}
          >
            View Components
          </Link>
        </PageHeader>
        <div
          id="blocks"
          className="mx-auto flex w-full max-w-[1400px] scroll-mt-24 flex-wrap items-center justify-between gap-4 px-4 py-4 lg:px-8"
        >
          <nav
            aria-label="Blocks"
            className="flex flex-wrap items-center gap-1"
          >
            {blocks.map((block) => (
              <a
                key={block.name}
                href={`#${block.name}`}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-muted-foreground hover:text-foreground"
                )}
              >
                {block.title}
              </a>
            ))}
          </nav>
          <p className="text-sm text-muted-foreground">
            Pages install in Next.js. Blocks work in{" "}
            <Link
              href="/docs/base-ui"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Base UI and Radix styles
            </Link>
            .
          </p>
        </div>
        <div className="flex-1 border-t bg-muted/30 py-8 md:py-12">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-12 px-4 md:gap-24 lg:px-8">
            {blocks.map((block) => (
              <BlockViewer
                key={block.name}
                name={block.name}
                title={block.title}
                description={block.description}
                view={block.view}
                frameHeight={block.frameHeight}
                install={block.install}
                uses={block.uses}
                files={block.files.map((file) => ({
                  target: file.installed,
                  source: (
                    <CodeSnippet
                      label={`${file.installed} source`}
                      title={file.installed}
                      code={block.sources.get(file.path) ?? ""}
                      className="h-full rounded-none border-0 dark:bg-transparent"
                      contentClassName="min-h-0 flex-1"
                    />
                  ),
                }))}
              />
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
