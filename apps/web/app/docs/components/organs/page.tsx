import Image from "next/image"
import Link from "next/link"
import { DocsPager } from "@/components/docs-pager"
import { docsMetadata, organs, organsPage } from "@/lib/registry"

export const metadata = docsMetadata(
  organsPage.title,
  organsPage.description,
  organsPage.href
)

export default function Page() {
  return (
    <div data-docs-wide className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Components / Organs
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Organs</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {organs.length} organs, each a component on the shared{" "}
          <Link href="/docs/components/organ-viewer" className="underline">
            organ viewer
          </Link>
          . Open one to explore it in 3D.
        </p>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Each picture is a rendering of its organ&apos;s model and is shared
          under that model&apos;s licence. The credit and licence of every model
          are listed in{" "}
          <Link href="/docs/licences" className="underline">
            Licences
          </Link>
          .
        </p>
      </header>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
        {organs.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className="group flex flex-col gap-2 rounded-xl focus-visible:outline-2 focus-visible:outline-ring"
            >
              <Image
                src={`/organs/${item.name}.webp`}
                width={640}
                height={480}
                alt=""
                sizes="(min-width: 1280px) 14rem, (min-width: 1024px) 20vw, (min-width: 640px) 30vw, 50vw"
                className="aspect-[4/3] w-full rounded-xl bg-muted/40 object-contain transition-transform group-hover:scale-[1.03]"
              />
              <span className="text-sm font-medium">{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
      <DocsPager href={organsPage.href} />
    </div>
  )
}
