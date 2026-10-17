import {
  codeBlock,
  docsMetadata,
  registryNamespace,
  shadcn,
} from "@/lib/registry"
import { site } from "@/lib/site"
import { Example } from "./example"

export const metadata = docsMetadata(
  "Molecule viewer",
  "A three.js viewer for PDB and mmCIF structures with cartoon, ball and stick and spacefill styles, residue selection and a sequence strip.",
  "/docs/molecule-viewer"
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

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Components / Molecular
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Molecule viewer
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Open a protein or nucleic acid structure from the Protein Data Bank
          and explore it residue by residue. The viewer parses PDB and mmCIF
          text itself, so it needs nothing beyond three.js.
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
          {`bunx ${shadcn} add ${site.url}/r/molecule-viewer.json`}
        </pre>
        <p>
          To install by name, add the OrganUI namespace to{" "}
          <code>components.json</code> and run{" "}
          <code>bunx {shadcn} add @organui/molecule-viewer</code>, or install
          from GitHub with{" "}
          <code>bunx {shadcn} add organui/organui/molecule-viewer</code>.
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
          plus shadcn&apos;s <code>alert</code>, <code>button</code>,{" "}
          <code>select</code> and <code>tooltip</code> for its controls. It uses
          your theme tokens and installs no global styles.
        </p>
        <a className="underline" href="/r/molecule-viewer.json">
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Load a structure</h2>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Usage example"
          className={codeBlock}
        >
          {usage}
        </pre>
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
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Behaviour</h2>
        <p>
          Selection is controlled and works on residues: pass{" "}
          <code>selectedId</code>, such as <code>A:16</code> (chain, author
          number and insertion code), and update it from{" "}
          <code>onSelectionChange</code>, which also passes the residue record.
          The selected residue keeps its colour while everything else fades; in
          the cartoon style its atoms are drawn as ball and stick on the ribbon.
          The sequence strip below the stage selects the same way and is one tab
          stop, moved with the arrow keys, Home and End.
        </p>
        <p>
          The style and colour menus are uncontrolled by default. Set{" "}
          <code>representation</code> (<code>cartoon</code>,{" "}
          <code>ball-and-stick</code>, <code>spacefill</code>) or{" "}
          <code>colorScheme</code> (<code>secondary</code>, <code>chain</code>,{" "}
          <code>element</code>, <code>residue</code>, <code>rainbow</code>) with
          their change callbacks to control them. Ligands are always drawn as
          atoms; water is hidden unless you pass <code>water</code>.
        </p>
        <p>
          Drag or the arrow keys rotate; scroll, pinch, plus and minus zoom. The
          ref exposes <code>zoom</code>, <code>rotate</code> and{" "}
          <code>reset</code>. When the file names its PDB ID, the viewer links
          the entry on RCSB PDB; pass <code>attribution=&#123;false&#125;</code>{" "}
          to hide it.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Use the parser on its own</h2>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Parser example"
          className={codeBlock}
        >
          {parse}
        </pre>
        <p className="text-sm text-muted-foreground">
          WebGL is required. When it cannot start, or the file cannot be read,
          the viewer shows a message with a retry button. Very large assemblies
          (hundreds of thousands of atoms) work but are slow to build; trim them
          to the chains you need first.
        </p>
      </section>
    </div>
  )
}
