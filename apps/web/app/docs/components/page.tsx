import Link from "next/link"
import { ComponentPreview } from "@/components/component-preview"
import { DocsPager } from "@/components/docs-pager"
import {
  codeBlock,
  componentGroups,
  componentsIndex,
  docsMetadata,
  organs,
  organsPage,
  registryItems,
} from "@/lib/registry"

export const metadata = docsMetadata(
  componentsIndex.title,
  "Editable healthcare interface components distributed through a shadcn registry.",
  componentsIndex.href
)

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight">Components</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {registryItems.length} components, each installed as source with the
          shadcn CLI. Previews load when you open them, so the page stays light.
          Set up a project first in{" "}
          <Link href="/docs/installation" className="underline">
            Installation
          </Link>
          ; for whole layouts, see the{" "}
          <Link href="/blocks" className="underline">
            blocks
          </Link>
          .
        </p>
      </header>
      {componentGroups.map((group) => (
        <section
          key={group.id}
          aria-labelledby={group.id}
          className="flex scroll-mt-20 flex-col gap-4"
        >
          <h2 id={group.id} className="scroll-mt-20 text-2xl font-semibold">
            {group.title}
          </h2>
          <ul className="grid gap-4">
            {registryItems
              .filter((item) => item.group === group.id && !item.organ)
              .map((item) => (
                <li
                  key={item.name}
                  className="flex min-w-0 flex-col gap-3 rounded-xl border p-5"
                >
                  <h3 className="text-lg font-semibold">
                    <Link
                      href={item.href}
                      className="underline-offset-4 hover:underline"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                  {/* The card already frames the preview, so the example
                      renders without its own border and padding. */}
                  <ComponentPreview
                    name={`${item.name}-demo`}
                    hideCode
                    defer="click"
                    aria-label={`${item.title} preview`}
                    className="rounded-none border-0"
                    previewClassName="h-auto p-0 sm:p-0 *:w-full *:min-w-0"
                  />
                  <pre
                    tabIndex={0}
                    role="region"
                    aria-label={`Install ${item.title}`}
                    className={codeBlock}
                  >
                    {item.install}
                  </pre>
                  <a className="text-sm underline" href={item.json}>
                    {item.name}.json
                  </a>
                </li>
              ))}
            {group.id === "organs" && (
              <li className="flex min-w-0 flex-col gap-3 rounded-xl border p-5">
                <h3 className="text-lg font-semibold">
                  <Link
                    href={organsPage.href}
                    className="underline-offset-4 hover:underline"
                  >
                    All {organs.length} organs
                  </Link>
                </h3>
                <p className="text-muted-foreground">
                  Every organ built on the organ viewer, from the brain to the
                  nails, in the organs gallery.
                </p>
              </li>
            )}
          </ul>
        </section>
      ))}
      <p className="text-sm text-muted-foreground">
        The full catalog is served at{" "}
        <a className="underline" href="/r/registry.json">
          /r/registry.json
        </a>
        .
      </p>
      <DocsPager href={componentsIndex.href} />
    </div>
  )
}
