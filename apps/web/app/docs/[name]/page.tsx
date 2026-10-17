import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { OrganExplorer } from "@/components/organ-explorer"
import { organModels } from "@/lib/organ-models"
import {
  codeBlock,
  docsMetadata,
  registryItems,
  registryNamespace,
  shadcn,
} from "@/lib/registry"

type Props = { params: Promise<{ name: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return registryItems
    .filter(({ organ }) => organ)
    .map(({ name }) => ({ name }))
}

function itemFor(name: string) {
  const item = registryItems.find((entry) => entry.organ && entry.name === name)
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
  const organ = name.split("-")
  const pascal = organ.map((word) => word[0]!.toUpperCase() + word.slice(1))
  const component = pascal.join("")
  const exportName = `${organ[0]}${pascal.slice(1).join("")}Model`
  const usage = `"use client"
import { useState } from "react"
import { ${component} } from "@/components/${name}"

export function ${pascal.join("")}Panel() {
  const [selectedId, select] = useState<string | null>(null)
  return <${component} selectedId={selectedId}
    onSelectionChange={select} className="h-[32rem]" />
}`
  const tree = `import { AnatomyTree } from "@/components/ui/anatomy-tree"
import { organAnatomyNodes } from "@/components/organ-viewer"
import { ${exportName} } from "@/components/${name}"

const data = organAnatomyNodes(${exportName})
// <AnatomyTree data={data} selectedId={selectedId} onSelectionChange={select}
//   visibility={visibility} onVisibilityChange={show} />
// <${component} selectedId={selectedId} onSelectionChange={select}
//   visibility={visibility} />`
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Components / Organs
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">{item.title}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          The {model.name.toLowerCase()} from the OrganUI explorer, ready to
          drop into your app: {model.structures.length} selectable structures
          and {model.views.length} named views, built on the{" "}
          <Link href="/docs/organ-viewer" className="underline">
            organ viewer
          </Link>
          .
        </p>
      </header>
      <OrganExplorer key={name} model={model} />
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Install</h2>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Installation command"
          className={codeBlock}
        >
          {item.install}
        </pre>
        <p>
          Or by name, with the OrganUI namespace in <code>components.json</code>
          :{" "}
          <code>
            bunx {shadcn} add @organui/{name}
          </code>
          .
        </p>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Registry namespace configuration"
          className={codeBlock}
        >
          {registryNamespace}
        </pre>
        <p className="text-sm text-muted-foreground">
          This adds <code>organ-viewer.tsx</code> and <code>{name}.tsx</code> to
          your components directory and installs three.js and the shadcn
          components the viewer&apos;s controls use. Installing a second organ
          reuses the same <code>organ-viewer.tsx</code>.
        </p>
        <a className="underline" href={item.json}>
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Usage</h2>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Usage example"
          className={codeBlock}
        >
          {usage}
        </pre>
        <p>
          Pair it with the{" "}
          <Link href="/docs/anatomy-tree" className="underline">
            anatomy tree
          </Link>{" "}
          for the explorer layout behind the Anatomy button above. Both share
          structure IDs, so one piece of state drives selection and visibility
          in each.
        </p>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Anatomy tree pairing"
          className={codeBlock}
        >
          {tree}
        </pre>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Views</h2>
        <p>
          {model.views.map(({ name }) => name).join(", ")}. The viewer opens on{" "}
          {model.defaultView}; call <code>setView</code> on its ref to switch.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Model and licence</h2>
        <p>
          {model.attribution.credit} The component code is MIT, but the model
          keeps its own licence,{" "}
          <a className="underline" href={model.attribution.licenseUrl}>
            {model.attribution.license}
          </a>
          . The viewer shows this credit unless you pass{" "}
          <code>attribution=&#123;false&#125;</code> and credit the model
          elsewhere.
        </p>
        <p>
          The GLB loads from a commit-pinned copy in the explorer repository,
          where its{" "}
          <a className="underline" href={model.attribution.source}>
            provenance and changes
          </a>{" "}
          are documented. To serve it yourself, download it from{" "}
          <a className="break-all underline" href={model.src}>
            {model.src}
          </a>{" "}
          and pass the new URL as <code>src</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          An educational model, not for diagnosis or clinical decisions.
        </p>
      </section>
    </div>
  )
}
