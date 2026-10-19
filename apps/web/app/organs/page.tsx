import Link from "next/link"
import { OrganGallery, OrganPreview } from "@/components/organ-gallery"
import { SiteHeader } from "@/components/site-header"
import thumbnails from "@/lib/organ-thumbnails.json"
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

type Thumbnail = (typeof thumbnails)[keyof typeof thumbnails]

const thumbnailOf = (name: string) =>
  (thumbnails as Record<string, Thumbnail | undefined>)[name]

export default function Page() {
  return (
    <div className="min-h-svh">
      <SiteHeader />
      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6">
        <header className="flex flex-col gap-4">
          <h1 className="text-4xl font-semibold tracking-tight">Organs</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            {organs.length} organs, each a component on the shared{" "}
            <Link href="/docs/components/organ-viewer" className="underline">
              organ viewer
            </Link>
            . Pictures are still renderings; open one to load it in 3D.
          </p>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Each thumbnail is a rendering of its organ&apos;s model and is
            shared under that model&apos;s licence, credited on its card. See{" "}
            <Link href="/docs/licences" className="underline">
              Licences
            </Link>{" "}
            for every model.
          </p>
        </header>
        <nav
          aria-label="Body systems"
          className="sticky top-14 z-10 -mx-4 overflow-x-auto border-b bg-background/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6"
        >
          <ul className="flex w-max gap-2 text-sm">
            {bodySystems.map((system) => (
              <li key={system.id}>
                <a
                  href={`#${system.id}`}
                  className="block rounded-full border px-3 py-1 whitespace-nowrap hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
                >
                  {system.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <OrganGallery>
          {bodySystems.map((system) => (
            <section
              key={system.id}
              aria-labelledby={system.id}
              className="flex flex-col gap-4"
            >
              <h2
                id={system.id}
                className="scroll-mt-28 text-2xl font-semibold"
              >
                {system.title}
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {organs
                  .filter((item) => item.system?.id === system.id)
                  .map((item) => {
                    const thumbnail = thumbnailOf(item.name)
                    return (
                      <li
                        key={item.name}
                        className="flex min-w-0 flex-col gap-3 rounded-xl border p-4"
                      >
                        <OrganPreview
                          name={item.name}
                          title={item.title}
                          thumbnail={
                            thumbnail && {
                              src: thumbnail.file,
                              width: thumbnail.width,
                              height: thumbnail.height,
                            }
                          }
                        />
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
                        {thumbnail && (
                          <p className="text-xs text-muted-foreground">
                            {thumbnail.credit}{" "}
                            <a
                              className="underline"
                              href={thumbnail.licenseUrl}
                            >
                              {thumbnail.license}
                            </a>
                            {" · "}
                            <a className="underline" href={thumbnail.source}>
                              Source
                            </a>
                          </p>
                        )}
                      </li>
                    )
                  })}
              </ul>
            </section>
          ))}
        </OrganGallery>
      </main>
    </div>
  )
}
