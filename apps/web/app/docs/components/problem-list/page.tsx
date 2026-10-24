import { ComponentPreview } from "@/components/component-preview"
import { ComponentInstallation } from "@/components/component-installation"
import { CodeSnippet } from "@/components/code-snippet"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import { PropsTable } from "@/components/props-table"
import { ComponentExamples } from "@/components/component-examples"
import { componentExamples } from "@/lib/component-examples"
import Link from "next/link"
import { docsMetadata, shadcn } from "@/lib/registry"
import { site } from "@/lib/site"

export const metadata = docsMetadata(
  "Problem list",
  "A problem list for healthcare interfaces: a patient's conditions, active and past, with coded terms and onset and resolution dates.",
  "/docs/components/problem-list"
)

const usage = `import { ProblemList, type Problem } from "@/components/ui/problem-list"

const problems: Problem[] = [
  {
    id: "diabetes",
    name: "Type 2 diabetes mellitus",
    code: { system: "SNOMED CT", value: "44054006" },
    significance: "major",
    onset: "2012-03-06",
  },
  {
    id: "pneumonia",
    name: "Community acquired pneumonia",
    status: "resolved",
    onset: "2024-01-08",
    resolved: "2024-02-01",
  },
]

export function Problems() {
  return <ProblemList problems={problems} caption="Problems" />
}`

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href="/docs/components/problem-list" title="Problem list">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          A patient&apos;s conditions as a record keeps them: the active ones
          first, the past ones below, each with its coded term and when it began
          and ended.
        </p>
      </DocsHeader>
      <ComponentPreview name="problem-list-demo" />
      <section className="flex flex-col gap-4">
        <DocsHeading id="installation">Installation</DocsHeading>
        <p>
          In a project set up as in{" "}
          <Link href="/docs/installation" className="underline">
            Installation
          </Link>
          , run:
        </p>
        <ComponentInstallation
          name="problem-list"
          command={`bunx ${shadcn} add ${site.url}/r/problem-list.json`}
        />
        <p>
          Or by name: <code>bunx {shadcn} add @organui/problem-list</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          The source installs into your UI components directory, along with
          shadcn&apos;s <code>table</code> if you do not have it yet. It holds
          no state, so it renders in server and client components alike.
        </p>
        <a className="underline" href="/r/problem-list.json">
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="usage">Usage</DocsHeading>
        <CodeSnippet label="Usage example" code={usage} />
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="active-and-past">Active and past</DocsHeading>
        <p>
          Problems group under Active and Past, each group a labelled set of
          rows, with its count. A <code>resolved</code> or <code>inactive</code>{" "}
          problem goes under Past, muted. Within each group, <code>major</code>{" "}
          problems lead and are bold, as general practice records mark the
          conditions that shape care; <code>groupProblems</code> gives the same
          order for a view of your own.
        </p>
        <p>
          A <code>code</code> shows under the name with its system, such as{" "}
          <code>SNOMED CT 44054006</code>, so the term can be traced to the
          record. Set <code>showCodes={"{false}"}</code> for a summary.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="dates">Dates</DocsHeading>
        <p>
          An active problem shows when it began, and a past one when it began
          and ended. Full ISO 8601 dates show as UTC dates in US English; pass{" "}
          <code>formatDate</code> for your own. Records often hold less than a
          date, such as a year or &quot;Childhood&quot;, so any other text reads
          as written rather than as a guessed day.
        </p>
        <p className="text-sm text-muted-foreground">
          A display component: it does not choose, code or reconcile problems.
          The examples are fictional.
        </p>
      </section>
      <ComponentExamples examples={componentExamples["problem-list"]!} />
      <PropsTable item="problem-list" />
      <DocsPager href="/docs/components/problem-list" />
    </div>
  )
}
