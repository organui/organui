import Link from "next/link"
import { CodeBlockCommand } from "@/components/code-block-command"
import { CodeSnippet } from "@/components/code-snippet"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import { docsMetadata, registryNamespace, shadcn } from "@/lib/registry"
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
      <DocsHeader href="/docs/installation" title="Installation">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          Configure a project once, then add components by name.
        </p>
      </DocsHeader>
      <section className="flex flex-col gap-4">
        <DocsHeading id="requirements">Requirements</DocsHeading>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          <li>React 19 and Tailwind CSS 4.</li>
          <li>
            A project initialised with shadcn, in any of its styles: Base UI,
            such as <code>base-nova</code>, or Radix, which needs the namespace
            below (see{" "}
            <Link href="/docs/base-ui#radix" className="underline">
              Base UI and Radix
            </Link>
            ).
          </li>
          <li>
            Any framework shadcn supports. Next.js and Vite are tested on every
            change; blocks add a page only in frameworks with file routing.
          </li>
        </ul>
        <p>
          For a step-by-step setup, follow the{" "}
          <Link href="/docs/installation/next">Next.js</Link> or{" "}
          <Link href="/docs/installation/vite">Vite</Link> guide. Otherwise, for
          a new project, run:
        </p>
        <CodeBlockCommand label="Initialise shadcn" command={init} />
        <p className="text-sm text-muted-foreground">
          The commands use Bun and pin the shadcn version the registry is tested
          with. <code>npx</code>, <code>pnpm dlx</code> and{" "}
          <code>yarn dlx</code> work the same way.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="add-components">Add components</DocsHeading>
        <p>
          <code>@organui</code> is listed in shadcn&apos;s registry directory,
          so the CLI knows it without any setup. Install any item by name:
        </p>
        <CodeBlockCommand
          label="Install by name"
          command={`bunx ${shadcn} add @organui/heart`}
        />
        <p>
          Or by its address, which works the same, including for items that
          depend on other OrganUI items:
        </p>
        <CodeBlockCommand
          label="Install by URL"
          command={`bunx ${shadcn} add ${site.url}/r/heart.json`}
        />
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
        <DocsHeading id="namespace">Register the namespace</DocsHeading>
        <p>
          Radix projects add the namespace to <code>components.json</code>, so
          the CLI fetches the Radix build of each item. Base UI projects can
          skip it, or add it to pin the address, point it at a copy you host, or
          use a shadcn CLI older than the directory:
        </p>
        <CodeSnippet
          label="Registry namespace configuration"
          code={registryNamespace}
          lang="json"
        />
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="from-github">Install from GitHub</DocsHeading>
        <p>
          The repository is also a GitHub registry, so items install straight
          from source. Append <code>#&lt;commit&gt;</code> to pin a version;
          OrganUI dependencies still resolve through <code>@organui</code>.
        </p>
        <CodeBlockCommand
          label="Install from GitHub"
          command={`bunx ${shadcn} add organui/organui/anatomy-tree`}
        />
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="after-install">After install</DocsHeading>
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
