import Link from "next/link"
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
      <header className="flex flex-col gap-4">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Getting started
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Introduction</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          OrganUI is a set of interface components for healthcare and life
          sciences: 3D anatomy, clinical charts, molecules and medical images.
        </p>
      </header>
      <section className="flex flex-col gap-4">
        <h2 id="source-you-own" className="text-2xl font-semibold">
          Source you own
        </h2>
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
        <h2 id="where-to-start" className="text-2xl font-semibold">
          Where to start
        </h2>
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
        <h2 id="not-a-medical-device" className="text-2xl font-semibold">
          Not a medical device
        </h2>
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
