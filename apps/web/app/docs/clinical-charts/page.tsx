import Link from "next/link"
import { ChartAreaHeartRate } from "@workspace/registry/charts/chart-area-heart-rate"
import { CodeSnippet } from "@/components/code-snippet"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import { docsMetadata } from "@/lib/registry"

export const metadata = docsMetadata(
  "Clinical charts",
  "The conventions OrganUI's charts follow, so health data reads the way clinicians expect.",
  "/docs/clinical-charts"
)

const range = `// The usual adult resting range, drawn behind the readings.
const normal = { low: 60, high: 100 }
const inRange =
  latest.heartRate >= normal.low && latest.heartRate <= normal.high

<ReferenceArea
  y1={normal.low}
  y2={normal.high}
  fill="var(--muted-foreground)"
  fillOpacity={0.08}
/>`

const badge = `<Badge variant="outline">
  {inRange ? <CheckIcon /> : <TriangleAlertIcon />}
  {inRange ? "In range" : "Out of range"}
</Badge>`

const events = `const events = [
  { time: "08:00", label: "Fever" },
  { time: "11:00", label: "Paracetamol" },
]

{events.map((event) => (
  <ReferenceLine key={event.time} x={event.time}>
    <Label value={event.label} position="insideTopLeft" />
  </ReferenceLine>
))}`

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href="/docs/clinical-charts" title="Clinical charts">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          The conventions OrganUI&apos;s charts follow, so health data reads the
          way clinicians expect.
        </p>
      </DocsHeader>
      <section className="flex flex-col gap-4">
        <DocsHeading id="example">Example</DocsHeading>
        <p>
          The heart rate chart shows each convention: the latest reading and its
          status in the header, the normal range behind the line, events on the
          timeline, and a footer worked out from the data. Browse the rest on
          the <Link href="/charts/area">charts</Link> pages.
        </p>
        <div className="mx-auto w-full max-w-md">
          <ChartAreaHeartRate />
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="foundation">Foundation</DocsHeading>
        <p>
          Every chart is a card holding shadcn&apos;s{" "}
          <a href="https://ui.shadcn.com/docs/components/chart">chart</a>{" "}
          component, built with Recharts. Series take their color from the{" "}
          <code>--chart-1</code> to <code>--chart-5</code> tokens through{" "}
          <code>chartConfig</code>, so the charts follow your theme in light and
          dark mode. Each one installs as a single file you own and edit.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="readout">The readout</DocsHeading>
        <p>
          A chart about one patient leads with what a monitor shows: the latest
          value and its unit in the card&apos;s header, beside a status badge.
          The value is read from the data, never typed in, so it stays right
          when you connect real records.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="ranges-and-targets">Ranges and targets</DocsHeading>
        <p>
          A reading means little without what it&apos;s judged against. A normal
          or target range is a shaded band; a single target, such as an HbA1c of
          7%, is a dashed line. Both are muted, so they sit behind the data.
          Each range is one constant that both the plot and the badge read, so
          they can&apos;t disagree.
        </p>
        <CodeSnippet
          label="A range shared by the plot and the badge"
          code={range}
        />
        <p>
          The ranges in the examples are common defaults for adults. Set your
          own patient&apos;s, and check your laboratory&apos;s reference ranges,
          which vary by method and population.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="status">Status</DocsHeading>
        <p>
          A status pairs an icon with a label, such as &ldquo;In range&rdquo; or
          &ldquo;Above target&rdquo;, so it never relies on color. Lab panels
          mark results H or L, as a lab report does.
        </p>
        <CodeSnippet label="A status badge" code={badge} />
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="events">Events</DocsHeading>
        <p>
          Marking what happened on the timeline, such as a fever or a dose, lets
          a change in the readings be read against its cause.
        </p>
        <CodeSnippet label="Event markers" code={events} />
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="footers">Footers</DocsHeading>
        <p>
          Each card ends with a headline and a line of context. The headline is
          worked out from the data, such as the peak, the change since the first
          reading or the subgroups below a threshold, with a trend icon where
          the data has a direction.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="clinical-forms">Clinical forms</DocsHeading>
        <p>
          Where medicine has its own chart, OrganUI uses it rather than a
          generic one:
        </p>
        <ul className="ms-6 list-disc [&>li]:mt-2">
          <li>
            <Link href="/charts/area#chart-area-glucose-profile">
              Glucose profile
            </Link>
            : the median with percentile bands over a day.
          </li>
          <li>
            <Link href="/charts/bar#chart-bar-blood-pressure">
              Ambulatory blood pressure
            </Link>{" "}
            as range bars, with the overnight dip.
          </li>
          <li>
            <Link href="/charts/bar#chart-bar-time-in-range">
              Time in range
            </Link>{" "}
            and a <Link href="/charts/bar#chart-bar-lab-panel">lab panel</Link>{" "}
            with each result on its range.
          </li>
          <li>
            <Link href="/charts/line#chart-line-survival">Kaplan–Meier</Link>{" "}
            curves and a{" "}
            <Link href="/charts/line#chart-line-forest-plot">forest plot</Link>{" "}
            for research.
          </li>
        </ul>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="data">Data</DocsHeading>
        <p>
          The examples hold fictional patients and illustrative figures, and say
          so in their footers. They show how data is laid out; they are not
          clinical guidance, and scores such as NEWS2 should be checked against
          the chart your organisation uses.
        </p>
      </section>
      <DocsPager href="/docs/clinical-charts" />
    </div>
  )
}
