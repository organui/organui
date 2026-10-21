import { Fragment } from "react"
import Link from "next/link"
import { CodeBlockCommand } from "@/components/code-block-command"
import { CodeCollapsible } from "@/components/code-collapsible"
import { CodeSnippet } from "@/components/code-snippet"
import { InstallationTabs } from "@/components/installation-tabs"
import { LibraryView } from "@/components/library-switcher"
import type { Library } from "@/lib/libraries"
import { registryNamespace, shadcn } from "@/lib/registry"
import { readRegistryItem } from "@/lib/registry-item"

// A component's Installation section: the CLI command, or the steps to do
// by hand with the same files the CLI would write. Each library gets its
// own, as the registry serves it.
export async function ComponentInstallation({
  name,
  command,
  css,
  oneLibrary = false,
}: {
  name: string
  command: string
  // CSS the item adds to the project's CSS file, for a manual install.
  css?: string
  // Items with no shadcn or OrganUI dependencies install the same in both.
  oneLibrary?: boolean
}) {
  if (oneLibrary)
    return (
      <Installation name={name} command={command} css={css} library="base" />
    )
  return (
    <LibraryView
      base={
        <Installation name={name} command={command} css={css} library="base" />
      }
      radix={
        <Installation
          name={name}
          command={`bunx ${shadcn} add @organui/${name}`}
          css={css}
          library="radix"
        />
      }
    />
  )
}

async function Installation({
  name,
  command,
  css,
  library,
}: {
  name: string
  command: string
  css?: string
  library: Library
}) {
  const item = await readRegistryItem(name, library)
  const organui = item.registryDependencies
    .filter((dependency) => dependency.startsWith("@organui/"))
    .map((dependency) => dependency.replace("@organui/", ""))
  return (
    <InstallationTabs
      command={
        library === "radix" ? (
          <div className="flex flex-col gap-4">
            <p>
              Radix projects add OrganUI to <code>components.json</code> once,
              so the CLI fetches the Radix build of each item:
            </p>
            <CodeSnippet
              label="Registry namespace configuration"
              code={registryNamespace}
              lang="json"
            />
            <p>Then install it by name:</p>
            <CodeBlockCommand label="Installation command" command={command} />
          </div>
        ) : (
          <CodeBlockCommand label="Installation command" command={command} />
        )
      }
      manual={
        <ol className="steps">
          {item.dependencies.length > 0 && (
            <li>
              <p>Install the following dependencies:</p>
              <CodeBlockCommand
                label="Dependencies"
                command={`bun add ${item.dependencies.join(" ")}`}
              />
            </li>
          )}
          {item.registryDependencies.length > 0 && (
            <li>
              <p>
                Add the components it builds on
                {organui.length > 0 && (
                  <>
                    {" "}
                    (see{" "}
                    {organui.map((dependency, index) => (
                      <Fragment key={dependency}>
                        {index > 0 && ", "}
                        <Link href={`/docs/components/${dependency}`}>
                          {dependency}
                        </Link>
                      </Fragment>
                    ))}
                    )
                  </>
                )}
                :
              </p>
              <CodeBlockCommand
                label="Components it builds on"
                command={`bunx ${shadcn} add ${item.registryDependencies.join(" ")}`}
              />
            </li>
          )}
          {css && (
            <li>
              <p>Add the following to your global CSS file.</p>
              <CodeSnippet
                label="CSS to add"
                code={css}
                lang="css"
                contentClassName="max-h-96"
              />
            </li>
          )}
          {item.files.length > 0 && (
            <>
              <li>
                <p>Copy and paste the following code into your project.</p>
                {item.files.map((file) => {
                  const snippet = (
                    <CodeSnippet
                      key={file.installed}
                      title={file.installed}
                      label={`${file.installed} source`}
                      code={file.content}
                    />
                  )
                  return file.content.split("\n").length > 16 ? (
                    <CodeCollapsible
                      key={file.installed}
                      label={file.installed}
                    >
                      {snippet}
                    </CodeCollapsible>
                  ) : (
                    snippet
                  )
                })}
              </li>
              <li>
                <p>Update the import paths to match your project setup.</p>
              </li>
            </>
          )}
        </ol>
      }
    />
  )
}
