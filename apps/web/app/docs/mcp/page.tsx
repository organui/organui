import Link from "next/link"
import { CodeBlockCommand } from "@/components/code-block-command"
import { CodeSnippet } from "@/components/code-snippet"
import { ContentTabs } from "@/components/content-tabs"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import { docsMetadata, registryNamespace, shadcn } from "@/lib/registry"

export const metadata = docsMetadata(
  "MCP",
  "Browse and install OrganUI components from an AI assistant with the shadcn MCP server, and read the docs as Markdown.",
  "/docs/mcp"
)

const clients = [
  { value: "claude", title: "Claude Code" },
  { value: "cursor", title: "Cursor" },
  { value: "vscode", title: "VS Code" },
  { value: "codex", title: "Codex" },
  { value: "opencode", title: "OpenCode" },
]

const prompts = [
  "Show me the components in the @organui registry",
  "Add the heart from @organui and show it on the home page",
  "Build an anatomy explorer with @organui/organ-viewer and @organui/anatomy-tree",
  "Add a vital signs panel from @organui to the patient page",
]

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader href="/docs/mcp" title="MCP">
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          Browse, search and install OrganUI components from an AI assistant,
          and give it the docs as Markdown.
        </p>
      </DocsHeader>
      <section className="flex flex-col gap-4">
        <DocsHeading id="mcp-server">MCP server</DocsHeading>
        <p>
          shadcn&apos;s MCP server lets an assistant read any registry. It finds{" "}
          <code>@organui</code> through shadcn&apos;s registry directory, so
          after setup you can ask for OrganUI components by name. Run the
          command for your client in your project:
        </p>
        <ContentTabs
          label="MCP client"
          tabs={clients.map(({ value, title }) => ({
            value,
            title,
            content: (
              <CodeBlockCommand
                label={`Set up the MCP server for ${title}`}
                command={`bunx ${shadcn} mcp init --client ${value}`}
              />
            ),
          }))}
        />
        <p>Restart the client, then try a prompt such as:</p>
        <ul className="flex list-disc flex-col gap-2 ps-5">
          {prompts.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ul>
        <p className="text-sm text-muted-foreground">
          See{" "}
          <a href="https://ui.shadcn.com/docs/mcp">shadcn&apos;s MCP docs</a>{" "}
          for each client&apos;s configuration file.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="namespace">Pin the registry (optional)</DocsHeading>
        <p>
          To point the assistant at a copy of the registry you host, or to work
          with a shadcn CLI older than the directory, add the namespace to{" "}
          <code>components.json</code>, as in{" "}
          <Link href="/docs/installation#namespace">Installation</Link>:
        </p>
        <CodeSnippet
          label="Registry namespace configuration"
          code={registryNamespace}
          lang="json"
        />
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="markdown">Docs as Markdown</DocsHeading>
        <p>
          Every docs page is also served as Markdown at its address plus{" "}
          <code>.md</code>, such as{" "}
          <a href="/docs/components/heart.md">/docs/components/heart.md</a>, and{" "}
          <a href="/llms.txt">/llms.txt</a> lists them all. Give either to an
          assistant that reads the web. On any page, Copy Page copies the same
          Markdown, and its menu opens the page in ChatGPT or Claude.
        </p>
      </section>
      <DocsPager href="/docs/mcp" />
    </div>
  )
}
