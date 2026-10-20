import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { blockFiles } from "@/lib/blocks"
import { codeBlock, docsMetadata, registryBlocks } from "@/lib/registry"
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
    <div className="min-h-svh">
      <SiteHeader />
      <main
        id="main"
        className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-10 sm:px-6"
      >
        <header className="flex flex-col gap-4">
          <h1 className="text-4xl font-semibold tracking-tight">Blocks</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Ready-made layouts built from the{" "}
            <Link href="/docs/components/organ-viewer" className="underline">
              organ viewer
            </Link>{" "}
            and the{" "}
            <Link href="/docs/components/anatomy-tree" className="underline">
              anatomy tree
            </Link>
            . Each block installs its page and components as source, so you can
            swap the organ and change the layout.
          </p>
          <p className="text-sm text-muted-foreground">
            Blocks install the OrganUI components they use as dependencies.
            Pages install in Next.js; other frameworks get the components. Like
            the organ viewer, blocks need{" "}
            <Link href="/docs/base-ui" className="underline">
              one of shadcn&apos;s Base UI styles
            </Link>
            .
          </p>
        </header>
        {blocks.map((block) => (
          <section
            key={block.name}
            id={block.name}
            aria-labelledby={`${block.name}-title`}
            className="flex scroll-mt-20 flex-col gap-4"
          >
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <div className="flex flex-col gap-1">
                <h2
                  id={`${block.name}-title`}
                  className="text-2xl font-semibold"
                >
                  {block.title}
                </h2>
                <p className="max-w-2xl text-muted-foreground">
                  {block.description}
                </p>
              </div>
              <div className="flex gap-4 text-sm">
                <a
                  className="underline"
                  href={block.view}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in a new tab
                </a>
                <a className="underline" href={block.json}>
                  {block.name}.json
                </a>
              </div>
            </div>
            <iframe
              src={block.view}
              title={`${block.title} preview`}
              loading="lazy"
              className="h-[44rem] w-full rounded-xl border bg-background"
            />
            <pre
              tabIndex={0}
              role="region"
              aria-label={`Install ${block.title}`}
              className={codeBlock}
            >
              {block.install}
            </pre>
            <div className="flex flex-col gap-2">
              <p className="font-medium">Files</p>
              <ul className="flex flex-col gap-2 text-sm">
                {block.files.map((file) => (
                  <li key={file.path}>
                    <details className="group">
                      <summary className="cursor-pointer rounded-md focus-visible:outline-2 focus-visible:outline-ring">
                        <code>{file.installed}</code>
                      </summary>
                      <pre
                        tabIndex={0}
                        role="region"
                        aria-label={`${file.installed} source`}
                        className={cn(codeBlock, "mt-2 max-h-[32rem]")}
                      >
                        {block.sources.get(file.path)}
                      </pre>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-medium">Uses</p>
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {block.uses.map((name) => (
                  <li key={name}>
                    <Link
                      href={`/docs/components/${name}`}
                      className="underline"
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
