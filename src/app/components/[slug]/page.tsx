import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ComponentPreview } from "@/components/component-preview"
import { catalog, getCatalogItem } from "@/lib/catalog"
import { componentApi } from "@/lib/component-api"

export function generateStaticParams() {
  return catalog.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const item = getCatalogItem((await params).slug)
  if (!item) return {}

  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: `/components/${item.slug}` },
    openGraph: { title: `${item.title} · OrganUI`, description: item.description },
  }
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const item = getCatalogItem((await params).slug)
  if (!item) notFound()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-12 px-6 py-12 sm:px-10 lg:py-20">
      <nav aria-label="Breadcrumb">
        <Link className="text-sm text-muted-foreground underline-offset-4 hover:underline" href="/">← All components</Link>
      </nav>
      <header className="flex max-w-3xl flex-col gap-4">
        <p className="font-mono text-sm text-muted-foreground">{item.category}</p>
        <h1 className="text-4xl font-semibold tracking-tight">{item.title}</h1>
        <p className="text-lg leading-8 text-muted-foreground">{item.description}</p>
      </header>

      <section className="flex flex-col gap-4" aria-labelledby="preview-title">
        <h2 id="preview-title" className="text-2xl font-semibold">Preview</h2>
        <div className="flex min-h-80 items-center justify-center rounded-xl border bg-background p-6">
          <ComponentPreview slug={item.slug} />
        </div>
        <div className="dark flex min-h-80 items-center justify-center rounded-xl border bg-background p-6 text-foreground">
          <span className="sr-only">Dark theme preview</span>
          <ComponentPreview slug={item.slug} />
        </div>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="install-title">
        <h2 id="install-title" className="text-2xl font-semibold">Install</h2>
        <pre className="overflow-x-auto rounded-xl border bg-muted p-4 font-mono text-sm">
          <code>{`npx shadcn@latest add @organui/${item.slug}`}</code>
        </pre>
        <p className="text-sm text-muted-foreground">
          Register the namespace once with <code className="rounded bg-muted px-1 py-0.5">npx shadcn@latest registry add @organui=https://organui.com/r/{"{name}"}.json</code>.
        </p>
      </section>

      <section className="grid gap-8 border-t pt-8 sm:grid-cols-3">
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">API</h2>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            {componentApi[item.slug].map((prop) => <li key={prop}><code>{prop}</code></li>)}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Supported states</h2>
          <ul className="flex flex-wrap gap-2">
            {item.states.map((state) => <li key={state} className="rounded-full border px-2.5 py-1 font-mono text-xs">{state}</li>)}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Accessibility & safety</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Visible labels carry meaning independently of color. Validate wording,
            thresholds, focus behavior, and clinical policy in your product context.
          </p>
        </div>
      </section>
    </main>
  )
}
