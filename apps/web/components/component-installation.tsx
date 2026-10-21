import { Fragment } from "react"
import Link from "next/link"
import { CodeBlockCommand } from "@/components/code-block-command"
import { CodeSnippet } from "@/components/code-snippet"
import { InstallationTabs } from "@/components/installation-tabs"
import { shadcn } from "@/lib/registry"
import { readRegistryItem } from "@/lib/registry-item"

// A component's Installation section: the CLI command, or the steps to do
// by hand with the same files the CLI would write.
export async function ComponentInstallation({
  name,
  command,
}: {
  name: string
  command: string
}) {
  const item = await readRegistryItem(name)
  const organui = item.registryDependencies
    .filter((dependency) => dependency.startsWith("@organui/"))
    .map((dependency) => dependency.replace("@organui/", ""))
  return (
    <InstallationTabs
      command={
        <CodeBlockCommand label="Installation command" command={command} />
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
          <li>
            <p>Copy and paste the following code into your project.</p>
            {item.files.map((file) => (
              <CodeSnippet
                key={file.installed}
                title={file.installed}
                label={`${file.installed} source`}
                code={file.content}
                contentClassName="max-h-96"
              />
            ))}
          </li>
          <li>
            <p>Update the import paths to match your project setup.</p>
          </li>
        </ol>
      }
    />
  )
}
