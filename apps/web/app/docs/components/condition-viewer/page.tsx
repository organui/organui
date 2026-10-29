import Link from "next/link"
import { CodeSnippet } from "@/components/code-snippet"
import { ComponentInstallation } from "@/components/component-installation"
import { ComponentPreview } from "@/components/component-preview"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import { PropsTable } from "@/components/props-table"
import { conditionsPage, docsMetadata, shadcn } from "@/lib/registry"
import { site } from "@/lib/site"

export const metadata = docsMetadata(
  "Condition viewer",
  "The view every OrganUI condition is built on: what a condition affects and spares on organ models at each stage and scale, with its findings and investigations.",
  "/docs/components/condition-viewer"
)

const component = `// A ready-made condition: one file, its description passed to the viewer.
import { AutoimmuneHepatitis } from "@/components/autoimmune-hepatitis"

<AutoimmuneHepatitis />

// The same viewer with a condition of your own.
import { ConditionViewer } from "@/components/condition-viewer"

<ConditionViewer condition={kidneyStones} />`

const describe = `import type { Condition } from "@/components/condition-model"
import { kidneysModel } from "@/components/kidneys"

export const kidneyStones: Condition = {
  name: "Kidney stones",
  code: "N20.0",
  summary: "Crystals form in the urine and can block the ureter.",
  scales: [
    {
      id: "kidneys",
      label: "Kidneys",
      model: kidneysModel,
      // Structures without a finding are spared.
      findings: {
        "left-ureter": {
          affected: true,
          description: "A stone lodges and the kidney above it swells.",
        },
      },
    },
  ],
  investigations: [
    { name: "Urine dipstick", result: "Blood", flag: "abnormal" },
  ],
}`

const course = `export const kidneyStones: Condition = {
  // …
  stages: [
    {
      id: "colic",
      label: "Renal colic",
      time: "Hours",
      summary: "Sudden loin-to-groin pain.",
    },
    {
      id: "passed",
      label: "Passed",
      time: "Days to weeks",
      summary: "Most small stones pass on their own.",
    },
  ],
  events: [
    {
      stage: "colic",
      label: "CT",
      description: "A low-dose CT shows the stone's size and position.",
    },
  ],
}`

const render = `import { ConditionViewer } from "@/components/condition-viewer"
import { kidneyStones } from "@/lib/kidney-stones"

export function KidneyStones() {
  return <ConditionViewer condition={kidneyStones} />
}`

const modelOnly = `import { conditionModel } from "@/components/condition-model"
import { gravesDisease } from "@/components/graves-disease"
import { OrganViewer } from "@/components/organ-viewer"

export function Thyroid() {
  return (
    <OrganViewer
      model={conditionModel(gravesDisease, "thyroid", "thyrotoxic")}
      label="Thyroid in Graves' disease"
    />
  )
}`

