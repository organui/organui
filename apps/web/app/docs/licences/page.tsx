import Link from "next/link"
import { DocsPager } from "@/components/docs-pager"
import { organModels } from "@/lib/organ-models"
import { docsMetadata, registryItems } from "@/lib/registry"
import { site } from "@/lib/site"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

export const metadata = docsMetadata(
  "Licences",
  "OrganUI code is MIT; each 3D model, sample structure and dataset keeps its own licence.",
  "/docs/licences"
)

const notices = `${site.repository}/blob/master/THIRD_PARTY_NOTICES.md`

export default async function Page() {
  // Every item built on the organ viewer, in sidebar order, with the credit
  // its model carries.
  const models = await Promise.all(
    registryItems
      .filter(({ model }) => model)
      .map(async (item) => ({ item, model: await organModels[item.name]!() }))
  )
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Getting started
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Licences</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          The code is MIT. The models and data it shows keep their own licences.
        </p>
      </header>
      <section className="flex flex-col gap-4">
        <h2 id="code" className="text-2xl font-semibold">
          Code
        </h2>
        <p>
          Every registry item, and this website, is{" "}
          <a
            className="underline"
            href={`${site.repository}/blob/master/LICENSE`}
          >
            MIT
          </a>
          . Installed source is yours to change and ship. Its dependencies, such
          as three.js and Base UI, keep their own licences; see the{" "}
          <a className="underline" href={notices}>
            third-party notices
          </a>
          .
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="models" className="text-2xl font-semibold">
          3D models
        </h2>
        <p>
          Organs and the cell load a GLB model at runtime; the component file
          holds only its structures, views and credit. The models are under CC
          BY, CC BY-SA or CC0, per model. The BY licences require credit, and
          ShareAlike ones also cover adapted versions of the model.
        </p>
        <p>
          The viewer shows each model&apos;s credit, linked to its licence and
          source. Passing <code>attribution=&#123;false&#125;</code> hides it;
          if you do, credit the model elsewhere in your interface, as its
          licence requires. A model you serve yourself keeps the same licence.
        </p>
        <p>
          The thumbnails in the{" "}
          <Link href="/docs/components/organs" className="underline">
            organs gallery
          </Link>{" "}
          are renderings of these models, so each is shared under its
          model&apos;s licence and credited in the table below.
        </p>
        <Table
          tabIndex={0}
          aria-label="Model licences"
          className="focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
        >
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Licence</TableHead>
              <TableHead>Credit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map(({ item, model }) => (
              <TableRow key={item.name}>
                <TableCell>
                  <Link href={item.href} className="underline">
                    {item.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <a className="underline" href={model.attribution.licenseUrl}>
                    {model.attribution.license}
                  </a>
                </TableCell>
                <TableCell className="min-w-64 whitespace-normal text-muted-foreground">
                  {model.attribution.credit}{" "}
                  <a className="underline" href={model.attribution.source}>
                    Source
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-sm text-muted-foreground">
          Models from the organ explorer repositories load from commit-pinned
          copies there; the rest are built in the OrganUI repository and served
          from <code>{site.url}/models/</code>, each with an attribution file
          describing its sources and changes.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="data" className="text-2xl font-semibold">
          Sample data
        </h2>
        <ul className="flex list-disc flex-col gap-3 pl-5">
          <li>
            <Link href="/docs/components/molecule-viewer" className="underline">
              Molecule viewer
            </Link>{" "}
            ships no structures. The demo&apos;s crambin (PDB{" "}
            <a className="underline" href="https://www.rcsb.org/structure/1CRN">
              1CRN
            </a>
            ) is wwPDB data under{" "}
            <a
              className="underline"
              href="https://creativecommons.org/publicdomain/zero/1.0/"
            >
              CC0 1.0
            </a>
            ; wwPDB asks that you cite the entry. The viewer shows a
            structure&apos;s ID unless you pass{" "}
            <code>attribution=&#123;false&#125;</code>.
          </li>
          <li>
            <Link href="/docs/components/growth-chart" className="underline">
              Growth chart
            </Link>{" "}
            ships no growth data and no code that downloads it: you pass the
            reference tables. Only this site&apos;s demo fetches the WHO Child
            Growth Standards, © World Health Organization, under{" "}
            <a
              className="underline"
              href="https://www.gnu.org/licenses/gpl-3.0.html"
            >
              GPL-3
            </a>
            ; WHO requires{" "}
            <a
              className="underline"
              href="https://www.who.int/about/policies/publishing/copyright"
            >
              permission for commercial use
            </a>
            .
          </li>
          <li>
            The image viewer&apos;s head phantom, the synthetic ECG, and the
            vital signs, lab results and medication examples are generated or
            written for OrganUI, and MIT like the code.
          </li>
        </ul>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="site" className="text-2xl font-semibold">
          This website
        </h2>
        <p>
          The docs adapt parts of shadcn/ui&apos;s site, whose MIT notice is
          kept beside them in the repository, and use the Geist fonts under the
          SIL Open Font License 1.1, listed in the{" "}
          <a className="underline" href={notices}>
            third-party notices
          </a>
          .
        </p>
      </section>
      <DocsPager href="/docs/licences" />
    </div>
  )
}
