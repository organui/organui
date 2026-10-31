import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { organs, organsPage } from "@/lib/registry"
import { Badge } from "@workspace/ui/components/badge"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

import { HomeHeart } from "@/components/home-heart"
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

// The rate the hero heart beats at, shown in its HR readout.
const heartRate = 72

const heart = organs.find(({ name }) => name === "heart")

const trace = `M0 100 ${Array.from({ length: 8 }, (_, index) => beat(index * 150)).join(" ")}`

// Decorative readouts in the heart's frame, as on a bedside monitor. The
// rate is the one the heart beats at.
const readouts = [
  {
    label: "HR",
    value: `${heartRate}`,
    unit: "bpm",
    className: "top-3 left-4",
  },
  {
    label: "SpO₂",
    value: "98",
    unit: "%",
    className: "top-3 right-4 items-end",
  },
  {
    label: "RR",
    value: "16",
    unit: "/min",
    className: "bottom-12 left-4 max-sm:hidden",
  },
  {
    label: "NIBP",
    value: "118/76",
    unit: "mmHg",
    className: "right-4 bottom-12 items-end max-sm:hidden",
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
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pt-8 md:pt-12 lg:grid-cols-[1.1fr_1fr] lg:gap-8 lg:pt-16">
        <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-start">
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
          <h1 className="max-w-4xl text-5xl leading-[1.02] font-semibold tracking-tighter text-balance text-primary sm:text-6xl xl:text-7xl">
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
        {/* The heart in a monitor frame, with the vitals in its corners. */}
        <div className="relative -order-1 mx-auto aspect-square w-full max-w-[18rem] sm:max-w-md lg:order-none lg:max-w-[36rem]">
          <div
            aria-hidden="true"
            className="absolute inset-[12%] rounded-full bg-chart-2/10 blur-3xl"
          />
          <HomeHeart
            bpm={heartRate}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          />
          {(
            [
              "top-0 left-0 border-t border-l",
              "top-0 right-0 border-t border-r",
              "bottom-0 left-0 border-b border-l",
              "right-0 bottom-0 border-r border-b",
            ] as const
          ).map((corner) => (
            <span
              key={corner}
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute size-5 border-foreground/30",
                corner
              )}
            />
          ))}
          {readouts.map(({ label, value, unit, className }) => (
            <div
              key={label}
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute flex flex-col font-mono text-muted-foreground",
                className
              )}
            >
              <span className="text-[0.6rem] tracking-widest uppercase">
                {label}
              </span>
              <span className="text-lg font-medium text-foreground tabular-nums sm:text-2xl">
                {value}
                <span className="ms-1 text-[0.65rem] font-normal text-muted-foreground sm:text-xs">
                  {unit}
                </span>
              </span>
            </div>
          ))}
          <Link
            href={heart?.href ?? organsPage.href}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border bg-background/70 px-3 py-1 font-mono text-[0.65rem] whitespace-nowrap text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
          >
            Drag to turn · Open the heart
          </Link>
          <a
            href="/docs/licences"
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[0.6rem] whitespace-nowrap text-muted-foreground/70 hover:text-muted-foreground"
          >
            Heart model: BodyParts3D, © DBCLS, CC BY 4.0
          </a>
        </div>
      </div>
      {/* The trace: a faint line, with a bright sweep running along it. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 150"
        preserveAspectRatio="none"
        className="mt-2 h-24 w-full text-chart-2 md:h-32"
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
