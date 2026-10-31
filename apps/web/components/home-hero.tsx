import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { organs, organsPage } from "@/lib/registry"
import { Badge } from "@workspace/ui/components/badge"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

import { HomeInstall } from "@/components/home-install"

// One heartbeat, PQRST, drawn on a 150 wide cell around a baseline at 100.
function beat(x: number) {
  return [
    `L${x + 18} 100`,
    `C${x + 24} 100 ${x + 26} 88 ${x + 32} 88`,
    `C${x + 38} 88 ${x + 40} 100 ${x + 46} 100`,
    `L${x + 56} 100`,
    `L${x + 60} 110`,
    `L${x + 67} 18`,
    `L${x + 74} 132`,
    `L${x + 79} 100`,
    `L${x + 94} 100`,
    `C${x + 102} 100 ${x + 106} 80 ${x + 114} 80`,
    `C${x + 122} 80 ${x + 126} 100 ${x + 134} 100`,
    `L${x + 150} 100`,
  ].join(" ")
}

const heart = organs.find(({ name }) => name === "heart")

const trace = `M0 100 ${Array.from({ length: 8 }, (_, index) => beat(index * 150)).join(" ")}`

// Decorative readouts at the hero's edges, as on a bedside monitor.
const readouts = [
  { label: "HR", value: "72", unit: "bpm", side: "left" },
  { label: "SpO₂", value: "98", unit: "%", side: "right" },
  { label: "RR", value: "16", unit: "/min", side: "left" },
  {
    label: "NIBP",
    value: "118/76",
    unit: "mmHg",
    side: "right",
  },
]

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden border-b">
      {/* A monitor grid that fades out towards the edges. */}
      <div
        aria-hidden="true"
        className="home-grid pointer-events-none absolute inset-0 -z-10"
      />
      {(["left", "right"] as const).map((side) => (
        <div
          key={side}
          aria-hidden="true"
          className={cn(
            "absolute top-8 hidden flex-col gap-6 font-mono text-muted-foreground lg:flex",
            side === "left" ? "left-8" : "right-8 items-end"
          )}
        >
          {readouts
            .filter((readout) => readout.side === side)
            .map(({ label, value, unit }) => (
              <div key={label} className="flex flex-col">
                <span className="text-[0.65rem] tracking-widest uppercase">
                  {label}
                </span>
                <span className="text-2xl font-medium text-foreground tabular-nums">
                  {value}
                  <span className="ms-1 text-xs font-normal text-muted-foreground">
                    {unit}
                  </span>
                </span>
              </div>
            ))}
        </div>
      ))}
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-6 pt-14 text-center md:pt-24 lg:pt-28">
        <Badge
          variant="secondary"
          render={<Link href={organsPage.href} />}
          className="bg-muted"
        >
          <span
            aria-hidden="true"
            className="home-pulse size-1.5 rounded-full bg-chart-2"
          />
          {organs.length} organs in 3D, ready to install
          <ArrowRightIcon data-icon="inline-end" />
        </Badge>
        <h1 className="max-w-4xl text-5xl leading-[1.02] font-semibold tracking-tighter text-balance text-primary sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
          Healthcare &amp; life science UI for{" "}
          <span className="italic">humans</span> and{" "}
          <span className="font-mono font-medium tracking-tight whitespace-nowrap">
            agents
            <span
              aria-hidden="true"
              className="home-caret ms-1 inline-block h-[0.8em] w-[0.08em] translate-y-[0.08em] bg-chart-2"
            />
          </span>
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
          <Link href="/docs" className={cn(buttonVariants(), "h-10 px-5")}>
            Get Started
          </Link>
          <Link
            href="/docs/components"
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "h-10 px-5 shadow-none"
            )}
          >
            Browse Components
          </Link>
        </div>
        {heart && <HomeInstall command={heart.install} />}
      </div>
      {/* The trace: a faint line, with a bright sweep running along it. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 150"
        preserveAspectRatio="none"
        className="mt-6 h-28 w-full text-chart-2 md:mt-10 md:h-40"
      >
        <defs>
          <linearGradient id="home-sweep-fade">
            <stop offset="0" stopColor="white" stopOpacity="0" />
            <stop offset="0.9" stopColor="white" stopOpacity="0.7" />
            <stop offset="1" stopColor="white" />
          </linearGradient>
          <mask id="home-sweep-mask" maskUnits="userSpaceOnUse">
            <rect
              x={-320}
              width={320}
              height={150}
              fill="url(#home-sweep-fade)"
              className="home-sweep"
            />
          </mask>
        </defs>
        <path
          d={trace}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.22}
          strokeWidth={1.5}
        />
        <path
          d={trace}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          mask="url(#home-sweep-mask)"
          className="home-glow"
        />
      </svg>
    </section>
  )
}
