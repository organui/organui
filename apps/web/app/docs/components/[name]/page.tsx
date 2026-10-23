import * as React from "react"
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
  // A disease is drawn on the models of its organs or tissues, one per
  // scale, which install with it.
  const bases = item.bases.flatMap(
    (base) => registryItems.find(({ name }) => name === base) ?? []
  )
  const baseLinks = bases.map((base, index) => (
    <React.Fragment key={base.name}>
      {index > 0 && (index === bases.length - 1 ? " and " : ", ")}
      <Link href={base.href} className="underline">
        {base.title.toLowerCase()}
      </Link>
    </React.Fragment>
  ))
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
          {bases.length > 0 ? (
            <>
              {model.name} in 3D on the {baseLinks}. Each structure is grouped
              as affected or spared and says what the disease does there.
            </>
          ) : (
            <>
              An interactive 3D {model.name.toLowerCase()} with{" "}
              {model.structures.length} selectable structures and{" "}
              {model.views.length} named views.
            </>
          )}
        </p>
      </DocsHeader>
      <ComponentPreview key={name} name={`${name}-demo`} />
      <section className="flex flex-col gap-4">
        <DocsHeading id="installation">Installation</DocsHeading>
        <ComponentInstallation name={name} command={item.install} />
        <p className="text-sm text-muted-foreground">
          This adds <code>{name}.tsx</code> to your components directory.{" "}
          {bases.length > 0 && (
            <>
              It imports its models from the {baseLinks}, which add{" "}
              {bases.map((base, index) => (
                <React.Fragment key={base.name}>
                  {index > 0 && " and "}
                  <code>{base.name}.tsx</code>
                </React.Fragment>
              ))}
              .{" "}
            </>
          )}
          Its dependency,{" "}
          <Link href="/docs/components/organ-viewer" className="underline">
            organ viewer
          </Link>
          , adds <code>organ-viewer.tsx</code>, three.js and the shadcn
          components the viewer&apos;s controls use, in your project&apos;s{" "}
          <Link href="/docs/base-ui" className="underline">
            Base UI or Radix
          </Link>{" "}
          style. Every organ, tissue, disease and the cell share that one{" "}
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
      {bases.length > 1 && (
        <section className="flex min-w-0 flex-col gap-4">
          <DocsHeading id="scales">Scales</DocsHeading>
          <p className="text-sm text-muted-foreground">
            Set <code>scale</code> to{" "}
            {bases.map((base, index) => (
              <React.Fragment key={base.name}>
                {index > 0 && (index === bases.length - 1 ? " or " : ", ")}
                <code>&quot;{base.name}&quot;</code>
              </React.Fragment>
            ))}{" "}
            to show the disease on that model. Each scale keeps its model&apos;s
            structure IDs, so reset selection when you switch.
          </p>
          <ComponentPreview name={`${name}-scales`} />
        </section>
      )}
      <OrganExamples key={`${name}-examples`} name={name} />
      <OrganApi
        component={component}
        extra={
          bases.length > 1
            ? {
                scale: {
                  type: bases.map((base) => `"${base.name}"`).join(" | "),
                  default: `"${bases[0]!.name}"`,
                  description: "Choose the model the disease is shown on.",
                },
              }
            : undefined
        }
      />
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
