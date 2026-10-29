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
  "Patient banner",
  "A patient banner for healthcare interfaces: name, date of birth and age, sex, identifiers, alerts and allergies, at the top of every clinical screen.",
  "/docs/components/patient-banner"
)

const usage = `import {
  formatNhsNumber,
  PatientBanner,
} from "@/components/ui/patient-banner"

export function Header() {
  return (
    <PatientBanner
      patient={{
        name: { family: "Okafor", given: ["Grace", "Adaeze"], prefix: "Mrs" },
        birthDate: "1958-01-12",
        sex: "Female",
        identifiers: [
          { label: "NHS number", value: formatNhsNumber("9996543218") },
        ],
      }}
      allergies={["Penicillin (anaphylaxis)", "Latex"]}
      alerts={["Falls risk"]}
    />
  )
}`

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href="/docs/components/patient-banner" title="Patient banner">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          Who the screen is about, at the top of every clinical view: name, date
          of birth and age, sex, identifiers, alerts and allergies, laid out as
          the NHS patient banner standard sets them, so the right patient is
          never in doubt.
        </p>
      </DocsHeader>
      <ComponentPreview name="patient-banner-demo" />
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
          name="patient-banner"
          command={`bunx ${shadcn} add ${site.url}/r/patient-banner.json`}
        />
        <p>
          Or by name: <code>bunx {shadcn} add @organui/patient-banner</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          The source installs into your UI components directory, along with
          shadcn&apos;s <code>badge</code> if you do not have it yet. It holds
          no state, so it renders in server and client components alike.
        </p>
        <a className="underline" href="/r/patient-banner.json">
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="usage">Usage</DocsHeading>
        <CodeSnippet label="Usage example" code={usage} />
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="identity">Identity</DocsHeading>
        <p>
          The name reads family name first, in capitals, then the given names
          and the title in brackets: <code>OKAFOR, Grace Adaeze (Mrs)</code>.
          Capitals set the family name apart, so two patients with the same
          given name are not confused. <code>formatPatientName</code> gives the
          same text for a list or a heading of your own.
        </p>
        <p>
          Dates show as <code>12-Jan-1958</code>, day, month and year in a form
          no reader can swap, and in UTC, so the server and client render the
          same text. Pass <code>formatDate</code> to use another form. Age
          follows the date of birth: in days under four weeks, in months under
          two years, then in completed years. It is counted on{" "}
          <code>today</code>, which defaults to the current date. A{" "}
          <code>deceasedDate</code> replaces the age with the date of death.
        </p>
        <p>
          Identifiers show in the order you pass them, the primary one first,
          each with its own label. <code>formatNhsNumber</code> spaces an NHS
          number in groups of three, three and four, and{" "}
          <code>isValidNhsNumber</code> checks its modulus 11 check digit before
          you show it.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="allergies-and-alerts">
          Allergies and alerts
        </DocsHeading>
        <p>
          Allergies have three states, and each reads differently. Leave{" "}
          <code>allergies</code> out, or pass an empty list, when they have not
          been recorded: the banner says so with a question icon, because not
          asking is not the same as none. Pass{" "}
          <code>&quot;none-known&quot;</code> once no known allergies has been
          recorded, and the list of substances otherwise, which shows in bold
          with a warning icon.
        </p>
        <p>
          <code>alerts</code> are the warnings to see before anything else, such
          as <code>&quot;DNACPR&quot;</code> or{" "}
          <code>&quot;Safeguarding&quot;</code>, as badges beside the name. None
          of these depends on color alone, and the banner uses no red, which{" "}
          <Link href="/docs/components/lab-results" className="underline">
            lab results
          </Link>{" "}
          keep for critical values.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="layout">Layout</DocsHeading>
        <p>
          The banner is a <code>section</code> named for the patient, with the
          name as its heading and the details in a description list. It sizes to
          its container: at 48rem and wider the allergies join the details on
          one row, at the far end, and on a phone the details wrap whole fields
          onto more lines rather than scrolling sideways.
        </p>
        <p className="text-sm text-muted-foreground">
          A display component. It does not look up, match or verify patients;
          the examples are fictional, with NHS numbers from the 999 range the
          NHS keeps for testing.
        </p>
      </section>
      <ComponentExamples examples={componentExamples["patient-banner"]!} />
      <PropsTable item="patient-banner" />
      <DocsPager href="/docs/components/patient-banner" />
    </div>
  )
}
