"use client"

import { Button } from "@workspace/ui/components/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@workspace/ui/components/empty"

import "./globals.css"

// Replaces the root layout when it fails, so it renders its own document. The
// theme provider isn't running here, so it shows the light theme.
export default function GlobalError({ retry }: { retry: () => void }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <title>Something went wrong — OrganUI</title>
        <main className="flex min-h-svh items-center justify-center p-6">
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Something went wrong</EmptyTitle>
              <EmptyDescription>
                OrganUI failed to load. Try again in a moment.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={() => retry()}>Try again</Button>
            </EmptyContent>
          </Empty>
        </main>
      </body>
    </html>
  )
}