export default function Page() {
  return (
    // Wide, as the condition pages are, so the model and panel sit side by side.
    <div data-docs-wide className="flex flex-col gap-10">
      <DocsHeader
        href="/docs/components/condition-viewer"
        title="Condition viewer"
      >
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          The view every OrganUI condition is built on. Describe a condition as
          findings on organ models; it shows what is affected and spared at each
          stage and scale, with the course as a timeline and a panel of findings
          and investigations.
        </p>
      </DocsHeader>
      <ComponentPreview name="condition-viewer-demo" hideCode />
      <div className="flex w-full max-w-160 flex-col gap-10">
        <p>
          <Link href={conditionsPage.href} className="underline">
            Browse all {conditionsPage.title.toLowerCase()}
          </Link>
          , each ready to install.
        </p>
        <section className="flex flex-col gap-4">
          <DocsHeading id="component">Component</DocsHeading>
          <p>
            Most apps install a ready-made condition, such as{" "}
            <Link
              href="/docs/components/autoimmune-hepatitis"
              className="underline"
            >
              autoimmune hepatitis
            </Link>
            . Each condition is one file: its description passed to the
            condition viewer, which installs with it along with the organs it is
            drawn on, the way shadcn&apos;s <code>chart</code> installs with
            each chart.
          </p>
          <p>
            Use the condition viewer directly to describe a condition OrganUI
            does not ship. The rest of this page is about that.
          </p>
          <CodeSnippet label="Condition and viewer example" code={component} />
        </section>
        <section className="flex flex-col gap-4">
          <DocsHeading id="installation">Installation</DocsHeading>
          <p>
            Installing a condition brings the viewer with it. To describe your
            own, install the viewer alone:
          </p>
          <ComponentInstallation
            name="condition-viewer"
            command={`bunx ${shadcn} add @organui/condition-viewer`}
          />
          <p className="text-sm text-muted-foreground">
            This adds <code>condition-viewer.tsx</code> and{" "}
            <code>condition-model.ts</code>, the condition types and the{" "}
            <code>conditionModel</code> function, which has no client code so
            server components can use it too. It installs the{" "}
            <Link href="/docs/components/organ-viewer" className="underline">
              organ viewer
            </Link>{" "}
            and shadcn&apos;s <code>badge</code> and <code>button</code>.
          </p>
          <a className="underline" href={`${site.url}/r/condition-viewer.json`}>
            View registry item JSON
          </a>
        </section>
        <section className="flex flex-col gap-4">
          <DocsHeading id="your-first-condition">
            Your First Condition
          </DocsHeading>
          <p>
            A condition is a description laid over organ models. Here are kidney
            stones, step by step.
          </p>
          <DocsHeading id="describe-the-findings" level={3}>
            Describe the findings
          </DocsHeading>
          <p>
            A condition is drawn on the models of organ components, one per
            scale: a whole organ, and a tissue such as the{" "}
            <Link href="/docs/components/liver-lobule" className="underline">
              liver lobule
            </Link>{" "}
            for what happens under the microscope. Findings name structures of
            that model; a structure without one is spared and keeps its
            anatomical description. A scale&apos;s <code>translucentIds</code>{" "}
            draws structures see-through, such as the fat around a breast&apos;s
            lobes, so the condition inside them shows.
          </p>
          <CodeSnippet label="Condition description example" code={describe} />
          <DocsHeading id="add-its-course" level={3}>
            Add its course
          </DocsHeading>
          <p>
            Stages show the course as a timeline under the model, each at its{" "}
            <code>time</code> in a typical course, with its <code>events</code>,
            such as a treatment or a test, beneath it. A stage replaces the
            findings and investigations it lists, so it describes only what
            changes. A stage marked <code>alternative</code> is another path
            from the one before it, such as an untreated course beside a treated
            one, and joins the track with a dashed line.
          </p>
          <CodeSnippet label="Course example" code={course} />
          <DocsHeading id="render-it" level={3}>
            Render it
          </DocsHeading>
          <p>Pass the condition to the viewer.</p>
          <CodeSnippet label="Render example" code={render} />
        </section>
        <section className="flex flex-col gap-4">
          <DocsHeading id="affected-and-spared">
            Affected and spared
          </DocsHeading>
          <p>
            Affected structures share one amber, so a condition of a whole organ
            still shows, and spared ones a muted tone. Red is kept for critical
            results. An abnormal investigation is bold with an arrow for high or
            low, as in clinical results tables.
          </p>
        </section>
        <section className="flex flex-col gap-4">
          <DocsHeading id="scale-stage-and-selection">
            Scale, stage and selection
          </DocsHeading>
          <p>
            Scale, stage and selection are each controlled or uncontrolled: pass{" "}
            <code>stage</code> with <code>onStageChange</code> to drive the
            stage from your own timeline, or <code>defaultStage</code> to only
            choose where it starts. Selecting a structure in 3D shows its
            finding in the panel, and selecting a finding highlights it in 3D.
            Spared structures the condition says nothing about fold behind a
            button, so a whole-body model lists only what matters; selecting one
            in 3D unfolds them. Changing the scale clears the selection, because
            each model has its own structures.
          </p>
          <p>
            Select a stage or an event on the timeline to show it, or play the
            course to step through it while the model fades from one stage to
            the next. Pass <code>timeline=&#123;false&#125;</code> to hide the
            timeline and <code>panel=&#123;false&#125;</code> to show only the
            model. <code>conditionModel(condition, scale, stage)</code> returns
            the organ model for one scale at one stage, for the{" "}
            <Link href="/docs/components/anatomy-tree" className="underline">
              anatomy tree
            </Link>{" "}
            or your own list.
          </p>
        </section>
        <section className="flex flex-col gap-4">
          <DocsHeading id="just-the-model">Just the model</DocsHeading>
          <p>
            <code>conditionModel</code> returns a plain organ model, so the{" "}
            <Link href="/docs/components/organ-viewer" className="underline">
              organ viewer
            </Link>{" "}
            shows a condition on its own, with no panel or timeline: one scale
            at one stage, coloured affected or spared.
          </p>
          <CodeSnippet label="Just the model example" code={modelOnly} />
        </section>
        <section className="flex flex-col gap-4">
          <DocsHeading id="accessibility">Accessibility</DocsHeading>
          <p>
            The timeline&apos;s stages are one tab stop: the arrow keys, Home
            and End move along the course. The panel gives the findings as text,
            so the condition reads without the 3D model.
          </p>
        </section>
        <PropsTable item="condition-viewer" />
        <DocsPager href="/docs/components/condition-viewer" />
      </div>
    </div>
  )
}
