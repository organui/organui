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
  "Growth chart",
  "A child growth chart component that draws percentile curves from reference tables you supply, such as the WHO Child Growth Standards, and plots measurements with percentiles and z-scores.",
  "/docs/components/growth-chart"
)

const usage = `import {
  GrowthChart,
  ageInMonths,
  growthStandardsFromAnthro,
} from "@/components/ui/growth-chart"

const birth = new Date("2024-03-02")
const visits = [
  { date: new Date("2024-09-04"), kg: 7.4 },
  { date: new Date("2025-03-05"), kg: 9.1 },
]

// weightTable is the text of a weight-for-age table you host yourself.
export function WeightChart({ weightTable }: { weightTable: string }) {
  const standards = growthStandardsFromAnthro({ weight: weightTable })
  return (
    <GrowthChart
      standards={standards}
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

const z = growthZScore(standards, "length", "male", 18, 80.1) // -0.80
formatPercentile(zToPercentile(z!)) // "21st", on the WHO standards`

const own = `import { GrowthChart, type GrowthStandards } from "@/components/ui/growth-chart"

// [L, M, S] for each completed month from \`start\`, for both sexes.
const standards: GrowthStandards = {
  head: {
    female: { start: 0, lms: headGirls },
    male: { start: 0, lms: headBoys },
  },
}`

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href="/docs/components/growth-chart" title="Growth chart">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          Percentile curves for a child&apos;s weight, length/height and head
          circumference, with measurements plotted on top. Hover over or tab to
          a point for its percentile and z-score.
        </p>
      </DocsHeader>
      <ComponentPreview name="growth-chart-demo" />
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
          name="growth-chart"
          command={`bunx ${shadcn} add ${site.url}/r/growth-chart.json`}
        />
        <p>
          Or by name: <code>bunx {shadcn} add @organui/growth-chart</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          One file installs into your UI components directory. The chart is
          plain SVG drawn with your theme tokens, so it adds no charting
          library. It contains no growth data.
        </p>
        <a className="underline" href="/r/growth-chart.json">
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="usage">Usage</DocsHeading>
        <CodeSnippet label="Usage example" code={usage} />
        <p>
          Set <code>measure</code> to <code>weight</code> (kilograms),{" "}
          <code>length</code> (centimetres) or <code>head</code> (head
          circumference, centimetres), and <code>sex</code> to{" "}
          <code>female</code> or <code>male</code>. Each measurement is an{" "}
          <code>ageMonths</code> and a <code>value</code>; use{" "}
          <code>ageInMonths</code> to convert dates the way WHO counts them.{" "}
          <code>ageRange</code> defaults to 0 to 24 months.{" "}
          <code>percentiles</code> defaults to WHO&apos;s 3rd, 15th, 50th, 85th
          and 97th; the outer pairs are shaded as bands. Measurements outside
          the range or the tables are left out.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="standards">
          Growth standards and their licence
        </DocsHeading>
        <p>
          The component ships no reference data, because the tables are not
          OrganUI&apos;s to license. You pass <code>standards</code>: LMS
          parameters by completed month for each measure and sex.{" "}
          <code>length</code> is used below 24 months and <code>height</code>{" "}
          from 24, so the WHO curve steps down by about 0.7 cm at two years,
          where children start being measured standing.
        </p>
        <h3 className="text-lg font-semibold">Where to get the tables</h3>
        <p>
          The{" "}
          <a
            className="underline"
            href="https://www.who.int/tools/child-growth-standards"
          >
            WHO Child Growth Standards
          </a>{" "}
          (birth to 5 years) are published by WHO, and its{" "}
          <a
            className="underline"
            href="https://github.com/WorldHealthOrganization/anthro"
          >
            anthro
          </a>{" "}
          package carries them as daily tables in{" "}
          <code>data-raw/growthstandards</code> (<code>weianthro.txt</code>,{" "}
          <code>lenanthro.txt</code> and <code>hcanthro.txt</code>). Host copies
          yourself and pass their text to <code>growthStandardsFromAnthro</code>
          , which samples them by month as WHO&apos;s monthly tables do.
        </p>
        <p>
          The tables are © World Health Organization. The anthro package
          distributes them under{" "}
          <a
            className="underline"
            href="https://www.gnu.org/licenses/gpl-3.0.html"
          >
            GPL-3
          </a>
          , and WHO&apos;s{" "}
          <a
            className="underline"
            href="https://www.who.int/about/policies/publishing/copyright"
          >
            copyright policy
          </a>{" "}
          requires its permission for commercial use of its materials. Check
          those terms before you use them in your product.
        </p>
        <p>
          The{" "}
          <a className="underline" href="https://www.cdc.gov/growthcharts/">
            CDC 2000 growth charts
          </a>{" "}
          publish LMS files for ages 2 to 20 years by half month. Resample them
          to whole months and pass them as <code>standards</code> yourself;
          check CDC&apos;s terms for your use as well.
        </p>
        <p>
          The example above fetches WHO&apos;s tables from WHO&apos;s repository
          at runtime, with a loader that lives on this site only. The installed
          component contains no data and makes no network requests.
        </p>
        <CodeSnippet label="Own standards example" code={own} />
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="percentiles-and-z-scores">
          Percentiles and z-scores
        </DocsHeading>
        <CodeSnippet label="Helper example" code={helpers} />
        <p>
          The file also exports the calculations the chart uses:{" "}
          <code>growthLms</code>, <code>growthZScore</code>,{" "}
          <code>growthValueAt</code>, <code>zToPercentile</code>,{" "}
          <code>percentileToZ</code>, <code>formatPercentile</code> and{" "}
          <code>formatAge</code>. Z-scores use the LMS method, and weight beyond
          ±3 SD uses WHO&apos;s restricted extrapolation, matching the WHO
          Anthro software.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="accessibility">Accessibility</DocsHeading>
        <p>
          Each measurement is a focusable point whose name gives its age, value
          and percentile, and a visually hidden table after the chart lists
          every measurement for screen readers. Colors come from your{" "}
          <code>primary</code>, <code>muted-foreground</code>,{" "}
          <code>border</code> and <code>popover</code> tokens.
        </p>
        <p className="text-sm text-muted-foreground">
          A charting aid, not a diagnostic device. Validate it, and the
          reference you choose, for your own clinical use.
        </p>
      </section>
      <ComponentExamples examples={componentExamples["growth-chart"]!} />
      <PropsTable item="growth-chart" />
      <DocsPager href="/docs/components/growth-chart" />
    </div>
  )
}
