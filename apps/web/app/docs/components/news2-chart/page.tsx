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
  "NEWS2 chart",
  "A NEWS2 observation chart for healthcare interfaces: vital signs over time scored with the National Early Warning Score, with the clinical risk and response.",
  "/docs/components/news2-chart"
)

const usage = `import { News2Chart, news2Score } from "@/components/ui/news2-chart"

export function Observations() {
  return (
    <News2Chart
      observations={[
        {
          time: "2026-10-25T16:00:00Z",
          respirationRate: 23,
          spo2: 94,
          onOxygen: false,
          systolic: 106,
          pulse: 108,
          consciousness: "alert",
          temperature: 38.7,
        },
      ]}
    />
  )
}

// The score alone, for an alert or a list of your own.
news2Score({ respirationRate: 23, spo2: 94, onOxygen: false, systolic: 106,
  pulse: 108, consciousness: "alert", temperature: 38.7 })
// → { total: 6, risk: "medium", points: { respirationRate: 2, … } }`

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href="/docs/components/news2-chart" title="NEWS2 chart">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          Observations over time, each scored with NEWS2, the National Early
          Warning Score used across the NHS: the points for every parameter, the
          total, and the risk and response it calls for.
        </p>
      </DocsHeader>
      <ComponentPreview name="news2-chart-demo" />
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
          name="news2-chart"
          command={`bunx ${shadcn} add ${site.url}/r/news2-chart.json`}
        />
        <p>
          Or by name: <code>bunx {shadcn} add @organui/news2-chart</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          The source installs into your UI components directory, along with
          shadcn&apos;s <code>table</code> if you do not have it yet. It holds
          no state, so it renders in server and client components alike.
        </p>
        <a className="underline" href="/r/news2-chart.json">
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="usage">Usage</DocsHeading>
        <CodeSnippet label="Usage example" code={usage} />
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="scoring">Scoring</DocsHeading>
        <p>
          <code>news2Score</code> scores the seven parameters against the Royal
          College of Physicians&apos; NEWS2 chart (2017): respiration rate,
          oxygen saturation, air or oxygen, systolic blood pressure, pulse,
          consciousness on the ACVPU scale, and temperature. New confusion, or
          responding only to voice or pain, scores 3, as unresponsiveness does.
          The total is the sum of the points; a set missing any parameter has no
          total, because NEWS2 is not valid without all seven.
        </p>
        <p>
          Use SpO₂ scale 1 for most patients. Pass{" "}
          <code>spo2Scale={"{2}"}</code> only for a patient with hypercapnic
          respiratory failure whose target of 88–92% has been prescribed: below
          88% scores as usual, and on oxygen, saturation above 92% scores too,
          because too much oxygen harms these patients.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="risk-and-response">Risk and response</DocsHeading>
        <p>
          The latest complete set leads the chart, with its risk and the
          response the RCP sets for it, from <code>news2Responses</code>: low
          for 0–4, low–medium when a single parameter scores 3, medium for 5–6
          and high for 7 or more, with monitoring from every 12 hours at a score
          of 0 to continuous at 7.
        </p>
        <p>
          Every score is a number, so none depends on color. Points of 1 or more
          are bold, a parameter scoring 3 is outlined in your destructive color,
          and only the high band, which calls for an emergency response, turns
          the total destructive. A warning icon marks every set above low risk.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="layout">Layout</DocsHeading>
        <p>
          Sets run from newest to oldest, sorted by <code>time</code>, so the
          latest is always in view, and the parameter names stay put while a
          long run scrolls sideways inside the table, not the page. Times show
          in UTC with a 24-hour clock, and the day only above the first set of
          each day, so the columns stay narrow; pass <code>formatTime</code> for
          your own. The scrolling area can be focused and scrolled with the
          keyboard, and is named for the span of times it covers.
        </p>
        <p className="text-sm text-muted-foreground">
          NEWS2 supports clinical judgement and does not replace it; it is not
          validated for children or in pregnancy. Check the scoring against the
          chart your organisation uses before relying on it. The examples are
          fictional.
        </p>
      </section>
      <ComponentExamples examples={componentExamples["news2-chart"]!} />
      <PropsTable item="news2-chart" />
      <DocsPager href="/docs/components/news2-chart" />
    </div>
  )
}
