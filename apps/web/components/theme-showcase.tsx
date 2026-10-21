import type { ReactNode } from "react"
import { AiDisclaimer } from "@workspace/registry/ai-disclaimer"
import { DifferentialList } from "@workspace/registry/differential-list"
import { VitalSigns } from "@workspace/registry/vital-signs"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Example as ClinicianReview } from "@/examples/clinician-review-demo"
import {
  HomeBodyMap,
  HomeEcg,
  HomeMedicationSchedule,
} from "@/components/home-demos"
import { aiCaseDifferential } from "@/lib/ai-case"

function Tile({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
  )
}

// Components in columns, to see a theme across them.
export function ThemeShowcase() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-4 p-4 *:min-w-0 md:grid-cols-2 md:p-6 xl:grid-cols-3">
      <div className="flex flex-col gap-4">
        <Tile title="Vital signs">
          <VitalSigns
            readings={{
              heartRate: 112,
              systolic: 116,
              diastolic: 74,
              spo2: 96,
              temperature: 38.6,
            }}
            description="Fever example"
          />
        </Tile>
        <Tile title="Body map">
          <HomeBodyMap />
        </Tile>
      </div>
      <div className="flex flex-col gap-4">
        <Tile title="ECG trace">
          <HomeEcg />
        </Tile>
        <Tile title="Medication schedule">
          <HomeMedicationSchedule />
        </Tile>
      </div>
      <div className="flex flex-col gap-4 md:col-span-2 xl:col-span-1">
        <AiDisclaimer
          model="Example model"
          generatedAt="2026-10-21T09:30:00Z"
        />
        <Tile title="Differential list">
          <DifferentialList items={aiCaseDifferential} />
        </Tile>
        <ClinicianReview />
      </div>
    </div>
  )
}
