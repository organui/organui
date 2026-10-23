import * as React from "react"
import Link from "next/link"
import { diseaseModel } from "@workspace/registry/disease-model"
import { Badge } from "@workspace/ui/components/badge"
import { CodeSnippet } from "@/components/code-snippet"
import { ComponentInstallation } from "@/components/component-installation"
import { ComponentPreview } from "@/components/component-preview"
import { DiseaseApi } from "@/components/disease-api"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import { diseaseData } from "@/lib/diseases"
import { registryItems, type RegistryItem } from "@/lib/registry"

const variants = [
  {
    suffix: "without-panel",
    title: "Without Panel",
    description:
      "Hide the panel to place the model in your own layout, and choose the scale and stage with props.",
  },
  {
    suffix: "controlled",
    title: "Controlled",
    description:
      "Drive the stage, scale and selection from your own state, such as a patient's timeline.",
  },
]

function list(items: React.ReactNode[], last = "and") {
  return items.map((node, index) => (
    <React.Fragment key={index}>
      {index > 0 && (index === items.length - 1 ? ` ${last} ` : ", ")}
      {node}
    </React.Fragment>
  ))
}

// A disease page: what the condition is, its course, the models it is shown
// on and their licences, all read from the disease's own data. The page is
// wide so the model and its panel sit side by side; the text keeps the docs
// column's measure.
export async function DiseaseDocs({ item }: { item: RegistryItem }) {
  const disease = await diseaseData[item.name]!()
  const component = item.name
    .split("-")
    .map((word) => word[0]!.toUpperCase() + word.slice(1))
    .join("")
  const bases = disease.scales.map((scale) => ({
    scale,
    item: registryItems.find(({ name }) => name === scale.id)!,
  }))
  const baseLinks = bases.map(({ item }) => (
    <Link key={item.name} href={item.href} className="underline">
      {item.title.toLowerCase()}
    </Link>
  ))
  const stages = disease.stages ?? []
  const usage = `import { ${component} } from "@/components/${item.name}"

export function ${component}Demo() {
  return <${component} />
}`
  return (
    <div data-docs-wide className="flex flex-col gap-10">
      <DocsHeader href={item.href} title={item.title}>
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          {disease.summary}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="font-mono">
            ICD-10 {disease.code}
          </Badge>
          <span>On the {list(baseLinks)}</span>
          {stages.length > 1 && <span>{stages.length} stages</span>}
        </div>
      </DocsHeader>
      <ComponentPreview key={item.name} name={`${item.name}-demo`} />
      <div className="flex w-full max-w-160 flex-col gap-10">
        <section className="flex flex-col gap-4">
          <DocsHeading id="installation">Installation</DocsHeading>
          <ComponentInstallation name={item.name} command={item.install} />
          <p className="text-sm text-muted-foreground">
            This adds <code>{item.name}.tsx</code>, the disease&apos;s data and
            component, to your components directory. It is built on the{" "}
            <Link href="/docs/components/disease-viewer" className="underline">
              disease viewer
            </Link>{" "}
            and reuses the models of the {list(baseLinks)}, which install with
            it.
          </p>
          <a className="underline" href={item.json}>
            View registry item JSON
          </a>
        </section>
        <section className="flex flex-col gap-4">
          <DocsHeading id="usage">Usage</DocsHeading>
          <CodeSnippet label="Usage example" code={usage} />
          <p>
            Every structure is a finding: affected structures are amber and
            spared ones muted. Select one, in 3D or in the panel, to read what
            the disease does there.
          </p>
        </section>
        {stages.length > 1 && (
          <section className="flex flex-col gap-4">
            <DocsHeading id="course">Course</DocsHeading>
            <p>
              Set <code>stage</code> or <code>defaultStage</code> to one of
              these. Each stage changes which structures are affected and the
              investigations to expect.
            </p>
            <ol className="flex flex-col gap-4 border-l pl-5">
              {stages.map((stage) => {
                const affected = bases.map(({ scale }) => ({
                  scale,
                  count: diseaseModel(
                    disease,
                    scale.id,
                    stage.id
                  ).structures.filter(({ group }) => group === "Affected")
                    .length,
                }))
                return (
                  <li key={stage.id} className="flex flex-col gap-1">
                    <span className="font-medium">
                      {stage.label}{" "}
                      <code className="text-xs font-normal text-muted-foreground">
                        &quot;{stage.id}&quot;
                      </code>
                    </span>
                    <p className="text-muted-foreground">{stage.summary}</p>
                    <p className="text-sm text-muted-foreground">
                      Affects{" "}
                      {list(
                        affected.map(({ scale, count }) => (
                          <React.Fragment key={scale.id}>
                            {count} {count === 1 ? "structure" : "structures"}{" "}
                            of the {scale.label.toLowerCase()}
                          </React.Fragment>
                        ))
                      )}
                      .
                    </p>
                  </li>
                )
              })}
            </ol>
          </section>
        )}
        {bases.length > 1 && (
          <section className="flex flex-col gap-4">
            <DocsHeading id="scales">Scales</DocsHeading>
            <p>
              Set <code>scale</code> or <code>defaultScale</code> to show the
              disease on another model. Each has its own structure IDs, so the
              viewer clears the selection when the scale changes.
            </p>
            <ul className="flex flex-col gap-2">
              {bases.map(({ scale, item: base }) => (
                <li key={scale.id}>
                  <code>&quot;{scale.id}&quot;</code>: the{" "}
                  <Link href={base.href} className="underline">
                    {base.title.toLowerCase()}
                  </Link>
                  , {scale.model.structures.length} structures.
                </li>
              ))}
            </ul>
          </section>
        )}
        {variants.map(({ suffix, title, description }) => (
          <section
            key={suffix}
            id={title.toLowerCase().replaceAll(" ", "-")}
            className="flex min-w-0 flex-col gap-4"
          >
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
            <ComponentPreview name={`${item.name}-${suffix}`} />
          </section>
        ))}
        <DiseaseApi component={component} disease={disease} />
        <section className="flex flex-col gap-4">
          <DocsHeading id="models-and-licences">
            Models and licences
          </DocsHeading>
          <p>
            The component code is MIT. Each model keeps its own licence, and the
            viewer shows its credit; see{" "}
            <Link href="/docs/licences" className="underline">
              Licences
            </Link>{" "}
            before hiding it.
          </p>
          <ul className="flex flex-col gap-2">
            {bases.map(({ scale }) => (
              <li key={scale.id}>
                <span className="font-medium">{scale.label}:</span>{" "}
                {scale.model.attribution.credit},{" "}
                <a
                  className="underline"
                  href={scale.model.attribution.licenseUrl}
                >
                  {scale.model.attribution.license}
                </a>
                .
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            Educational, not for diagnosis or clinical decisions. The findings
            summarise typical disease; individual patients differ.
          </p>
        </section>
        <DocsPager href={item.href} />
      </div>
    </div>
  )
}
