import {
  codeBlock,
  docsMetadata,
  registryNamespace,
  shadcn,
} from "@/lib/registry"
import { site } from "@/lib/site"
import { Example } from "./example"

export const metadata = docsMetadata(
  "DNA helix",
  "A procedural B-DNA double helix built from a sequence, with selectable base pairs and both strands listed below.",
  "/docs/dna-helix"
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
      <header className="flex flex-col gap-4">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Components / Molecular
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">DNA helix</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Type a sequence and get its double helix, with every base paired to
          its complement. Built procedurally, so there is no model to download.
        </p>
      </header>
      <Example />
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Install</h2>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Installation command"
          className={codeBlock}
        >
          {`bunx ${shadcn} add ${site.url}/r/dna-helix.json`}
        </pre>
        <p>
          To install by name, add the OrganUI namespace to{" "}
          <code>components.json</code> and run{" "}
          <code>bunx {shadcn} add @organui/dna-helix</code>, or install from
          GitHub with <code>bunx {shadcn} add organui/organui/dna-helix</code>.
        </p>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Registry namespace configuration"
          className={codeBlock}
        >
          {registryNamespace}
        </pre>
        <p className="text-sm text-muted-foreground">
          The source installs into your components directory and adds three.js,
          plus shadcn&apos;s <code>alert</code>, <code>button</code> and{" "}
          <code>tooltip</code>. It uses your theme tokens and installs no global
          styles.
        </p>
        <a className="underline" href="/r/dna-helix.json">
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Usage</h2>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Usage example"
          className={codeBlock}
        >
          {usage}
        </pre>
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
        <h2 className="text-2xl font-semibold">Geometry and behaviour</h2>
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
    </div>
  )
}
