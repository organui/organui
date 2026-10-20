import type { Metadata } from "next"
import Link from "next/link"
import { buttonVariants } from "@workspace/ui/components/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@workspace/ui/components/empty"

import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = { title: "Page not found" }

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main
        id="main"
        className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center p-6"
      >
        <Empty>
          <EmptyHeader>
            <EmptyTitle>Page not found</EmptyTitle>
            <EmptyDescription>
              This page doesn&apos;t exist or has moved.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center">
            <Link href="/docs" className={buttonVariants()}>
              Read the docs
            </Link>
            <Link
              href="/docs/components"
              className={buttonVariants({ variant: "outline" })}
            >
              Browse components
            </Link>
          </EmptyContent>
        </Empty>
      </main>
    </>
  )
}
