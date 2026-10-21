import { utilitiesCss } from "@workspace/registry/utilities-css"
import { CodeBlockCommand } from "@/components/code-block-command"
import { CodeSnippet } from "@/components/code-snippet"
import { utilityItems } from "@/lib/registry"

// How to get the utilities, which install together as shadcn's do.
export function UtilitiesInstallation({ name }: { name?: string }) {
  return (
    <>
      <p>
        {name ? (
          <>
            If your project has OrganUI&apos;s utilities, you already have{" "}
            <code>{name}</code>. Otherwise, add them once:
          </>
        ) : (
          "Add them once, with the CLI:"
        )}
      </p>
      <CodeBlockCommand
        label="Installation command"
        command={utilityItems[0]!.install}
      />
      <p>
        The CLI adds them to your global CSS file, after your theme. To add them
        by hand, paste this instead:
      </p>
      <CodeSnippet
        label="Utilities CSS"
        code={utilitiesCss(["utilities"])}
        lang="css"
        contentClassName="max-h-72"
      />
    </>
  )
}
