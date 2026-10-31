import Link from "next/link"
import { ComponentInstallation } from "@/components/component-installation"
import { ComponentPreview } from "@/components/component-preview"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import { docsMetadata, shadcn } from "@/lib/registry"
import { site } from "@/lib/site"

export const metadata = docsMetadata(
  "Autoimmune hepatitis tour",
  "A ready-made organ tour explaining autoimmune hepatitis to a patient, from the liver down to one cell and back to why treatment matters.",
  "/docs/components/autoimmune-hepatitis-tour"
)

export default function Page() {
  return (
    // Wide, as the condition pages are, so the model and panel sit side by side.
    <div data-docs-wide className="flex flex-col gap-10">
      <DocsHeader
        href="/docs/components/autoimmune-hepatitis-tour"
        title="Autoimmune hepatitis tour"
      >
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          A ready-made organ tour for explaining a new diagnosis: the liver, a
          lobule, one cell and why treatment matters.
        </p>
      </DocsHeader>
      <ComponentPreview name="autoimmune-hepatitis-tour-demo" hideCode />
      <div className="flex w-full max-w-160 flex-col gap-10">
        <section className="flex flex-col gap-4">
          <DocsHeading id="installation">Installation</DocsHeading>
          <ComponentInstallation
            name="autoimmune-hepatitis-tour"
            command={`bunx ${shadcn} add @organui/autoimmune-hepatitis-tour`}
          />
          <p className="text-sm text-muted-foreground">
            This adds <code>autoimmune-hepatitis-tour.tsx</code>, and installs
            the{" "}
            <Link href="/docs/components/organ-tour" className="underline">
              organ tour
            </Link>
            ,{" "}
            <Link
              href="/docs/components/autoimmune-hepatitis"
              className="underline"
            >
              autoimmune hepatitis
            </Link>{" "}
            and the{" "}
            <Link href="/docs/components/cell" className="underline">
              cell
            </Link>
            .
          </p>
          <a
            className="underline"
            href={`${site.url}/r/autoimmune-hepatitis-tour.json`}
          >
            View registry item JSON
          </a>
        </section>
        <section className="flex flex-col gap-4">
          <DocsHeading id="before-you-use-it">Before you use it</DocsHeading>
          <p>
            The file is yours once installed. Check the wording with your
            clinical team and adapt it to your patients and local treatment
            before you use it. It supports a clinician&apos;s explanation rather
            than replacing it.
          </p>
          <p>
            The tour takes the same props as the{" "}
            <Link href="/docs/components/organ-tour" className="underline">
              organ tour
            </Link>
            , apart from <code>tour</code>. Pass <code>onAnswer</code> to record
            what to go over.
          </p>
        </section>
        <DocsPager href="/docs/components/autoimmune-hepatitis-tour" />
      </div>
    </div>
  )
}
