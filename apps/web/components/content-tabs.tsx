"use client"

import type { ReactNode } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"

// Underlined tabs over content rendered on the server, such as one command
// per tool.
export function ContentTabs({
  label,
  tabs,
}: {
  label: string
  tabs: { value: string; title: string; content: ReactNode }[]
}) {
  return (
    <Tabs defaultValue={tabs[0]?.value} className="gap-4">
      <TabsList variant="line" aria-label={label} className="flex-wrap">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
