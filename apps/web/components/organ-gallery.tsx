"use client"

import Image from "next/image"
import {
  createContext,
  use,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react"
import { examples } from "@/examples/_examples"
import { Spinner } from "@workspace/ui/components/spinner"

type Active = [string | null, Dispatch<SetStateAction<string | null>>]

const ActiveOrgan = createContext<Active | null>(null)

// At most one card shows its live scene: opening another returns the first to
// its thumbnail, which unmounts its viewer and frees its WebGL context.
export function OrganGallery({ children }: { children: ReactNode }) {
  const active = useState<string | null>(null)
  return <ActiveOrgan value={active}>{children}</ActiveOrgan>
}

export function OrganPreview({
  name,
  title,
  thumbnail,
}: {
  name: string
  title: string
  thumbnail?: { src: string; width: number; height: number }
}) {
  const [active, setActive] = use(ActiveOrgan)!
  const [preview, setPreview] = useState<{ name: string; node: ReactNode }>()
  const live = active === name && preview ? preview.node : null
  if (live)
    return (
      <div
        role="group"
        aria-label={`${title} 3D preview`}
        className="w-full min-w-0"
      >
        {live}
      </div>
    )
  const pending = active === name
  return (
    <button
      type="button"
      aria-label={`Load the ${title.toLowerCase()} in 3D`}
      disabled={pending}
      aria-busy={pending}
      onClick={async () => {
        setActive(name)
        const node = await examples[`${name}-demo`]!.render()
        setPreview({ name, node })
      }}
      className="group relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border bg-muted/40 focus-visible:outline-2 focus-visible:outline-ring"
    >
      {thumbnail && (
        <Image
          src={thumbnail.src}
          width={thumbnail.width}
          height={thumbnail.height}
          alt=""
          unoptimized
          sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 100vw"
          className="size-full object-contain transition-transform group-hover:scale-[1.03]"
        />
      )}
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md border bg-background/90 px-2 py-1 text-xs font-medium backdrop-blur"
      >
        {pending && <Spinner className="size-3" />}
        {pending ? "Loading…" : "View in 3D"}
      </span>
    </button>
  )
}
