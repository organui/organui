import Link from "next/link"
import { DocsPager } from "@/components/docs-pager"
import {
  codeBlock,
  docsMetadata,
  registryNamespace,
  shadcn,
} from "@/lib/registry"
import { site } from "@/lib/site"

export const metadata = docsMetadata(
  "Installation",
  "Set up a project for OrganUI and install components by name or address.",
  "/docs/installation"
)

const init = `bunx ${shadcn} init --preset base-nova`

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Getting started
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Installation</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Configure a project once, then add components by name.
        </p>
      </header>
      <section className="flex flex-col gap-4">
        <h2 id="requirements" className="text-2xl font-semibold">
          Requirements
        </h2>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>React 19 and Tailwind CSS 4.</li>
          <li>
            A project initialised with shadcn, using one of its{" "}
            <Link href="/docs/base-ui" className="underline">
              Base UI styles
            </Link>
            , such as <code>base-nova</code>. Items with controls compose
            shadcn&apos;s components through Base UI.
          </li>
          <li>
            Any framework shadcn supports. Next.js and Vite are tested on every
            change; blocks add a page only in frameworks with file routing.
          </li>
        </ul>
        <p>For a new project, run:</p>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Initialise shadcn"
          className={codeBlock}
        >
          {init}
        </pre>
        <p className="text-sm text-muted-foreground">
          The commands use Bun and pin the shadcn version the registry is tested
          with. <code>npx</code>, <code>pnpm dlx</code> and{" "}
          <code>yarn dlx</code> work the same way.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="add-components" className="text-2xl font-semibold">
          Add components
        </h2>
        <p>
          <code>@organui</code> is listed in shadcn&apos;s registry directory,
          so the CLI knows it without any setup. Install any item by name:
        </p>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Install by name"
          className={codeBlock}
        >
          {`bunx ${shadcn} add @organui/heart`}
        </pre>
        <p>
          Or by its address, which works the same, including for items that
          depend on other OrganUI items:
        </p>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Install by URL"
          className={codeBlock}
        >
          {`bunx ${shadcn} add ${site.url}/r/heart.json`}
        </pre>
        <p>
          The CLI installs each item&apos;s dependencies in the same run: other
          OrganUI items, such as the shared organ viewer behind every organ, and
          the shadcn components they use. Each component page shows its command,
          and the full catalog is served at{" "}
          <a className="underline" href="/r/registry.json">
            /r/registry.json
          </a>
          .
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="namespace" className="text-2xl font-semibold">
          Register the namespace (optional)
        </h2>
        <p>
          To pin the registry address, point it at a copy you host, or use a
          shadcn CLI older than the directory, add the namespace to{" "}
          <code>components.json</code> yourself:
        </p>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Registry namespace configuration"
          className={codeBlock}
        >
          {registryNamespace}
        </pre>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="from-github" className="text-2xl font-semibold">
          Install from GitHub
        </h2>
        <p>
          The repository is also a GitHub registry, so items install straight
          from source. Append <code>#&lt;commit&gt;</code> to pin a version;
          OrganUI dependencies still resolve through <code>@organui</code>.
        </p>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Install from GitHub"
          className={codeBlock}
        >
          {`bunx ${shadcn} add organui/organui/anatomy-tree`}
        </pre>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="after-install" className="text-2xl font-semibold">
          After install
        </h2>
        <p>
          The files land in your components directory, or in your UI directory
          for <code>registry:ui</code> items, and the CLI prints a link to the
          item&apos;s page. Import them from there, and change them as you would
          your own code. To pick up a later version, run <code>add</code> again
          and review the diff.
        </p>
      </section>
      <DocsPager href="/docs/installation" />
    </div>
  )
}
