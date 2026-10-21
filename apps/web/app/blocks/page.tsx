import Link from "next/link"
import { BlockViewer } from "@/components/block-viewer"
import { CodeSnippet } from "@/components/code-snippet"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { blockFiles } from "@/lib/blocks"
import { docsMetadata, registryBlocks } from "@/lib/registry"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

export const metadata = docsMetadata(
  "Blocks",
  "Ready-made anatomy layouts that compose the organ viewer and anatomy tree, installed as source with the shadcn CLI.",
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
        <header className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-6 py-12 text-center md:py-16 lg:py-20 xl:gap-4">
          <h1 className="text-4xl leading-tight font-semibold tracking-tight text-balance text-primary lg:leading-[1.1] xl:text-5xl xl:tracking-tighter">
            Blocks
          </h1>
          <p className="max-w-2xl text-base text-balance text-muted-foreground sm:text-lg">
            Ready-made anatomy layouts built from the organ viewer and the
            anatomy tree. Each installs its page and components as source, so
            you can swap the organ and change the layout.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
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
          </div>
        </header>
        <div
          id="blocks"
          className="mx-auto flex w-full max-w-7xl scroll-mt-24 flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6"
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
            Pages install in Next.js. Blocks need{" "}
            <Link
              href="/docs/base-ui"
              className="font-medium text-foreground underline underline-offset-4"
            >
              a Base UI style
            </Link>
            .
          </p>
        </div>
        <div className="flex-1 border-t bg-muted/30 py-8 md:py-12">
          <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 md:gap-24">
            {blocks.map((block) => (
              <BlockViewer
                key={block.name}
                name={block.name}
                title={block.title}
                description={block.description}
                view={block.view}
                install={block.install}
                uses={block.uses}
                files={block.files.map((file) => ({
                  target: file.installed,
                  source: (
                    <CodeSnippet
                      label={`${file.installed} source`}
                      code={block.sources.get(file.path) ?? ""}
                      className="h-full rounded-none border-0 dark:bg-transparent"
                      contentClassName="h-full"
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
