import Link from "next/link"

const sections = [
  { title: "Semantic status", body: "Use visible, plain-language labels for every state. Color and icons may reinforce meaning but never carry it alone. Products define and validate their own thresholds." },
  { title: "Typography and data", body: "Prioritize readable labels and tabular numerals for measurements. Keep units adjacent to values, preserve long identifiers, and support 200% zoom without loss of content." },
  { title: "Spacing and composition", body: "Use shadcn semantic tokens and composable primitives. Keep related clinical context together, expose empty and unavailable states, and avoid dense layouts that obscure hierarchy." },
  { title: "Focus and interaction", body: "Preserve visible focus, logical keyboard order, and appropriate native semantics. Interactive behavior must remain usable without a pointer and must not rely on hover alone." },
  { title: "Safety and privacy", body: "Use synthetic examples. Components are presentational and do not provide diagnosis, urgency, treatment, authorization, auditing, retention, or clinical validation." },
]

export default function FoundationsPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-12 px-6 py-12 sm:px-10 lg:py-20">
      <Link className="text-sm text-muted-foreground underline-offset-4 hover:underline" href="/">← OrganUI</Link>
      <header className="flex max-w-3xl flex-col gap-4">
        <p className="font-mono text-sm text-muted-foreground">Design foundations</p>
        <h1 className="text-4xl font-semibold tracking-tight">Clear by default. Safe by context.</h1>
        <p className="text-lg leading-8 text-muted-foreground">
          Shared principles for accessible healthcare and life-science interfaces.
          They support product decisions; they do not replace local clinical, regulatory,
          privacy, or safety review.
        </p>
      </header>
      <div className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2">
        {sections.map((section) => (
          <section key={section.title} className="flex flex-col gap-3 bg-card p-6">
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="text-sm leading-6 text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  )
}
