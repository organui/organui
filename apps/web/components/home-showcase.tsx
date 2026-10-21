import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import {
  HomeBodyMap,
  HomeEcg,
  HomeMedicationSchedule,
} from "@/components/home-demos"
import { Example as GrowthChart } from "@/examples/growth-chart-demo"
import { Example as LabResults } from "@/examples/lab-results-demo"
import { Example as VitalSigns } from "@/examples/vital-signs-demo"
import { organs, organsPage } from "@/lib/registry"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

const organPicks = [
  "heart",
  "brain",
  "lungs",
  "kidneys",
  "liver",
  "eye",
].flatMap((name) => organs.filter((organ) => organ.name === name))

// Live components in columns, cut off at a fixed height on wide screens
// with a fade into the button that leads to the rest.
export function HomeShowcase() {
  return (
    <section
      aria-label="Components"
      className="relative overflow-hidden border-y bg-muted/40 dark:bg-muted/20"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:max-h-[64rem] lg:py-10">
        {/* Three columns on wide screens, two then one below. */}
        <div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Tile title="Organs" href={organsPage.href}>
              <OrganPicks />
            </Tile>
            <Tile title="Vital signs" href="/docs/components/vital-signs">
              <VitalSigns />
            </Tile>
          </div>
          <div className="flex flex-col gap-4">
            <Tile title="ECG trace" href="/docs/components/ecg-trace">
              <HomeEcg />
            </Tile>
            <Tile title="Body map" href="/docs/components/body-map">
              <HomeBodyMap />
            </Tile>
          </div>
          <div className="flex flex-col gap-4 md:col-span-2 md:grid md:grid-cols-2 xl:col-span-1 xl:flex">
            <Tile
              title="Medication schedule"
              href="/docs/components/medication-schedule"
            >
              <HomeMedicationSchedule />
            </Tile>
            <Tile title="Growth chart" href="/docs/components/growth-chart">
              <GrowthChart />
            </Tile>
            <Tile title="Lab results" href="/docs/components/lab-results">
              <LabResults />
            </Tile>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-64 bg-linear-to-t from-background via-background/80 to-transparent lg:block" />
      <div className="flex justify-center pb-8 lg:absolute lg:inset-x-0 lg:bottom-10 lg:pb-0">
        <Link
          href="/docs/components"
          className={cn(buttonVariants({ variant: "outline" }), "shadow-sm")}
        >
          Browse all components
          <ArrowRightIcon data-icon="inline-end" />
        </Link>
      </div>
    </section>
  )
}

function Tile({
  title,
  href,
  children,
}: {
  title: string
  href: string
  children: ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-xl bg-background p-4 shadow-xs ring-1 ring-foreground/5 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        <Link
          href={href}
          className="inline-flex items-center gap-1 rounded-sm text-xs font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Docs
          <ArrowRightIcon aria-hidden="true" className="size-3" />
          <span className="sr-only">: {title}</span>
        </Link>
      </div>
      {children}
    </div>
  )
}

function OrganPicks() {
  return (
    <>
      <ul className="grid grid-cols-3 gap-2">
        {organPicks.map((organ) => (
          <li key={organ.name}>
            <Link
              href={organ.href}
              className="group flex flex-col items-center gap-1 rounded-lg p-1 outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <Image
                src={`/organs/${organ.name}.webp`}
                width={640}
                height={480}
                alt=""
                sizes="8rem"
                className="aspect-[4/3] w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-xs font-medium">{organ.title}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="text-sm text-muted-foreground">
        {organs.length} organs you can rotate, select and hide, each on the
        shared organ viewer.
      </p>
    </>
  )
}
