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
  "DNA helix",
  "A procedural B-DNA double helix built from a sequence, with selectable base pairs and both strands listed below.",
  "/docs/components/dna-helix"
)

const usage = `"use client"
import { useState } from "react"
import { DnaHelix } from "@/components/dna-helix"

export function GenePanel() {
  const [selected, select] = useState<number | null>(null)
  return (
    <DnaHelix
      sequence="ATGCGTACCTGAGCTTAACG"
      selectedIndex={selected}
      onSelectionChange={select}
    />
  )
}`

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href="/docs/components/dna-helix" title="DNA helix">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          Type a sequence and get its double helix, with every base paired to
          its complement. Built procedurally, so there is no model to download.
        </p>
      </DocsHeader>
      <ComponentPreview name="dna-helix-demo" />
      <section className="flex flex-col gap-4">
        <DocsHeading id="installation">Installation</DocsHeading>
        <ComponentInstallation
          name="dna-helix"
          command={`bunx ${shadcn} add ${site.url}/r/dna-helix.json`}
        />
        <p>
          Or by name: <code>bunx {shadcn} add @organui/dna-helix</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          The source installs into your components directory and adds three.js,
          plus shadcn&apos;s <code>alert</code>, <code>button</code> and{" "}
          <code>tooltip</code>. Its buttons are composed with Base UI&apos;s{" "}
          <code>render</code> prop;{" "}
          <Link href="/docs/base-ui" className="underline">
            Radix projects
          </Link>{" "}
          get a copy built on <code>asChild</code>. It uses your theme tokens
          and installs no global styles.
        </p>
        <a className="underline" href="/r/dna-helix.json">
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="usage">Usage</DocsHeading>
        <CodeSnippet label="Usage example" code={usage} />
        <p>
          <code>sequence</code> is one strand read 5′ to 3′; whitespace and case
          are ignored, and any letter other than A, C, G or T shows a message
          instead of a helix. Selection is controlled: pass{" "}
          <code>selectedIndex</code>, counted from 0 at the 5′ end, and update
          it from <code>onSelectionChange</code>, which also passes the pair
          with its partner base and hydrogen bond count.{" "}
          <code>dnaBasePairs(sequence)</code> returns the same pairs without
          rendering.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="geometry-and-behaviour">
          Geometry and behaviour
        </DocsHeading>
        <p>
          The helix is right-handed B-DNA: 3.38 Å rise and 34.3° twist per pair,
          about 10.5 pairs a turn, with phosphates 9 Å from the axis and the
          backbones closer on one side to leave the minor and major grooves.
          Bases are coloured A red, T blue, G green and C yellow, the same as
          nucleotides in the molecule viewer. It is a schematic: base geometry,
          sugars and sequence-dependent shape are not modelled.
        </p>
        <p>
          The helix turns slowly about its axis until the user pauses it, moves
          the camera, or prefers reduced motion; pass{" "}
          <code>autoRotate=&#123;false&#125;</code> to keep it still. Click a
          base pair, or use the strands below the stage, which are one tab stop
          moved with the arrow keys, Home and End. Drag or the arrow keys
          rotate; scroll, pinch, plus and minus zoom.
        </p>
        <p className="text-sm text-muted-foreground">
          WebGL is required. Pass <code>strands=&#123;false&#125;</code> to hide
          the sequence strip and <code>controls=&#123;false&#125;</code> to hide
          the buttons; the ref exposes <code>zoom</code>, <code>rotate</code>{" "}
          and <code>reset</code>.
        </p>
      </section>
      <ComponentExamples examples={componentExamples["dna-helix"]!} />
      <PropsTable item="dna-helix" />
      <DocsPager href="/docs/components/dna-helix" />
    </div>
  )
}
