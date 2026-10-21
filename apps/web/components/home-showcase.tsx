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
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
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
// with a fade into the button that leads to the rest. The columns are
// balanced so every card's top shows above the fade.
export function HomeShowcase() {
  return (
    <section
      aria-label="Components"
      className="relative overflow-hidden bg-muted dark:bg-background"
    >
      {/* Light mode eases from the page into the grey; dark mode has no grey. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-1 h-48 bg-linear-to-b from-background via-muted to-transparent dark:hidden" />
      <div className="relative z-10 mx-auto max-w-[1400px] px-4 py-8 lg:max-h-[88rem] lg:px-8 lg:py-10">
        {/* Phones show a picture of the cards as a wide screen lays them out
            (bun run screenshots), wider than the screen and cut at its edge. */}
        <div className="-mx-4 -mt-8 overflow-hidden md:hidden">
          <Image
            src="/home/showcase-light.webp"
            width={2432}
            height={2800}
            alt="Components for vital signs, anatomy, ECG, medication, growth and lab results"
            sizes="140vw"
            priority
            className="h-auto w-[140vw] max-w-none dark:hidden"
          />
          <Image
            src="/home/showcase-dark.webp"
            width={2432}
            height={2800}
            alt="Components for vital signs, anatomy, ECG, medication, growth and lab results"
            sizes="140vw"
            priority
            className="hidden h-auto w-[140vw] max-w-none dark:block"
          />
        </div>
        {/* Three columns on wide screens, two below. */}
        <div
          data-showcase-cards
          className="hidden grid-cols-2 items-start gap-4 *:min-w-0 md:grid xl:grid-cols-3"
        >
          <div className="flex flex-col gap-4">
            <Tile title="Organs" href={organsPage.href}>
              <OrganPicks />
            </Tile>
            <Tile title="Vital signs" href="/docs/components/vital-signs">
              <VitalSigns />
            </Tile>
            <Tile title="Body map" href="/docs/components/body-map">
              <HomeBodyMap />
            </Tile>
          </div>
          <div className="flex flex-col gap-4">
            <Tile title="ECG trace" href="/docs/components/ecg-trace">
              <HomeEcg />
            </Tile>
            <Tile
              title="Medication schedule"
              href="/docs/components/medication-schedule"
            >
              <HomeMedicationSchedule />
            </Tile>
          </div>
          <div className="flex flex-col gap-4 md:col-span-2 md:grid md:grid-cols-2 xl:col-span-1 xl:flex">
            <Tile title="Growth chart" href="/docs/components/growth-chart">
              <GrowthChart />
            </Tile>
            <Tile title="Lab results" href="/docs/components/lab-results">
              <LabResults />
            </Tile>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden h-64 bg-linear-to-t from-background via-muted/80 to-transparent lg:block dark:via-background/80" />
      <div className="relative z-30 flex justify-center pb-8 lg:absolute lg:inset-x-0 lg:bottom-10 lg:pb-0">
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
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardAction>
          <Link
            href={href}
            className="inline-flex items-center gap-1 rounded-sm text-xs font-medium text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Docs
            <ArrowRightIcon aria-hidden="true" className="size-3" />
            <span className="sr-only">: {title}</span>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
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
