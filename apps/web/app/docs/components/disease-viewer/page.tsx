import Link from "next/link"
import { CodeSnippet } from "@/components/code-snippet"
import { ComponentInstallation } from "@/components/component-installation"
import { ComponentPreview } from "@/components/component-preview"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import { PropsTable } from "@/components/props-table"
import { diseases, docsMetadata, shadcn } from "@/lib/registry"
import { site } from "@/lib/site"

export const metadata = docsMetadata(
  "Disease viewer",
  "Shows a disease on organ models: what it affects and spares at each stage and scale, with its findings and investigations.",
  "/docs/components/disease-viewer"
)

const disease = `import type { Disease } from "@/components/disease-model"
import { kidneysModel } from "@/components/kidneys"

export const kidneyStones: Disease = {
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
  stages: [
    { id: "colic", label: "Renal colic", summary: "Sudden loin-to-groin pain." },
  ],
  investigations: [
    { name: "Urine dipstick", result: "Blood", flag: "abnormal" },
  ],
}`

export default function Page() {
  return (
    // Wide, as the disease pages are, so the model and panel sit side by side.
    <div data-docs-wide className="flex flex-col gap-10">
      <DocsHeader href="/docs/components/disease-viewer" title="Disease viewer">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          The view every OrganUI disease is built on. Describe a condition as
          findings on any organ model, as this example does for hypertrophic
          cardiomyopathy; it shows what is affected and spared at each stage and
          scale, beside a panel with the condition&apos;s course and
          investigations.
        </p>
      </DocsHeader>
      <ComponentPreview name="disease-viewer-demo" />
      <div className="flex w-full max-w-160 flex-col gap-10">
        <section className="flex flex-col gap-4">
          <DocsHeading id="installation">Installation</DocsHeading>
          <p>
            Most apps want a ready-made disease:{" "}
            {diseases.map((item, index) => (
              <span key={item.name}>
                {index > 0 && ", "}
                <Link href={item.href} className="underline">
                  {item.title.toLowerCase()}
                </Link>
              </span>
            ))}
            . To describe your own, install the viewer alone.
          </p>
          <ComponentInstallation
            name="disease-viewer"
            command={`bunx ${shadcn} add @organui/disease-viewer`}
          />
          <p className="text-sm text-muted-foreground">
            This adds <code>disease-viewer.tsx</code> and{" "}
            <code>disease-model.ts</code>, the disease types and the{" "}
            <code>diseaseModel</code> function, which has no client code so
            server components can use it too. It installs the{" "}
            <Link href="/docs/components/organ-viewer" className="underline">
              organ viewer
            </Link>{" "}
            and shadcn&apos;s <code>badge</code> and <code>button</code>.
          </p>
          <a className="underline" href={`${site.url}/r/disease-viewer.json`}>
            View registry item JSON
          </a>
        </section>
        <section className="flex flex-col gap-4">
          <DocsHeading id="usage">Usage</DocsHeading>
          <CodeSnippet label="Disease description example" code={disease} />
          <p>
            A disease is drawn on the models of organ components, one per scale:
            a whole organ, and a tissue such as the{" "}
            <Link href="/docs/components/liver-lobule" className="underline">
              liver lobule
            </Link>{" "}
            for what happens under the microscope. Findings name structures of
            that model; a structure without one is spared and keeps its
            anatomical description. A stage replaces the findings and
            investigations it lists, so it describes only what changes.
          </p>
          <p>
            Affected structures share one amber, so a disease of a whole organ
            still shows, and spared ones a muted tone. Red is kept for critical
            results. An abnormal investigation is bold with an arrow for high or
            low, as in the{" "}
            <Link href="/docs/components/lab-results" className="underline">
              lab results table
            </Link>
            .
          </p>
        </section>
        <section className="flex flex-col gap-4">
          <DocsHeading id="behaviour">Behaviour</DocsHeading>
          <p>
            Scale, stage and selection are each controlled or uncontrolled: pass{" "}
            <code>stage</code> with <code>onStageChange</code> to drive the
            stage from your own timeline, or <code>defaultStage</code> to only
            choose where it starts. Selecting a structure in 3D shows its
            finding in the panel, and selecting a finding highlights it in 3D.
            Spared structures the disease says nothing about fold behind a
            button, so a whole-body model lists only what matters; selecting one
            in 3D unfolds them. Changing the scale clears the selection, because
            each model has its own structures.
          </p>
          <p>
            <code>diseaseModel(disease, scale, stage)</code> returns the organ
            model for one scale at one stage, for the{" "}
            <Link href="/docs/components/anatomy-tree" className="underline">
              anatomy tree
            </Link>{" "}
            or your own list. Pass <code>panel=&#123;false&#125;</code> to show
            only the model.
          </p>
        </section>
        <PropsTable item="disease-viewer" />
        <DocsPager href="/docs/components/disease-viewer" />
      </div>
    </div>
  )
}
