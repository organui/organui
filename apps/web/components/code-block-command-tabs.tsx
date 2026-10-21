"use client"

import type { ReactNode } from "react"
import { TerminalIcon } from "lucide-react"
import { usePackageManager } from "@/hooks/use-package-manager"
import { packageManagers, type PackageManager } from "@/lib/package-commands"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockHeader,
  CodeBlockLine,
} from "@workspace/ui/components/code-block"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { CopyButton } from "@/components/copy-button"

export function CodeBlockCommandTabs({
  label,
  commands,
  highlighted,
}: {
  label: string
  commands: Record<PackageManager, string>
  highlighted: Record<string, ReactNode>
}) {
  const [manager, setManager] = usePackageManager()
  return (
    <CodeBlock>
      <Tabs
        value={manager}
        onValueChange={(value) => setManager(value as PackageManager)}
        className="gap-0"
      >
        <CodeBlockHeader className="border-b border-border/60 pt-2 pb-2">
          <TerminalIcon aria-hidden="true" className="size-4 shrink-0" />
          <TabsList
            aria-label="Package manager"
            className="h-7 bg-transparent p-0"
          >
            {packageManagers.map((name) => (
              <TabsTrigger
                key={name}
                value={name}
                className="h-7 flex-none px-2 font-mono text-xs data-active:border-input data-active:shadow-none!"
              >
                {name}
              </TabsTrigger>
            ))}
          </TabsList>
          <CopyButton
            event="copy_install_command"
            properties={{ command: commands[manager] }}
            value={commands[manager]}
            className="ms-auto"
          />
        </CodeBlockHeader>
        {packageManagers.map((name) => (
          <TabsContent key={name} value={name}>
            <CodeBlockContent
              role="region"
              aria-label={label}
              className="py-3.5"
            >
              <CodeBlockLine>{highlighted[name]}</CodeBlockLine>
            </CodeBlockContent>
          </TabsContent>
        ))}
      </Tabs>
    </CodeBlock>
  )
}
