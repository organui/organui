import Image from "next/image"
import Link from "next/link"
import { DocsPager } from "@/components/docs-pager"
import { organModels } from "@/lib/organ-models"
import {
  bodySystems,
  codeBlock,
  docsMetadata,
  organs,
  organsPage,
} from "@/lib/registry"

export const metadata = docsMetadata(
  organsPage.title,
  organsPage.description,
  organsPage.href
)

export default async function Page() {
  // The credit each thumbnail needs, read from the model it shows.
  const credits = new Map(
    await Promise.all(
      organs.map(
        async ({ name }) =>
          [name, (await organModels[name]!()).attribution] as const
      )
    )
  )
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Components / Organs
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Organs</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {organs.length} organs by body system, each a component on the shared{" "}
          <Link href="/docs/components/organ-viewer" className="underline">
            organ viewer
          </Link>
          . Open one to explore it in 3D.
        </p>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Each picture is a rendering of its organ&apos;s model and is shared
          under that model&apos;s licence, credited on its card. See{" "}
          <Link href="/docs/licences" className="underline">
            Licences
          </Link>{" "}
          for every model.
        </p>
      </header>
      {bodySystems.map((system) => (
        <section
          key={system.id}
          aria-labelledby={system.id}
          className="flex flex-col gap-4"
        >
          <h2 id={system.id} className="scroll-mt-20 text-2xl font-semibold">
            {system.title}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {organs
              .filter((item) => item.system?.id === system.id)
              .map((item) => {
                const credit = credits.get(item.name)!
                return (
                  <li
                    key={item.name}
                    className="flex min-w-0 flex-col gap-3 rounded-xl border p-4"
                  >
                    {/* The heading's link names the page; this one repeats
                        it for pointers only. */}
                    <Link
                      href={item.href}
                      tabIndex={-1}
                      aria-hidden="true"
                      className="group overflow-hidden rounded-xl border bg-muted/40"
                    >
                      <Image
                        src={`/organs/${item.name}.webp`}
                        width={640}
                        height={480}
                        alt=""
                        unoptimized
                        sizes="(min-width: 1280px) 22rem, (min-width: 640px) 45vw, 100vw"
                        className="aspect-[4/3] w-full object-contain transition-transform group-hover:scale-[1.03]"
                      />
                    </Link>
                    <h3 className="text-lg font-semibold">
                      <Link
                        href={item.href}
                        className="underline-offset-4 hover:underline"
                      >
                        {item.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <pre
                      tabIndex={0}
                      role="region"
                      aria-label={`Install ${item.title}`}
                      className={codeBlock}
                    >
                      {item.install}
                    </pre>
                    <p className="text-xs text-muted-foreground">
                      {credit.credit}{" "}
                      <a className="underline" href={credit.licenseUrl}>
                        {credit.license}
                      </a>
                      {" · "}
                      <a className="underline" href={credit.source}>
                        Source
                      </a>
                    </p>
                  </li>
                )
              })}
          </ul>
        </section>
      ))}
      <DocsPager href={organsPage.href} />
    </div>
  )
}
