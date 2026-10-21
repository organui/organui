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
  "Lab results table",
  "A lab results table for healthcare interfaces that flags values against reference ranges with text and icons, and shows a trend sparkline.",
  "/docs/components/lab-results"
)

const usage = `import { LabResultsTable, type LabResult } from "@/components/ui/lab-results"

const results: LabResult[] = [
  {
    id: "glucose",
    name: "Glucose, fasting",
    value: 118,
    unit: "mg/dL",
    date: "2026-10-01",
    referenceRange: { low: 70, high: 99, criticalLow: 40, criticalHigh: 400 },
    history: [
      { value: 92, date: "2025-10-06" },
      { value: 104, date: "2026-05-18" },
      { value: 118, date: "2026-10-01" },
    ],
  },
  {
    id: "urine-protein",
    name: "Urine protein",
    value: "Negative",
    flag: "normal",
    referenceRange: { text: "Negative" },
  },
]

export function Results() {
  return <LabResultsTable results={results} caption="Basic metabolic panel" />
}`

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href="/docs/components/lab-results" title="Lab results table">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          Lab values flagged against the reference ranges you pass, with a
          sparkline of earlier results. Flags read as text and an icon, so they
          never depend on color alone.
        </p>
      </DocsHeader>
      <ComponentPreview name="lab-results-demo" />
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
          name="lab-results"
          command={`bunx ${shadcn} add ${site.url}/r/lab-results.json`}
        />
        <p>
          Or by name: <code>bunx {shadcn} add @organui/lab-results</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          The source installs into your UI components directory, along with
          shadcn&apos;s <code>table</code> if you do not have it yet. It holds
          no state and uses no hooks, so it renders in server and client
          components alike.
        </p>
        <a className="underline" href="/r/lab-results.json">
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="usage">Usage</DocsHeading>
        <CodeSnippet label="Usage example" code={usage} />
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="reference-ranges-and-flags">
          Reference ranges and flags
        </DocsHeading>
        <p>
          Ranges are data, not built in, because they vary by laboratory, age,
          sex and method. Pass <code>low</code> and <code>high</code> as the
          inclusive limits of normal, either one alone for a one-sided range,
          and <code>criticalLow</code> or <code>criticalHigh</code> for values
          outside which a result is critical. Critical limits are checked first.
          A numeric value with no limits is shown as not flagged.
        </p>
        <p>
          Text results, such as <code>&quot;Negative&quot;</code>, are never
          compared with a range. Set <code>referenceRange.text</code> to print
          the expected result, and <code>flag</code> to show the flag the
          laboratory reported. A <code>flag</code> you pass always wins over the
          computed one. The <code>labFlag</code> and{" "}
          <code>formatReferenceRange</code> helpers are exported for use
          elsewhere, such as a summary of abnormal results.
        </p>
        <p>
          Every flag is a word and an icon: an up or down arrow for high or low,
          a warning triangle for critical or abnormal, and a check for normal.
          Critical flags also use your destructive color and abnormal values are
          bold. Rows carry a <code>data-flag</code> attribute for your own
          styling.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="trend">Trend</DocsHeading>
        <p>
          Pass <code>history</code>, including the current result, to draw a
          sparkline. Points are sorted by date. The shaded band is the reference
          range, and points outside it are drawn as rings. The sparkline&apos;s
          accessible name describes the trend in words, such as &quot;Glucose,
          fasting trend, 4 results from Oct 6, 2025 to Oct 1, 2026: 92 to 118
          mg/dL, rising&quot;. Set <code>showTrend={"{false}"}</code> to drop
          the column.
        </p>
        <p>
          Dates are ISO 8601 strings and show as UTC dates in US English, so the
          server and client render the same text. Pass <code>formatDate</code>{" "}
          to use your own locale or time zone. Set <code>decimals</code> on a
          result to fix its decimal places across the value, range and trend.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="layout">Layout</DocsHeading>
        <p>
          The table sizes to its container rather than the viewport. Below 32rem
          wide, the reference range moves under the test name so the table fits
          a phone without scrolling sideways.
        </p>
        <p className="text-sm text-muted-foreground">
          A display component, not clinical decision support. It does not
          convert units, interpret results or choose reference ranges, and the
          example values are illustrative.
        </p>
      </section>
      <ComponentExamples examples={componentExamples["lab-results"]!} />
      <PropsTable item="lab-results" />
      <DocsPager href="/docs/components/lab-results" />
    </div>
  )
}
