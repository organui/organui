import { ComponentPreview } from "@/components/component-preview"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { OrganApi } from "@/components/organ-api"
import { OrganExamples } from "@/components/organ-examples"
import { organModels } from "@/lib/organ-models"
import {
  codeBlock,
  docsMetadata,
  registryItems,
  registryNamespace,
} from "@/lib/registry"
import { site } from "@/lib/site"

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
      <header className="flex flex-col gap-4">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Components / Organs
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">{item.title}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          An interactive 3D {model.name.toLowerCase()} with{" "}
          {model.structures.length} selectable structures and{" "}
          {model.views.length} named views.
        </p>
      </header>
      <ComponentPreview key={name} name={`${name}-demo`} />
      <section className="flex flex-col gap-4">
        <h2 id="installation" className="text-2xl font-semibold">
          Installation
        </h2>
        <p>
          Organs depend on the shared organ viewer, which installs through the
          OrganUI namespace. Add it to <code>components.json</code>:
        </p>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Registry namespace configuration"
          className={codeBlock}
        >
          {registryNamespace}
        </pre>
        <p>Then run:</p>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Installation command"
          className={codeBlock}
        >
          {item.install}
        </pre>
        <p className="text-sm text-muted-foreground">
          This adds <code>{name}.tsx</code> to your components directory. Its
          dependency,{" "}
          <Link href="/docs/organ-viewer" className="underline">
            organ viewer
          </Link>
          , adds <code>organ-viewer.tsx</code>, three.js and the shadcn
          components the viewer&apos;s controls use, which need one of
          shadcn&apos;s Base UI styles. Every organ shares that one{" "}
          <code>organ-viewer.tsx</code>.
        </p>
        <a className="underline" href={item.json}>
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="usage" className="text-2xl font-semibold">
          Usage
        </h2>
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
    </div>
  )
}
