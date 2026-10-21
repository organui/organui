import { ComponentPreview } from "@/components/component-preview"
import { ComponentInstallation } from "@/components/component-installation"
import { CodeSnippet } from "@/components/code-snippet"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { OrganApi } from "@/components/organ-api"
import { OrganExamples } from "@/components/organ-examples"
import { organModels } from "@/lib/organ-models"
import { docsMetadata, registryItems } from "@/lib/registry"
import { site } from "@/lib/site"

type Props = { params: Promise<{ name: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return registryItems
    .filter(({ model }) => model)
    .map(({ name }) => ({ name }))
}

function itemFor(name: string) {
  const item = registryItems.find((entry) => entry.model && entry.name === name)
  const load = organModels[name]
  return item && load ? { item, load } : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params
  const found = itemFor(name)
  if (!found) return {}
  return docsMetadata(
    found.item.title,
    found.item.description ?? "",
    found.item.href
  )
}

export default async function Page({ params }: Props) {
  const { name } = await params
  const found = itemFor(name)
  if (!found) notFound()
  const { item, load } = found
  const model = await load()
  // Models built in this repository load from the site itself (see
  // organ-models.ts); give readers the public address.
  const hosted = model.src.startsWith("/")
  const src = hosted ? new URL(model.src, site.url).href : model.src
  const organ = name.split("-")
  const pascal = organ.map((word) => word[0]!.toUpperCase() + word.slice(1))
  const component = pascal.join("")
  const usage = `import { ${component} } from "@/components/${name}"

export function ${component}Demo() {
  return <${component} />
}`
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href={item.href} title={<>{item.title}</>}>
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          An interactive 3D {model.name.toLowerCase()} with{" "}
          {model.structures.length} selectable structures and{" "}
          {model.views.length} named views.
        </p>
      </DocsHeader>
      <ComponentPreview key={name} name={`${name}-demo`} />
      <section className="flex flex-col gap-4">
        <DocsHeading id="installation">Installation</DocsHeading>
        <ComponentInstallation name={name} command={item.install} />
        <p className="text-sm text-muted-foreground">
          This adds <code>{name}.tsx</code> to your components directory. Its
          dependency,{" "}
          <Link href="/docs/components/organ-viewer" className="underline">
            organ viewer
          </Link>
          , adds <code>organ-viewer.tsx</code>, three.js and the shadcn
          components the viewer&apos;s controls use, in your project&apos;s{" "}
          <Link href="/docs/base-ui" className="underline">
            Base UI or Radix
          </Link>{" "}
          style. Every organ and the cell share that one{" "}
          <code>organ-viewer.tsx</code>.
        </p>
        <a className="underline" href={item.json}>
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="usage">Usage</DocsHeading>
        <CodeSnippet label="Usage example" code={usage} />
        <p>
          Pair it with the{" "}
          <Link href="/docs/components/anatomy-tree" className="underline">
            anatomy tree
          </Link>{" "}
          as shown below. For a complete explorer with a mobile sheet, install
          as the{" "}
          <Link href="/blocks#explorer-01" className="underline">
            Explorer 01 block
          </Link>
          . Both share structure IDs, so one piece of state drives selection and
          visibility in each.
        </p>
      </section>
      <OrganExamples key={`${name}-examples`} name={name} />
      <OrganApi component={component} />
      <section className="flex flex-col gap-4">
        <DocsHeading id="views">Views</DocsHeading>
        <p>
          {model.views.map(({ name }) => name).join(", ")}. The viewer opens on{" "}
          {model.defaultView}; call <code>setView</code> on its ref to switch.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="model-and-licence">Model and licence</DocsHeading>
        <p>
          {model.attribution.credit} The component code is MIT, but the model
          keeps its own licence,{" "}
          <a className="underline" href={model.attribution.licenseUrl}>
            {model.attribution.license}
          </a>
          . The viewer shows this credit; see{" "}
          <Link href="/docs/licences" className="underline">
            Licences
          </Link>{" "}
          before hiding it.
        </p>
        <p>
          {hosted
            ? "The GLB is built in the OrganUI repository and served by organui.com, and its"
            : "The GLB loads from a commit-pinned copy in the explorer repository, where its"}{" "}
          <a className="underline" href={model.attribution.source}>
            provenance and changes
          </a>{" "}
          are documented. To serve it yourself, download it from{" "}
          <a className="break-all underline" href={src}>
            {src}
          </a>{" "}
          and pass the new URL as <code>src</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          An educational model, not for diagnosis or clinical decisions.
        </p>
      </section>
      <DocsPager href={item.href} />
    </div>
  )
}
