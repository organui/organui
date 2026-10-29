import { ComponentPreview } from "@/components/component-preview"
import { ComponentInstallation } from "@/components/component-installation"
import { CodeSnippet } from "@/components/code-snippet"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import { PropsTable } from "@/components/props-table"
import { ExampleSection } from "@/components/component-examples"
import { componentExamples } from "@/lib/component-examples"
import Link from "next/link"
import { docsMetadata, shadcn } from "@/lib/registry"
import { site } from "@/lib/site"

export const metadata = docsMetadata(
  "Molecule viewer",
  "A three.js viewer for PDB and mmCIF structures with cartoon, ball and stick and spacefill styles, residue selection and a sequence strip.",
  "/docs/components/molecule-viewer"
)

const usage = `"use client"
import { useState } from "react"
import { MoleculeViewer } from "@/components/molecule-viewer"

export function StructurePanel() {
  const [selectedId, select] = useState<string | null>(null)
  return (
    <MoleculeViewer
      src="https://files.rcsb.org/download/1CRN.cif"
      selectedId={selectedId}
      onSelectionChange={select}
    />
  )
}`

const parse = `import { parseStructure } from "@/components/molecule-viewer"

const structure = parseStructure(text) // PDB or mmCIF, detected
structure.residues[0] // { id: "A:1", name: "THR", kind: "protein", secondary: "sheet", ... }
structure.bonds       // atom index pairs inferred from covalent radii`

const examples = Object.fromEntries(
  componentExamples["molecule-viewer"]!.map((example) => [
    example.name,
    example,
  ])
)

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader
        href="/docs/components/molecule-viewer"
        title="Molecule viewer"
      >
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          Open a protein or nucleic acid structure from the Protein Data Bank
          and explore it residue by residue. The viewer parses PDB and mmCIF
          text itself, so it needs nothing beyond three.js.
        </p>
      </DocsHeader>
      <ComponentPreview name="molecule-viewer-demo" />
      <section className="flex flex-col gap-4">
        <DocsHeading id="installation">Installation</DocsHeading>
        <ComponentInstallation
          name="molecule-viewer"
          command={`bunx ${shadcn} add ${site.url}/r/molecule-viewer.json`}
        />
        <p>
          Or by name: <code>bunx {shadcn} add @organui/molecule-viewer</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          The source installs into your components directory and adds three.js,
          plus shadcn&apos;s <code>alert</code>, <code>button</code>,{" "}
          <code>select</code> and <code>tooltip</code> for its controls. Its
          toolbar composes them with Base UI&apos;s <code>render</code> prop;{" "}
          <Link href="/docs/base-ui" className="underline">
            Radix projects
          </Link>{" "}
          get a copy built on <code>asChild</code>. It uses your theme tokens
          and installs no global styles.
        </p>
        <a className="underline" href="/r/molecule-viewer.json">
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="usage">Usage</DocsHeading>
        <CodeSnippet label="Usage example" code={usage} />
        <p>
          Pass a URL as <code>src</code>, or the file&apos;s text as{" "}
          <code>data</code>. RCSB serves every entry with CORS, as{" "}
          <code>https://files.rcsb.org/download/&lt;ID&gt;.cif</code> or{" "}
          <code>.pdb</code>. The crambin sample above is served at{" "}
          <code>{`${site.url}/models/crambin.pdb`}</code> if you want a small
          structure to start from.
        </p>
        <p>
          Only the first model and the first alternate location of each atom are
          read. Secondary structure comes from the file&apos;s HELIX and SHEET
          records, or <code>_struct_conf</code> and{" "}
          <code>_struct_sheet_range</code> in mmCIF; a file without them is
          drawn as coil. Bonds, including disulfides, are inferred from covalent
          radii; metal ions are left unbonded.
        </p>
        <p>
          The parser is exported too, for structures you want to read without
          drawing them:
        </p>
        <CodeSnippet label="Parser example" code={parse} />
      </section>
      <ExampleSection example={examples["molecule-viewer-controls"]!}>
        <p>
          Pass <code>controls=&#123;false&#125;</code> to hide the menus and
          buttons and <code>sequence=&#123;false&#125;</code> to hide the
          sequence, as the demo at the top does. Without the buttons, your own
          UI can drive the viewer through its ref, which exposes{" "}
          <code>zoom</code>, <code>rotate</code> and <code>reset</code>. When
          the file names its PDB ID, the viewer links the entry on RCSB PDB;
          pass <code>attribution=&#123;false&#125;</code> to hide it.
        </p>
      </ExampleSection>
      <ExampleSection example={examples["molecule-viewer-selection"]!}>
        <p>
          Selection is controlled and works on residues: pass{" "}
          <code>selectedId</code>, such as <code>A:16</code> (chain, author
          number and insertion code), and update it from{" "}
          <code>onSelectionChange</code>, which also passes the residue record.
          The selected residue keeps its colour while everything else fades; in
          the cartoon style its atoms are drawn as ball and stick on the ribbon.
          The sequence strip below the stage selects the same way.
        </p>
      </ExampleSection>
      <ExampleSection example={examples["molecule-viewer-spacefill"]!}>
        <p>
          The style and colour menus are uncontrolled by default; this example
          only sets where they start. To control them, set{" "}
          <code>representation</code> to <code>cartoon</code>,{" "}
          <code>ball-and-stick</code> or <code>spacefill</code>, or{" "}
          <code>colorScheme</code> to <code>secondary</code>, <code>chain</code>
          , <code>element</code>, <code>residue</code> or <code>rainbow</code>,
          with their change callbacks. Ligands are always drawn as atoms; water
          is hidden unless you pass <code>water</code>.
        </p>
      </ExampleSection>
      <section className="flex flex-col gap-4">
        <DocsHeading id="accessibility">Accessibility</DocsHeading>
        <p>
          Drag or the arrow keys rotate; scroll, pinch, plus and minus zoom. The
          sequence strip is one tab stop, moved with the arrow keys, Home and
          End, and is the keyboard and screen-reader route to selecting a
          residue.
        </p>
        <p className="text-sm text-muted-foreground">
          WebGL is required. When it cannot start, or the file cannot be read,
          the viewer shows a message with a retry button. Very large assemblies
          (hundreds of thousands of atoms) work but are slow to build; trim them
          to the chains you need first.
        </p>
      </section>
      <PropsTable item="molecule-viewer" />
      <DocsPager href="/docs/components/molecule-viewer" />
    </div>
  )
}
