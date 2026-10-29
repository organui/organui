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
import { docsMetadata, shadcn, showComingSoon } from "@/lib/registry"
import { site } from "@/lib/site"

export const metadata = docsMetadata(
  "Allergy list",
  "An allergy list for healthcare interfaces: substances with reaction, severity and verification, telling not recorded from no known allergies.",
  "/docs/components/allergy-list"
)

const usage = `import { AllergyList, type Allergy } from "@/components/ui/allergy-list"

const allergies: Allergy[] = [
  {
    id: "penicillin",
    substance: "Penicillin",
    reactions: ["Anaphylaxis"],
    severity: "severe",
    verification: "confirmed",
    recordedDate: "2003-05-14",
  },
  {
    id: "codeine",
    substance: "Codeine",
    type: "intolerance",
    reactions: ["Vomiting"],
    severity: "mild",
  },
]

export function Allergies() {
  return <AllergyList allergies={allergies} caption="Allergies" />
}`

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href="/docs/components/allergy-list" title="Allergy list">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          The allergies and intolerances on a patient&apos;s record, each with
          what happened and how badly. It says plainly when allergies were never
          asked about, which is not the same as having none.
        </p>
      </DocsHeader>
      <ComponentPreview name="allergy-list-demo" />
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
          name="allergy-list"
          command={`bunx ${shadcn} add ${site.url}/r/allergy-list.json`}
        />
        <p>
          Or by name: <code>bunx {shadcn} add @organui/allergy-list</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          The source installs into your UI components directory, along with
          shadcn&apos;s <code>table</code> if you do not have it yet. It holds
          no state, so it renders in server and client components alike.
        </p>
        <a className="underline" href="/r/allergy-list.json">
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="usage">Usage</DocsHeading>
        <CodeSnippet label="Usage example" code={usage} />
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="recording-allergies">Recording allergies</DocsHeading>
        <p>
          Each allergy names its <code>substance</code>, the{" "}
          <code>reactions</code> it caused and the <code>severity</code> of the
          worst one. A severe reaction is bold with a warning icon, and a mild
          one muted, so the list never depends on color. Mark an{" "}
          <code>intolerance</code>, such as nausea from codeine, apart from an
          allergy, and an <code>unconfirmed</code> one apart from one confirmed
          by testing or a clear history. A <code>resolved</code> or{" "}
          <code>inactive</code> allergy stays on the list, struck through and
          muted, with its status in words.
        </p>
        <p>
          Leave <code>allergies</code> out, or pass an empty list, when they
          have not been asked about; pass <code>&quot;none-known&quot;</code>{" "}
          once no known allergies has been recorded. The two read differently,
          because a missing answer is a reason to ask.
        </p>
      </section>
      {showComingSoon && (
        <section className="flex flex-col gap-4">
          <DocsHeading id="with-the-patient-banner">
            With the patient banner
          </DocsHeading>
          <p>
            <code>allergySummary</code> turns the list into the{" "}
            <Link href="/docs/components/patient-banner" className="underline">
              patient banner&apos;s
            </Link>{" "}
            <code>allergies</code>: each active substance with its first
            reaction, such as <code>Penicillin (Anaphylaxis)</code>. Resolved
            allergies are left out, and a list where every allergy has resolved
            becomes no known allergies.
          </p>
        </section>
      )}
      <section className="flex flex-col gap-4">
        <DocsHeading id="layout">Layout</DocsHeading>
        <p>
          The table sizes to its container. Below 32rem wide, the date recorded
          moves under the substance so the table fits a phone without scrolling
          sideways. Dates are ISO 8601 strings shown as UTC dates in US English;
          pass <code>formatDate</code> for your own.
        </p>
        <p className="text-sm text-muted-foreground">
          A display component, not decision support: it does not check
          prescriptions against allergies or cross-sensitivity. The examples are
          fictional.
        </p>
      </section>
      <ComponentExamples examples={componentExamples["allergy-list"]!} />
      <PropsTable item="allergy-list" />
      <DocsPager href="/docs/components/allergy-list" />
    </div>
  )
}
