import { expect, test } from "bun:test"
import {
  parseStructure,
  residueCode,
  residueLabel,
  type MolecularStructure,
} from "../registry/base-nova/molecule-viewer/molecule-viewer"
import { dnaBasePairs } from "../registry/base-nova/dna-helix/dna-helix"

const read = (path: string) => Bun.file(new URL(path, import.meta.url)).text()
const crambin = await read("../../../apps/web/public/models/crambin.pdb")

function bonded(structure: MolecularStructure, a: number, b: number) {
  for (let i = 0; i < structure.bonds.length; i += 2) {
    const pair = [structure.bonds[i], structure.bonds[i + 1]]
    if (pair.includes(a) && pair.includes(b)) return true
  }
  return false
}

test("the bundled crambin sample parses with its secondary structure", () => {
  const structure = parseStructure(crambin)
  expect(structure.id).toBe("1CRN")
  expect(structure.title).toContain("CRAMBIN")
  expect(structure.atoms).toHaveLength(327)
  expect(structure.chains).toEqual(["A"])
  expect(structure.residues).toHaveLength(46)
  expect(structure.residues.every(({ kind }) => kind === "protein")).toBe(true)
  expect(structure.residues.map(residueCode).join("")).toBe(
    "TTCCPSIVARSNFNVCRLPGTPEAICATYTGCIIIPGATCPGDYAN"
  )
  const secondary = (from: number, to: number) =>
    structure.residues
      .filter(({ seq }) => seq >= from && seq <= to)
      .map(({ secondary }) => secondary)
  expect(new Set(secondary(7, 19))).toEqual(new Set(["helix"]))
  expect(new Set(secondary(23, 30))).toEqual(new Set(["helix"]))
  expect(new Set(secondary(1, 4))).toEqual(new Set(["sheet"]))
  expect(new Set(secondary(32, 35))).toEqual(new Set(["sheet"]))
  expect(structure.residues.find(({ seq }) => seq === 20)!.secondary).toBe(
    "coil"
  )
  expect(residueLabel(structure.residues[15]!)).toBe("Cys 16 · chain A")
})

test("bonds are inferred from distances, including the three disulfides", () => {
  const structure = parseStructure(crambin)
  const sulfur = (seq: number) =>
    structure.atoms.findIndex(
      (atom) =>
        atom.name === "SG" && structure.residues[atom.residue]!.seq === seq
    )
  for (const [a, b] of [
    [3, 40],
    [4, 32],
    [16, 26],
  ])
    expect(bonded(structure, sulfur(a!), sulfur(b!))).toBe(true)
  expect(bonded(structure, sulfur(3), sulfur(4))).toBe(false)
  // Heavy atoms only: about one bond per atom, plus ring closures.
  const bonds = structure.bonds.length / 2
  expect(bonds).toBeGreaterThan(327)
  expect(bonds).toBeLessThan(360)
  // The backbone is continuous: every peptide C is bonded to the next N.
  for (let i = 0; i < structure.residues.length - 1; i++) {
    const c = structure.residues[i]!.atoms.find(
      (atom) => structure.atoms[atom]!.name === "C"
    )!
    const n = structure.residues[i + 1]!.atoms.find(
      (atom) => structure.atoms[atom]!.name === "N"
    )!
    expect(bonded(structure, c, n)).toBe(true)
  }
})

test("PDB and mmCIF copies of the same entry parse to the same structure", async () => {
  const pdb = parseStructure(await read("fixtures/1a8o.pdb"))
  const cif = parseStructure(await read("fixtures/1a8o.cif"))
  expect(cif.id).toBe("1A8O")
  expect(cif.title).toBe("HIV CAPSID C-TERMINAL DOMAIN")
  expect(cif.atoms.length).toBe(pdb.atoms.length)
  // PDB numbering counts the TER record; everything else matches.
  const unnumbered = ({ atoms }: MolecularStructure) =>
    atoms.map(({ serial: _, ...atom }) => atom)
  expect(unnumbered(cif)).toEqual(unnumbered(pdb))
  expect(cif.residues).toEqual(pdb.residues)
  expect([...cif.bonds]).toEqual([...pdb.bonds])
  // Selenomethionine is a HETATM record but still part of the chain.
  expect(pdb.residues[0]).toMatchObject({ name: "MSE", kind: "protein" })
  expect(pdb.residues.filter(({ kind }) => kind === "water")).toHaveLength(88)
  expect(
    pdb.residues.filter(({ secondary }) => secondary === "helix")
  ).toHaveLength(15 + 9 + 4 + 10 + 7)
})

test("only the first model and alternate location are kept", () => {
  const atom = (serial: number, name: string, alt: string, x: number) =>
    `ATOM  ${String(serial).padStart(5)} ${name.padEnd(4)}${alt}GLY A   1    ${x.toFixed(3).padStart(8)}   0.000   0.000  1.00  0.00           ${name[0]}`
  const text = [
    "MODEL        1",
    atom(1, " N", " ", 0),
    atom(2, " CA", "A", 1.45),
    atom(3, " CA", "B", 1.5),
    atom(4, " C", " ", 2.9),
    "ENDMDL",
    "MODEL        2",
    atom(5, " N", " ", 10),
    "ENDMDL",
  ].join("\n")
  const structure = parseStructure(text)
  expect(structure.atoms.map(({ serial }) => serial)).toEqual([1, 2, 4])
  expect(structure.residues[0]!.id).toBe("A:1")
})

test("mmCIF quoting, text fields and models", () => {
  const text = `data_TEST
_struct.title
;A multi-line
title
;
loop_
_atom_site.group_PDB
_atom_site.id
_atom_site.type_symbol
_atom_site.label_atom_id
_atom_site.label_alt_id
_atom_site.label_comp_id
_atom_site.label_asym_id
_atom_site.label_seq_id
_atom_site.Cartn_x
_atom_site.Cartn_y
_atom_site.Cartn_z
_atom_site.auth_seq_id
_atom_site.auth_asym_id
_atom_site.pdbx_PDB_model_num
ATOM 1 P P . DG B 1 0.0 0.0 0.0 7 C 1
ATOM 2 C "C4'" . DG B 1 1.0 0.0 0.0 7 C 1
ATOM 3 O "O5'" . DG B 1 9.0 0.0 0.0 7 C 2
`
  const structure = parseStructure(text)
  expect(structure.id).toBe("TEST")
  expect(structure.title).toBe("A multi-line\ntitle")
  expect(structure.atoms.map(({ name }) => name)).toEqual(["P", "C4'"])
  // Author chain and numbering win over label ones.
  expect(structure.residues[0]).toMatchObject({
    id: "C:7",
    kind: "nucleic",
  })
  expect(residueCode(structure.residues[0]!)).toBe("G")
})

test("a file without coordinates is rejected", () => {
  expect(() => parseStructure("HEADER    EMPTY\nEND\n")).toThrow(
    "no atom coordinates"
  )
})

test("DNA base pairs follow Watson–Crick pairing", () => {
  expect(dnaBasePairs("at gc\n")).toEqual([
    { index: 0, base: "A", partner: "T", hydrogenBonds: 2 },
    { index: 1, base: "T", partner: "A", hydrogenBonds: 2 },
    { index: 2, base: "G", partner: "C", hydrogenBonds: 3 },
    { index: 3, base: "C", partner: "G", hydrogenBonds: 3 },
  ])
  expect(() => dnaBasePairs("ATGU")).toThrow("only A, C, G and T")
})
