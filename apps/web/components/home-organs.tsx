import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { organs, organsPage, type RegistryItem } from "@/lib/registry"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

// The organs in two rows that drift in opposite directions. Each row is
// drawn twice so the loop is seamless; the copy is hidden from assistive
// technology and the keyboard, and the drift pauses on hover and focus.
const half = Math.ceil(organs.length / 2)
const rows = [organs.slice(0, half), organs.slice(half)]

export function HomeOrgans() {
  return (
    <section
      aria-labelledby="home-organs"
      className="flex flex-col gap-10 py-20 md:py-28"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-6 text-center">
        <p className="font-mono text-xs tracking-widest text-chart-2 uppercase">
          Anatomy
        </p>
        <h2
          id="home-organs"
          className="text-3xl font-semibold tracking-tighter text-balance sm:text-5xl"
        >
          {organs.length} organs. Rotate, select, hide.
        </h2>
        <p className="max-w-xl text-balance text-muted-foreground">
          Every organ is a component on the shared organ viewer, with its parts
          named in an anatomy tree. Models load when you open one.
        </p>
      </div>
      <div className="home-marquee flex flex-col gap-4">
        {rows.map((row, index) => (
          <div key={index} className="flex overflow-hidden">
            <div
              className={cn(
                "home-marquee-track flex w-max gap-4 pe-4",
                index % 2 && "[animation-direction:reverse]"
              )}
            >
              <OrganRow organs={row} />
              <OrganRow organs={row} copy />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center px-6">
        <Link
          href={organsPage.href}
          className={cn(buttonVariants({ variant: "outline" }), "shadow-xs")}
        >
          See every organ
          <ArrowRightIcon data-icon="inline-end" />
        </Link>
      </div>
    </section>
  )
}

function OrganRow({
  organs,
  copy = false,
}: {
  organs: RegistryItem[]
  copy?: boolean
}) {
  return (
    <ul aria-hidden={copy || undefined} className="flex gap-4">
      {organs.map((organ) => (
        <li key={organ.name}>
          <Link
            href={organ.href}
            tabIndex={copy ? -1 : undefined}
            className="group flex w-40 flex-col items-center gap-1 rounded-xl border bg-card p-3 transition-colors outline-none hover:border-foreground/20 focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-48"
          >
            <Image
              src={`/organs/${organ.name}.webp`}
              width={640}
              height={480}
              alt=""
              sizes="12rem"
              className="aspect-[4/3] w-full object-contain transition-transform duration-500 group-hover:scale-110"
            />
            <span className="text-sm font-medium">{organ.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
