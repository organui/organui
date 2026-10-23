"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"

export type GalleryDisease = {
  name: string
  title: string
  href: string
  system: string
  /** The organs and tissues it is drawn on, in its scales' order. */
  bases: string[]
}

// Every disease as a picture, filtered by body system. The systems are those
// with a disease, in body-systems.json order.
export function DiseaseGallery({
  diseases,
  systems,
}: {
  diseases: GalleryDisease[]
  systems: { id: string; title: string }[]
}) {
  const [system, setSystem] = React.useState("all")
  const shown = diseases.filter(
    (disease) => system === "all" || disease.system === system
  )
  const titles = new Map(systems.map(({ id, title }) => [id, title]))
  return (
    <div className="flex flex-col gap-6">
      <ToggleGroup
        aria-label="Body system"
        variant="outline"
        size="sm"
        spacing={2}
        className="flex-wrap"
        value={[system]}
        onValueChange={(values) => setSystem(values[0] ?? "all")}
      >
        <ToggleGroupItem value="all">All</ToggleGroupItem>
        {systems.map(({ id, title }) => (
          <ToggleGroupItem key={id} value={id}>
            {title}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((disease) => (
          <li key={disease.name} className="flex flex-col gap-0.5">
            <Link
              href={disease.href}
              className="group flex flex-col gap-2 rounded-xl focus-visible:outline-2 focus-visible:outline-ring"
            >
              <Image
                src={`/diseases/${disease.name}.webp`}
                width={640}
                height={480}
                alt=""
                sizes="(min-width: 1280px) 14rem, (min-width: 1024px) 20vw, (min-width: 640px) 30vw, 50vw"
                className="aspect-[4/3] w-full rounded-xl bg-muted/40 object-contain transition-transform group-hover:scale-[1.03]"
              />
              <span className="text-sm font-medium">{disease.title}</span>
            </Link>
            <span className="text-xs text-muted-foreground">
              {titles.get(disease.system)} ·{" "}
              {disease.bases.map((base) => base.toLowerCase()).join(", ")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
