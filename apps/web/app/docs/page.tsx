import type { Metadata } from "next"
import Link from "next/link"
import { RegistryPreview } from "@/components/registry-preview"
import {
  codeBlock,
  registryItems,
  registryNamespace,
  shadcn,
} from "@/lib/registry"
import { site } from "@/lib/site"

const description =
  "Editable healthcare interface components distributed through a shadcn registry."

export const metadata: Metadata = {
  title: "Components",
  description,
  alternates: { canonical: "/docs" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Components — OrganUI",
    description,
    url: "/docs",
    images: [
      { url: site.socialImage, alt: site.title, width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@organui",
    title: "Components — OrganUI",
    description,
    images: [
      { url: site.socialImage, alt: site.title, width: 1200, height: 630 },
    ],
  },
}

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Getting started
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Components</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          OrganUI components are distributed as source through a
          shadcn-compatible registry. Each one installs into your project, where
          you own and edit it.
        </p>
      </header>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Set up</h2>
        <p>
          Start from a React 19 project configured with shadcn, Tailwind CSS 4
          and the Base UI / Nova theme. To install components by name, add the
          OrganUI namespace to <code>components.json</code>.
        </p>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Registry namespace configuration"
          className={codeBlock}
        >
          {registryNamespace}
        </pre>
        <p>
          Then run <code>bunx {shadcn} add @organui/&lt;name&gt;</code>, or
          install any item by its full URL as listed below. The repository is
          also a GitHub registry:{" "}
          <code>bunx {shadcn} add organui/organui/&lt;name&gt;</code> installs
          straight from source.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Registry</h2>
        <ul className="grid gap-4">
          {registryItems.map((item) => (
            <li
              key={item.name}
              className="flex min-w-0 flex-col gap-3 rounded-xl border p-5"
            >
              <h3 className="text-lg font-semibold">
                <Link
                  href={item.href}
                  className="underline-offset-4 hover:underline"
                >
                  {item.title}
                </Link>
              </h3>
              <p className="text-muted-foreground">{item.description}</p>
              <RegistryPreview name={item.name} title={item.title} />
              <pre
                tabIndex={0}
                role="region"
                aria-label={`Install ${item.title}`}
                className={codeBlock}
              >
                {item.install}
              </pre>
              <a className="text-sm underline" href={item.json}>
                {item.name}.json
              </a>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          The full catalog is served at{" "}
          <a className="underline" href="/r/registry.json">
            /r/registry.json
          </a>
          .
        </p>
      </section>
    </div>
  )
}
