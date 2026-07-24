import { Suspense } from "react"
import Link from "next/link"

import { ComponentCatalog } from "@/components/component-catalog"
import { catalog } from "@/lib/catalog"
import { PatientStatusBadge } from "@/registry/default/patient-status-badge/patient-status-badge"

const statuses = [
  { status: "active", description: "Currently receiving care or actively enrolled." },
  { status: "inactive", description: "No longer active in the current workflow." },
  { status: "critical", description: "Requires immediate attention according to local policy." },
  { status: "pending", description: "Awaiting review, confirmation, or another action." },
  { status: "unknown", description: "Status has not been supplied or cannot be determined." },
] as const

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-16 px-6 py-12 sm:px-10 lg:py-20">
      <header className="flex flex-col gap-6">
        <p className="font-mono text-sm text-muted-foreground">OrganUI / 001</p>
        <div className="flex max-w-3xl flex-col gap-4">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Interface building blocks for better health products.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            An open shadcn registry for accessible healthcare and life-science
            experiences, designed to be adapted to your clinical context.
          </p>
        </div>
      </header>

      <section className="flex flex-col gap-6" aria-labelledby="component-title">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-sm text-muted-foreground">registry:component</p>
          <h2 id="component-title" className="text-2xl font-semibold">
            Patient Status Badge
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Concise workflow status labels that communicate meaning with text,
            not color alone.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border bg-card text-card-foreground">
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-5">
            {statuses.map(({ status, description }) => (
              <article
                key={status}
                className="flex min-h-40 flex-col justify-between gap-6 bg-card p-5"
              >
                <PatientStatusBadge status={status} />
                <p className="text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>

        <pre className="overflow-x-auto rounded-xl border bg-muted p-4 font-mono text-sm">
          <code>npx shadcn@latest add @organui/patient-status-badge</code>
        </pre>
      </section>

      <section className="flex flex-col gap-8" aria-labelledby="collection-title">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-sm text-muted-foreground">{catalog.length} registry items</p>
          <h2 id="collection-title" className="text-3xl font-semibold tracking-tight">Healthcare and life-science collection</h2>
          <p className="max-w-2xl text-muted-foreground">Browse synthetic previews, installation commands, supported states, and accessibility guidance for every item.</p>
        </div>
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading component catalog...</p>}>
          <ComponentCatalog />
        </Suspense>

      </section>

      <footer className="border-t pt-6 text-sm text-muted-foreground">
        Synthetic examples only. Components do not provide clinical guidance. <Link className="underline underline-offset-4" href="/foundations">Read the foundations.</Link>
      </footer>
    </main>
  )
}
