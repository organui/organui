import Link from "next/link"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import {
  componentGroups,
  docsMetadata,
  guides,
  organs,
  registryBlocks,
  registryItems,
} from "@/lib/registry"

export const metadata = docsMetadata(
  "Introduction",
  "Editable healthcare interface components distributed through a shadcn registry.",
  "/docs"
)

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href="/docs" title="Introduction">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          OrganUI is a set of interface components for healthcare and life
          sciences: 3D anatomy, clinical charts, molecules and medical images.
        </p>
      </DocsHeader>
      <section className="flex flex-col gap-4">
        <DocsHeading id="source-you-own">Source you own</DocsHeading>
        <p>
          OrganUI is not a package you import. Like shadcn/ui, each component is
          distributed as source through a shadcn-compatible registry: the shadcn
          CLI copies it into your project, with the shadcn components it builds
          on, and from then on it is your code to read and change.
        </p>
        <p>
          The registry has {registryItems.length} components and{" "}
          {registryBlocks.length} blocks.{" "}
          {componentGroups
            .map(
              ({ id, title }) =>
                `${title}: ${registryItems.filter((item) => item.group === id).length}`
            )
            .join(", ")}
          , of which {organs.length} are organs built on one shared 3D viewer.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="where-to-start">Where to start</DocsHeading>
        <ul className="flex flex-col gap-3">
          {guides.slice(1).map((guide) => (
            <li key={guide.href}>
              <Link href={guide.href} className="font-medium underline">
                {guide.title}
              </Link>
              <span className="text-muted-foreground">
                {" "}
                — {guide.description}
              </span>
            </li>
          ))}
          <li>
            <Link href="/docs/components" className="font-medium underline">
              Components
            </Link>
            <span className="text-muted-foreground">
              {" "}
              — every component with a preview and its install command.
            </span>
          </li>
          <li>
            <Link href="/blocks" className="font-medium underline">
              Blocks
            </Link>
            <span className="text-muted-foreground">
              {" "}
              — whole layouts, such as a viewer with its anatomy panel.
            </span>
          </li>
        </ul>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="not-a-medical-device">
          Not a medical device
        </DocsHeading>
        <p>
          The components, models and sample data are for education, prototyping
          and interfaces around clinical software. None of them is a medical
          device, and none is meant for diagnosis or clinical decisions.
        </p>
      </section>
      <DocsPager href="/docs" />
    </div>
  )
}
