import { packageCommands } from "@/lib/package-commands"

import { CopyButton } from "@/components/copy-button"

// The install command for one organ, as a pill under the hero's buttons.
export function HomeInstall({ command }: { command: string }) {
  const npm = packageCommands(command).npm
  return (
    <div className="flex max-w-full items-center gap-1 rounded-full border bg-background/80 py-1 ps-4 pe-1 font-mono text-xs text-muted-foreground shadow-xs backdrop-blur-sm sm:text-sm">
      <span aria-hidden="true" className="text-chart-2 select-none">
        $
      </span>
      <code className="truncate ps-1 text-foreground">{npm}</code>
      <CopyButton
        value={npm}
        event="copy_install_command"
        properties={{ name: "heart", source: "home" }}
        className="rounded-full"
      />
    </div>
  )
}
