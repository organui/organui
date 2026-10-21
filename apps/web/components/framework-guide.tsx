import type { ReactNode } from "react"
import Link from "next/link"
import { CodeBlockCommand } from "@/components/code-block-command"
import { CodeSnippet } from "@/components/code-snippet"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import { shadcn } from "@/lib/registry"

// A framework's setup guide: create the project, add a component, use it.
// The steps match the projects the registry's tests install into.
export function FrameworkGuide({
  href,
  name,
  template,
  file,
  usage,
  blocks,
}: {
  href: string
  name: string
  template: "next" | "vite"
  file: string
  usage: string
  blocks: ReactNode
}) {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href={href} title={name}>
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          Create a {name} app with shadcn, then add OrganUI components to it.
        </p>
      </DocsHeader>
      <ol className="steps">
        <li>
          <DocsHeading id="create-project">Create the project</DocsHeading>
          <p>
            This creates a {name} app with Tailwind CSS and shadcn&apos;s{" "}
            <code>base-nova</code> style, built on Base UI. For Radix, use{" "}
            <code>radix-nova</code> and add the namespace in{" "}
            <Link href="/docs/base-ui#radix">Radix projects</Link>.
          </p>
          <CodeBlockCommand
            label={`Create a ${name} project`}
            command={`bunx ${shadcn} init -t ${template} --preset base-nova -n my-app`}
          />
          <p className="text-sm text-muted-foreground">
            For an existing {name} app, run{" "}
            <code>bunx {shadcn} init --preset base-nova</code> in its folder
            instead.
          </p>
        </li>
        <li>
          <DocsHeading id="add-components">Add components</DocsHeading>
          <p>
            From the project folder, add any component by name. Its OrganUI and
            shadcn dependencies install in the same run.
          </p>
          <CodeBlockCommand
            label="Add a component"
            command={`bunx ${shadcn} add @organui/heart`}
          />
        </li>
        <li>
          <DocsHeading id="use-components">Use them</DocsHeading>
          <p>
            Import the component from your components directory, here in{" "}
            <code>{file}</code>:
          </p>
          <CodeSnippet label={`${file} example`} title={file} code={usage} />
        </li>
        <li>
          <DocsHeading id="blocks">Blocks</DocsHeading>
          {blocks}
        </li>
      </ol>
      <DocsPager href={href} />
    </div>
  )
}
