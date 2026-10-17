import {
  codeBlock,
  docsMetadata,
  registryNamespace,
  shadcn,
} from "@/lib/registry"
import { site } from "@/lib/site"
import { Example } from "./example"

export const metadata = docsMetadata(
  "Growth chart",
  "A child growth chart component with WHO percentile curves for weight, length/height and head circumference, plotting measurements with percentiles and z-scores.",
  "/docs/growth-chart"
)

const usage = `import { GrowthChart, ageInMonths } from "@/components/ui/growth-chart"

const birth = new Date("2024-03-02")
const visits = [
  { date: new Date("2024-09-04"), kg: 7.4 },
  { date: new Date("2025-03-05"), kg: 9.1 },
]

export function WeightChart() {
  return (
    <GrowthChart
      measure="weight"
      sex="female"
      measurements={visits.map((visit) => ({
        ageMonths: ageInMonths(birth, visit.date),
        value: visit.kg,
      }))}
    />
  )
}`

const helpers = `import { growthZScore, zToPercentile, formatPercentile }
  from "@/components/ui/growth-chart"

const z = growthZScore("length", "male", 18, 80.1) // -0.80
formatPercentile(zToPercentile(z!)) // "21st"`

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Components / Charts
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Growth chart</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          WHO percentile curves for children from birth to five years, with your
          measurements plotted on top. Hover or tab to a point for its
          percentile and z-score.
        </p>
      </header>
      <Example />
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Install</h2>
        <p>
          In a React 19 project configured with shadcn, Tailwind CSS 4, and the
          Base UI / Nova theme, run the command below.
        </p>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Installation command"
          className={codeBlock}
        >
          {`bunx ${shadcn} add ${site.url}/r/growth-chart.json`}
        </pre>
        <p>
          To install by name, add the OrganUI namespace to{" "}
          <code>components.json</code> and run{" "}
          <code>bunx {shadcn} add @organui/growth-chart</code>, or install from
          GitHub with{" "}
          <code>bunx {shadcn} add organui/organui/growth-chart</code>.
        </p>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Registry namespace configuration"
          className={codeBlock}
        >
          {registryNamespace}
        </pre>
        <p className="text-sm text-muted-foreground">
          Two files install into your UI directory:{" "}
          <code>growth-chart.tsx</code> and <code>growth-standards.ts</code>,
          the WHO tables it reads. The chart is plain SVG drawn with your theme
          tokens, so it adds no charting library and no global styles.
        </p>
        <a className="underline" href="/r/growth-chart.json">
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Usage</h2>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Usage example"
          className={codeBlock}
        >
          {usage}
        </pre>
        <p>
          Set <code>measure</code> to <code>weight</code> (kilograms),{" "}
          <code>length</code> (centimetres) or <code>head</code> (head
          circumference, centimetres), and <code>sex</code> to{" "}
          <code>female</code> or <code>male</code>. Each measurement is an{" "}
          <code>ageMonths</code> and a <code>value</code>; use{" "}
          <code>ageInMonths</code> to convert dates the way WHO counts them.{" "}
          <code>ageRange</code> defaults to 0 to 24 months and accepts up to 60.{" "}
          <code>percentiles</code> defaults to WHO&apos;s 3rd, 15th, 50th, 85th
          and 97th; the outer pairs are shaded as bands.
        </p>
        <p>
          Length is measured lying down before 24 months and height standing
          from 24 months, so that curve steps down by about 0.7 cm at two years,
          as it does in the WHO charts. Measurements outside the range or the
          standards are left out.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Percentiles and z-scores</h2>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Helper example"
          className={codeBlock}
        >
          {helpers}
        </pre>
        <p>
          The same file exports the calculations the chart uses:{" "}
          <code>growthLms</code>, <code>growthZScore</code>,{" "}
          <code>growthValueAt</code>, <code>zToPercentile</code>,{" "}
          <code>percentileToZ</code>, <code>formatPercentile</code> and{" "}
          <code>formatAge</code>. Z-scores use WHO&apos;s LMS method, and weight
          beyond ±3 SD uses WHO&apos;s restricted extrapolation, matching the
          WHO Anthro software.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Accessibility</h2>
        <p>
          Each measurement is a focusable point whose name gives its age, value
          and percentile, and a visually hidden table after the chart lists
          every measurement for screen readers. Colors come from your{" "}
          <code>primary</code>, <code>foreground</code>,{" "}
          <code>muted-foreground</code>, <code>border</code> and{" "}
          <code>popover</code> tokens.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Data source</h2>
        <p>
          Curves come from the{" "}
          <a
            className="underline"
            href="https://www.who.int/tools/child-growth-standards"
          >
            WHO Child Growth Standards
          </a>{" "}
          (WHO Multicentre Growth Reference Study Group, 2006), sampled monthly
          from the daily LMS tables WHO publishes in its{" "}
          <a
            className="underline"
            href="https://github.com/WorldHealthOrganization/anthro"
          >
            anthro
          </a>{" "}
          package, which reproduces WHO&apos;s published monthly tables.
        </p>
        <p className="text-sm text-muted-foreground">
          A charting aid, not a diagnostic device. It covers birth to five years
          only; older children need a different reference, such as WHO 2007 or
          CDC 2000. Validate it for your own clinical use.
        </p>
      </section>
    </div>
  )
}
