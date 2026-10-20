"use client"

import Link from "next/link"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@workspace/ui/components/empty"

// Most likely a model or WebGL failure in a preview. The root layout has no
// header, so this page stands alone.
export default function Error({ retry }: { retry: () => void }) {
  return (
    <main id="main" className="flex min-h-svh items-center justify-center p-6">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Something went wrong</EmptyTitle>
          <EmptyDescription>
            This page failed to load. Try again, or head back home.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center">
          <Button onClick={() => retry()}>Try again</Button>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Home
          </Link>
        </EmptyContent>
      </Empty>
    </main>
  )
}
