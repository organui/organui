import Link from "next/link"
import { CodeSnippet } from "@/components/code-snippet"
import { ComponentInstallation } from "@/components/component-installation"
import { ComponentPreview } from "@/components/component-preview"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import { PropsTable } from "@/components/props-table"
import { docsMetadata, shadcn } from "@/lib/registry"
import { site } from "@/lib/site"

export const metadata = docsMetadata(
  "Organ tour",
  "A guided walk through organ models, from an organ down to a cell, with teach-back questions to check what a patient understood.",
  "/docs/components/organ-tour"
)

const usage = `import { OrganTour, type Tour } from "@/components/organ-tour"
import { conditionModel } from "@/components/condition-model"
import { kidneyStones } from "@/lib/kidney-stones"

const tour: Tour = {
  name: "Understanding kidney stones",
  chapters: [
    {
      id: "kidneys",
      label: "Your kidneys",
      model: conditionModel(kidneyStones),
      // How wide the subject is in life, in millimetres.
      span: 300,
      captions: [
        {
          text: "A stone has stuck in the tube that drains this kidney.",
          structureId: "left-ureter",
        },
      ],
      question: {
        question: "Why is it important to drink more water?",
        options: ["It helps stop new stones forming", "It dissolves the kidney"],
        answer: 0,
        explanation: "Dilute urine makes new stones less likely to form.",
      },
    },
  ],
}

export function KidneyStonesTour() {
  return <OrganTour tour={tour} />
}`

const record = `<OrganTour
  tour={tour}
  onAnswer={(chapter, correct) => recordTeachBack(chapter, correct)}
/>`

export default function Page() {
  return (
    // Wide, as the condition pages are, so the model and panel sit side by side.
    <div data-docs-wide className="flex flex-col gap-10">
      <DocsHeader href="/docs/components/organ-tour" title="Organ tour">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          A guided walk through organ models for explaining a condition to a
          patient: from the organ down to a cell, one structure at a time, with
          teach-back questions to check what they understood.
        </p>
      </DocsHeader>
      <ComponentPreview name="organ-tour-demo" hideCode />
      <div className="flex w-full max-w-160 flex-col gap-10">
        <section className="flex flex-col gap-4">
          <DocsHeading id="installation">Installation</DocsHeading>
          <ComponentInstallation
            name="organ-tour"
            command={`bunx ${shadcn} add @organui/organ-tour`}
          />
          <p className="text-sm text-muted-foreground">
            This adds <code>organ-tour.tsx</code>, and installs the{" "}
            <Link href="/docs/components/organ-viewer" className="underline">
              organ viewer
            </Link>{" "}
            and shadcn&apos;s <code>alert</code>, <code>badge</code> and{" "}
            <code>button</code>. Install the organs and conditions your tour
            shows as well.
          </p>
          <a className="underline" href={`${site.url}/r/organ-tour.json`}>
            View registry item JSON
          </a>
        </section>
        <section className="flex flex-col gap-4">
          <DocsHeading id="usage">Usage</DocsHeading>
          <p>
            A tour is data. Each chapter has a model, its width in life, its
            captions and a question. A chapter can show any organ model, or a
            condition through{" "}
            <Link
              href="/docs/components/condition-viewer"
              className="underline"
            >
              <code>conditionModel</code>
            </Link>
            , so affected structures stay amber.
          </p>
          <CodeSnippet label="Organ tour example" code={usage} />
          <p>
            Captions name a <code>structureId</code> to highlight and a{" "}
            <code>view</code> to show, from the model&apos;s named views. Add a
            view with <code>structureIds</code> to the model to frame one
            structure.
          </p>
        </section>
        <section className="flex flex-col gap-4">
          <DocsHeading id="scale">Scale</DocsHeading>
          <p>
            The scale readout over the model comes from each chapter&apos;s{" "}
            <code>span</code>: its width in life, and how far it is magnified
            from the tour&apos;s widest chapter. A schematic model, such as the
            liver lobule, is shown at the scale of what it stands for.
          </p>
        </section>
        <section className="flex flex-col gap-4">
          <DocsHeading id="teach-back">Teach-back</DocsHeading>
          <p>
            Teach-back asks a patient to say something back in their own words,
            which tests the explanation rather than the patient. So each
            question has one answer per visit: a wrong one shows the explanation
            and offers to go over the chapter, and the summary lists the
            chapters to go over. Write questions about what the person needs to
            do, and answers they might really believe.
          </p>
          <p>
            <code>onAnswer</code> reports each answer, for your own record of
            the conversation. The tour keeps nothing itself.
          </p>
          <CodeSnippet label="Recording answers example" code={record} />
          <p>
            The text in a tour is yours to write and check. The example above is
            illustrative, and a tour supports a clinician&apos;s explanation
            rather than replacing it.
          </p>
        </section>
        <section className="flex flex-col gap-4">
          <DocsHeading id="accessibility">Accessibility</DocsHeading>
          <p>
            The tour moves only when the reader does, and every caption and
            question reads without the 3D model. Captions are announced as they
            change. Each caption&apos;s structure is named beside it, and
            answers show an icon and a label as well as their weight.
          </p>
        </section>
        <PropsTable item="organ-tour" />
        <DocsPager href="/docs/components/organ-tour" />
      </div>
    </div>
  )
}
