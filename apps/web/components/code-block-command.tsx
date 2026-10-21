import { CodeBlockCommandTabs } from "@/components/code-block-command-tabs"
import { highlightCode } from "@/lib/highlight-code"
import { packageCommands, packageManagers } from "@/lib/package-commands"

// A shell command with a tab for each package manager. Every variant is
// highlighted on the server; the client only picks one.
export async function CodeBlockCommand({
  command,
  label,
}: {
  command: string
  label: string
}) {
  const commands = packageCommands(command)
  const highlighted = Object.fromEntries(
    await Promise.all(
      packageManagers.map(async (manager) => [
        manager,
        (await highlightCode(commands[manager], "bash"))[0],
      ])
    )
  )
  return (
    <CodeBlockCommandTabs
      label={label}
      commands={commands}
      highlighted={highlighted}
    />
  )
}
