import { readFile } from "node:fs/promises"
import { CodeSnippet } from "@/components/code-snippet"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { join } from "node:path"
import Link from "next/link"
import { DocsPager } from "@/components/docs-pager"
import { docsMetadata, registryItems } from "@/lib/registry"

export const metadata = docsMetadata(
  "Base UI",
  "Why items with controls need one of shadcn's Base UI styles, and how to tell.",
  "/docs/base-ui"
)

// Items whose shipped source composes shadcn components through Base UI's
// render prop, read from the staged registry the site serves. The registry
// tests require each of them to say so after install.
async function itemsUsingRender() {
  const found = await Promise.all(
    registryItems.map(async (item) => {
      const json = JSON.parse(
        await readFile(
          join(process.cwd(), "public/r", `${item.name}.json`),
          "utf8"
        )
      ) as { files: { content: string }[] }
      return json.files.some(({ content }) => content.includes("render={"))
        ? item
        : null
    })
  )
  return found.filter((item) => item !== null)
}

const components = `{
  "style": "base-nova"
}`

export default async function Page() {
  const direct = (await itemsUsingRender()).filter(({ model }) => !model)
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href="/docs/base-ui" title="Base UI">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          Items with controls need one of shadcn&apos;s Base UI styles, such as{" "}
          <code>base-nova</code>.
        </p>
      </DocsHeader>
      <section className="flex flex-col gap-4">
        <DocsHeading id="why">Why</DocsHeading>
        <p>
          OrganUI items don&apos;t ship their own buttons, selects or tooltips.
          They list shadcn&apos;s as registry dependencies, and the CLI installs
          them in your project&apos;s own style. Items with toolbars compose
          those components with Base UI&apos;s <code>render</code> prop, for
          example a tooltip trigger rendered as a button.
        </p>
        <p>
          shadcn&apos;s Radix styles install Radix versions of the same
          components, which take <code>asChild</code> instead and ignore{" "}
          <code>render</code>. The item still installs and renders, but its
          buttons do nothing.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="which-items">Which items</DocsHeading>
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
        <p>
          The others work in any shadcn style. Each item that needs Base UI also
          says so in the message the CLI prints after installing it.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="check-your-style">Check your style</DocsHeading>
        <p>
          The style is the <code>style</code> field of{" "}
          <code>components.json</code>. Base UI styles start with{" "}
          <code>base-</code>:
        </p>
        <CodeSnippet
          label="Base UI style in components.json"
          code={components}
          lang="json"
        />
        <p>
          On a Radix style, either use a Base UI style for the project, as in{" "}
          <Link href="/docs/installation#requirements" className="underline">
            Installation
          </Link>
          , or change the installed item&apos;s triggers to <code>asChild</code>
          , since the source is yours.
        </p>
      </section>
      <DocsPager href="/docs/base-ui" />
    </div>
  )
}
