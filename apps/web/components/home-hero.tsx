import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { organs, organsPage } from "@/lib/registry"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

import { HomeHeart } from "@/components/home-heart"

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

// The rate the hero heart beats at, and the ECG sweep runs at.
const heartRate = 72

const trace = `M0 100 ${Array.from({ length: 8 }, (_, index) => beat(index * 150)).join(" ")}`

// The heart, large and alone, on an ECG line that runs through it; the
// headline and the way in sit quietly underneath.
export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -z-20 aspect-square w-[60rem] max-w-[160vw] -translate-x-1/2 -translate-y-[12%] rounded-full bg-[radial-gradient(closest-side,var(--color-chart-2),transparent)] opacity-[0.08] dark:opacity-[0.16]"
      />
      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-16 text-center md:pb-24">
        <div className="relative aspect-square w-full max-w-[24rem] sm:max-w-[32rem] lg:max-w-[38rem]">
          {/* The trace runs the width of the page, behind the heart. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1200 150"
            preserveAspectRatio="none"
            className="absolute top-[46%] left-1/2 -z-10 h-16 w-[100vw] -translate-x-1/2 text-chart-2 md:h-24"
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
              strokeOpacity={0.14}
              strokeWidth={1.25}
            />
            <path
              d={trace}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              mask="url(#home-sweep-mask)"
              className="home-glow"
            />
          </svg>
          <HomeHeart
            bpm={heartRate}
            className="absolute inset-0 cursor-grab [mask-image:radial-gradient(closest-side,black_75%,transparent)] active:cursor-grabbing"
          />
        </div>
        <h1 className="-mt-4 max-w-2xl text-3xl leading-[1.1] font-semibold tracking-tight text-balance text-primary sm:text-4xl lg:text-5xl">
          Healthcare &amp; life science UI for{" "}
          <span className="italic">humans</span> and{" "}
          <span className="font-mono font-medium tracking-tighter">agents</span>
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-7">
          <Link href="/docs" className={cn(buttonVariants(), "h-10 px-5")}>
            Get Started
          </Link>
          <Link
            href={organsPage.href}
            className={cn(buttonVariants({ variant: "ghost" }), "h-10 px-5")}
          >
            See the {organs.length} organs
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </div>
      </div>
      <a
        href="/docs/licences"
        className="absolute right-4 bottom-3 text-[0.6rem] text-muted-foreground/60 transition-colors hover:text-muted-foreground"
      >
        Heart: BodyParts3D, © DBCLS, CC BY 4.0
      </a>
    </section>
  )
}
