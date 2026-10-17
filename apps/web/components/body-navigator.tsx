"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon, XIcon } from "lucide-react"
import {
  OrganViewer,
  type OrganViewerHandle,
} from "@workspace/registry/organ-viewer/organ-viewer"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { cn } from "@workspace/ui/lib/utils"

import { bodyLayers, bodyModel, bodyRegions, type BodyPlace } from "@/lib/body"

export type BodyOrgan = BodyPlace & {
  name: string
  title: string
  href: string
  /** The standalone explorer's repository, for organs that have one. */
  explorer?: string
}

const drawn = new Map(bodyModel.structures.map((s) => [s.id, s]))

// The homepage: a whole-body model where every organ opens its component.
// Picking an organ, on the body or in the list, glides the camera to it and
// shows a card linking to its docs page.
export function BodyNavigator({ organs }: { organs: readonly BodyOrgan[] }) {
  const viewer = React.useRef<OrganViewerHandle>(null)
  const [selected, setSelected] = React.useState<string | null>(null)
  const [query, setQuery] = React.useState("")
  const organ = organs.find(({ name }) => name === selected) ?? null

  const pick = (name: string | null) => {
    setSelected(name)
    const place = organs.find((entry) => entry.name === name)
    const frame = place?.frame ?? (name && drawn.has(name) ? [name] : null)
    // Leave room around the organ so it reads in place.
    if (frame) viewer.current?.focus(frame, place?.fill ?? 0.4)
    else viewer.current?.reset()
  }

  // Layers show only when picked, and a picked organ is seen without the
  // skin, or whatever else buries it, over it.
  const visibility = React.useMemo(
    () => ({
      ...Object.fromEntries(
        bodyLayers.map((layer) => [layer, layer === selected])
      ),
      skin: !selected || selected === "skin" || selected === "hair",
      ...Object.fromEntries((organ?.hide ?? []).map((id) => [id, false])),
    }),
    [selected, organ]
  )

  const words = query.trim().toLowerCase()
  const matches = organs.filter(
    ({ title, name, summary, region }) =>
      !words ||
      [title, name, summary, region].some((text) =>
        text.toLowerCase().includes(words)
      )
  )

  return (
    <div className="grid gap-4 lg:h-[min(48rem,calc(100svh-12rem))] lg:grid-cols-[minmax(0,1fr)_20rem]">
      <OrganViewer
        ref={viewer}
        model={bodyModel}
        selectedId={organ && drawn.has(organ.name) ? organ.name : null}
        onSelectionChange={pick}
        visibility={visibility}
        label="Interactive human body"
        className="h-[60svh] min-h-80 lg:h-full"
      />
      <aside
        aria-label="Organs"
        className="flex min-h-0 flex-col gap-4 lg:h-full"
      >
        <div aria-live="polite" className="empty:hidden">
          {organ && (
            <Card size="sm">
              <CardHeader>
                <CardTitle>
                  <h2 className="text-base">{organ.title}</h2>
                </CardTitle>
                <CardDescription>{organ.region}</CardDescription>
                <CardAction>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Close"
                    onClick={() => pick(null)}
                  >
                    <XIcon />
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <p>{organ.summary}</p>
                {organ.note && (
                  <p className="text-muted-foreground">{organ.note}</p>
                )}
              </CardContent>
              <CardFooter className="flex-col gap-1">
                <Link
                  href={organ.href}
                  className={cn(buttonVariants({ size: "sm" }), "w-full")}
                >
                  Open the {organ.title.toLowerCase()} component
                  <ArrowRightIcon data-icon="inline-end" />
                </Link>
                {organ.explorer && (
                  <a
                    href={organ.explorer}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "w-full"
                    )}
                  >
                    {organ.title} explorer on GitHub
                  </a>
                )}
              </CardFooter>
            </Card>
          )}
        </div>
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Search ${organs.length} organs`}
          aria-label="Search organs"
        />
        <nav
          aria-label="Organ components"
          className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1 pb-1"
        >
          {matches.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No organ matches “{query.trim()}”.
            </p>
          )}
          {bodyRegions.map((region) => {
            const entries = matches.filter((entry) => entry.region === region)
            if (!entries.length) return null
            return (
              <section key={region} className="mb-3">
                <h2 className="px-2 py-1 text-xs font-medium text-muted-foreground">
                  {region}
                </h2>
                <ul>
                  {entries.map((entry) => (
                    <li key={entry.name}>
                      <button
                        type="button"
                        aria-pressed={entry.name === selected}
                        onClick={() => pick(entry.name)}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring aria-pressed:bg-muted aria-pressed:font-medium"
                      >
                        <span
                          aria-hidden="true"
                          className="size-2.5 shrink-0 rounded-full border border-foreground/10"
                          style={{
                            background:
                              drawn.get(entry.name)?.color ?? "transparent",
                          }}
                        />
                        {entry.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </nav>
      </aside>
    </div>
  )
}
