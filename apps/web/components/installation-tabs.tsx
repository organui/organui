"use client"

import type { ReactNode } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

// Install with the CLI, or copy the source by hand.
export function InstallationTabs({
  command,
  manual,
}: {
  command: ReactNode
  manual: ReactNode
}) {
  return (
    <Tabs defaultValue="command" className="gap-4">
      <TabsList variant="line" aria-label="Installation method">
        <TabsTrigger value="command">Command</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>
      <TabsContent value="command">{command}</TabsContent>
      <TabsContent value="manual">{manual}</TabsContent>
    </Tabs>
  )
}
