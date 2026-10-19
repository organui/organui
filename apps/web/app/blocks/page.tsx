import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { blockFiles } from "@/lib/blocks"
import { codeBlock, docsMetadata, registryBlocks, shadcn } from "@/lib/registry"
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
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-5 py-10 sm:px-10">
        <header className="flex flex-col gap-4">
          <h1 className="text-4xl font-semibold tracking-tight">Blocks</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Ready-made layouts built from the{" "}
            <Link href="/docs/organ-viewer" className="underline">
              organ viewer
            </Link>{" "}
            and the{" "}
            <Link href="/docs/anatomy-tree" className="underline">
              anatomy tree
            </Link>
            . Each block installs its page and components as source, so you can
            swap the organ and change the layout.
          </p>
          <p className="text-sm text-muted-foreground">
            Install by URL as shown, by name with the{" "}
            <Link href="/docs" className="underline">
              OrganUI namespace
            </Link>{" "}
            (<code>bunx {shadcn} add @organui/explorer-01</code>), or from
            GitHub (<code>bunx {shadcn} add organui/organui/explorer-01</code>
            ). Pages install in Next.js; other frameworks get the components.
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
                    {file.item ? (
                      <p>
                        <code>{file.installed}</code>, from{" "}
                        <Link href={`/docs/${file.item}`} className="underline">
                          {file.item}
                        </Link>
                      </p>
                    ) : (
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
                    )}
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
