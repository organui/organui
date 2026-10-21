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
  "Vital signs",
  "A vital signs panel for heart rate, blood pressure, SpO₂ and temperature, with configurable normal ranges.",
  "/docs/components/vital-signs"
)

const usage = `import { VitalSigns } from "@/components/ui/vital-signs"

export function Vitals() {
  return (
    <VitalSigns
      readings={{ heartRate: 72, systolic: 118, diastolic: 76,
        spo2: 98, temperature: 36.8 }}
      description="Measured at 09:30"
    />
  )
}`

const ranges = `// Merged over adultVitalRanges, one vital at a time.
<VitalSigns
  readings={readings}
  ranges={{ spo2: { low: 88, high: 92 } }}
  vitals={["heartRate", "bloodPressure", "spo2", "respiratoryRate"]}
/>

// Temperature readings and ranges in °F.
<VitalSigns readings={{ temperature: 100.4 }} temperatureUnit="fahrenheit"
  vitals={["temperature"]} />`

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href="/docs/components/vital-signs" title="Vital signs">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          Heart rate, blood pressure, SpO₂ and temperature at a glance, each
          checked against a normal range you can configure. Every status is
          written out with its own icon, so it never depends on colour.
        </p>
      </DocsHeader>
      <ComponentPreview name="vital-signs-demo" />
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
          name="vital-signs"
          command={`bunx ${shadcn} add ${site.url}/r/vital-signs.json`}
        />
        <p>
          Or by name: <code>bunx {shadcn} add @organui/vital-signs</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          The source installs into your configured UI directory, along with
          shadcn&apos;s <code>card</code> if you do not have it yet. It has no
          client state, so it renders in Server Components too, and its icons
          are inline so it adds no icon library.
        </p>
        <a className="underline" href="/r/vital-signs.json">
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="usage">Usage</DocsHeading>
        <CodeSnippet label="Usage example" code={usage} />
        <p>
          Pass the latest readings as numbers. A missing, <code>null</code> or
          non-finite value shows a dash and the status <em>No reading</em>.
          Blood pressure needs both <code>systolic</code> and{" "}
          <code>diastolic</code>.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="ranges-and-status">Ranges and status</DocsHeading>
        <CodeSnippet label="Range configuration example" code={ranges} />
        <p>
          Defaults are common resting adult ranges, exported as{" "}
          <code>adultVitalRanges</code>: heart rate 60–100 bpm, blood pressure
          90–120 / 60–80 mmHg, SpO₂ 95–100%, temperature 36.1–37.2 °C (97–99 °F)
          and respiratory rate 12–20 per minute. Bounds are inclusive. Override
          any of them with <code>ranges</code> for children, a patient&apos;s
          own targets, or your institution&apos;s protocol.
        </p>
        <p>
          A reading below its range is <em>Low</em> with a down arrow, above it{" "}
          <em>High</em> with an up arrow, and inside it <em>Normal</em> with a
          check. Out-of-range cards also get bold status text and your
          theme&apos;s destructive colour on the border and icon. Blood pressure
          is high when either part is high, and the text names the part out of
          range, such as <em>High systolic</em>. Each card carries{" "}
          <code>data-vital</code> and <code>data-status</code> attributes for
          your own styling.
        </p>
        <p>
          The same logic is exported for use elsewhere: <code>vitalStatus</code>
          , <code>bloodPressureStatus</code>, <code>resolveVitalRanges</code>{" "}
          and <code>assessVital</code>.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="customize">Customize</DocsHeading>
        <p>
          Set <code>title</code> for the heading and the region&apos;s
          accessible name, <code>description</code> for a line under it,{" "}
          <code>vitals</code> to choose and order the cards, <code>locale</code>{" "}
          for number formatting (default <code>en-US</code>, so server and
          client render the same) and <code>className</code> for the outer card.
          Cards wrap to fit their container.
        </p>
        <p className="text-sm text-muted-foreground">
          A display component, not a medical device. It does not compute early
          warning scores, trend readings, or raise alarms, and it is not a live
          region: announce changes yourself if readings stream in. The default
          ranges are not clinically validated for any population.
        </p>
      </section>
      <ComponentExamples examples={componentExamples["vital-signs"]!} />
      <PropsTable item="vital-signs" />
      <DocsPager href="/docs/components/vital-signs" />
    </div>
  )
}
