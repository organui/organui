import Link from "next/link"
import { ComponentPreview } from "@/components/component-preview"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import { aiIndex, aiItems, docsMetadata } from "@/lib/registry"

export const metadata = docsMetadata(
  aiIndex.title,
  aiIndex.description,
  aiIndex.href
)

const principles = [
  {
    title: "Say what made it",
    description:
      "AI disclaimer names the model and time, and changes once a clinician has reviewed the content.",
  },
  {
    title: "Show the sources",
    description:
      "AI note cites a source for each claim and marks the claims without one, so review starts where it's needed.",
  },
  {
    title: "Keep confidence honest",
    description:
      "Differential list shows the model's confidence as confidence, never as a probability of disease.",
  },
  {
    title: "A clinician decides",
    description:
      "Clinician review records who approved, asked for changes or rejected, when, and why.",
  },
]

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href={aiIndex.href} title={aiIndex.title}>
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          The healthcare and life science parts of an AI interface, built on
          shadcn&apos;s components and its{" "}
          <a
            href="https://ui.shadcn.com/docs/ai-elements"
            className="underline"
          >
            AI Elements
          </a>
          . Use shadcn&apos;s for the chat, reasoning and tool calls, and these
          for the clinical record around them.
        </p>
      </DocsHeader>
      <ComponentPreview name="ai-elements-demo" />
      <section className="flex flex-col gap-4">
        <DocsHeading id="patterns">Patterns</DocsHeading>
        <ul className="grid gap-4 sm:grid-cols-2">
          {aiItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex h-full flex-col gap-1 rounded-xl border p-6 text-sm transition-colors outline-none hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <span className="font-medium">{item.title}</span>
                <span className="leading-relaxed text-muted-foreground">
                  {item.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="principles">Principles</DocsHeading>
        <dl className="grid gap-6 sm:grid-cols-2">
          {principles.map((principle) => (
            <div key={principle.title} className="flex flex-col gap-1">
              <dt className="font-medium">{principle.title}</dt>
              <dd className="text-muted-foreground">{principle.description}</dd>
            </div>
          ))}
        </dl>
        <p className="text-sm text-muted-foreground">
          These patterns help a clinician review AI output; they don&apos;t make
          it safe. Whether and how you use AI in care is a clinical, regulatory
          and organisational decision.
        </p>
      </section>
      <DocsPager href={aiIndex.href} />
    </div>
  )
}
