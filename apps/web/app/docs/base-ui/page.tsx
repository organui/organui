import { readFile } from "node:fs/promises"
import { join } from "node:path"
import Link from "next/link"
import { CodeBlockCommand } from "@/components/code-block-command"
import { CodeSnippet } from "@/components/code-snippet"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import {
  docsMetadata,
  registryItems,
  registryNamespace,
  shadcn,
} from "@/lib/registry"
import { site } from "@/lib/site"

export const metadata = docsMetadata(
  "Base UI and Radix",
  "Every item installs on shadcn's Base UI and Radix styles; a few ship a copy for each.",
  "/docs/base-ui"
)

async function files(path: string) {
  const json = JSON.parse(
    await readFile(join(process.cwd(), "public/r", path), "utf8")
  ) as { files: { content: string }[] }
  return json.files.map(({ content }) => content).join("\n")
}

// Items whose Radix build differs from the Base UI one, read from the staged
// registries the site serves.
async function itemsWithRadixCopy() {
  const found = await Promise.all(
    registryItems.map(async (item) =>
      (await files(`${item.name}.json`)) !==
      (await files(`radix/${item.name}.json`))
        ? item
        : null
    )
  )
  return found.filter((item) => item !== null)
}

const components = `{
  "style": "radix-nova"
}`

export default async function Page() {
  const direct = (await itemsWithRadixCopy()).filter(({ model }) => !model)
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href="/docs/base-ui" title="Base UI and Radix">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          Every item installs on shadcn&apos;s Base UI and Radix styles. A few
          ship a copy for each.
        </p>
      </DocsHeader>
      <section className="flex flex-col gap-4">
        <DocsHeading id="how-it-works">How it works</DocsHeading>
        <p>
          OrganUI items don&apos;t ship their own buttons, selects or tooltips.
          They list shadcn&apos;s as registry dependencies, and the CLI installs
          them in your project&apos;s own style, built on Base UI or on Radix.
        </p>
        <p>
          Most items use only components whose API is the same in both. Items
          with toolbars, selects or sheets use API that differs: a tooltip
          trigger is a Base UI <code>render</code> prop or a Radix{" "}
          <code>asChild</code>. The registry ships a Radix copy of those files,
          and the library switch on each component page shows its commands and
          source.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="which-items">Items with a Radix copy</DocsHeading>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          {direct.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className="underline">
                {item.title}
              </Link>
            </li>
          ))}
          <li>
            Every organ, the cell and every block, through the{" "}
            <Link href="/docs/components/organ-viewer" className="underline">
              organ viewer
            </Link>
            .
          </li>
        </ul>
        <p>The others install the same files in both.</p>
      </section>
      <section id="radix" className="flex scroll-m-24 flex-col gap-4">
        <DocsHeading id="radix-projects">Radix projects</DocsHeading>
        <p>
          A project&apos;s library is the <code>style</code> field of{" "}
          <code>components.json</code>: Base UI styles start with{" "}
          <code>base-</code>, Radix styles with <code>radix-</code>.
        </p>
        <CodeSnippet
          label="Radix style in components.json"
          code={components}
          lang="json"
        />
        <p>
          Add OrganUI to the same file with <code>{"{style}"}</code> in its
          address. The CLI fills it in, so it fetches the Radix build of every
          item and of the items it depends on:
        </p>
        <CodeSnippet
          label="Registry namespace configuration"
          code={registryNamespace}
          lang="json"
        />
        <CodeBlockCommand
          label="Install by name"
          command={`bunx ${shadcn} add @organui/heart`}
        />
        <p>
          Without it, <code>@organui</code> resolves through shadcn&apos;s
          directory to the Base UI build, as do <code>{site.url}/r/</code>{" "}
          addresses and the GitHub registry. The Radix build of any item is also
          at <code>{site.url}/r/styles/radix-nova/&lt;name&gt;.json</code>.
        </p>
      </section>
      <DocsPager href="/docs/base-ui" />
    </div>
  )
}
