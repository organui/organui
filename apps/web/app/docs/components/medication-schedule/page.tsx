import { ComponentPreview } from "@/components/component-preview"
import { ComponentInstallation } from "@/components/component-installation"
import { CodeSnippet } from "@/components/code-snippet"
import { DocsHeader } from "@/components/docs-header"
import { DocsHeading } from "@/components/docs-heading"
import { DocsPager } from "@/components/docs-pager"
import { PropsTable } from "@/components/props-table"
import { ComponentExamples } from "@/components/component-examples"
import { componentExamples } from "@/lib/component-examples"
import Link from "next/link"
import { docsMetadata, shadcn } from "@/lib/registry"
import { site } from "@/lib/site"

export const metadata = docsMetadata(
  "Medication schedule",
  "A medication schedule component with a daily dosing timeline, dose tracking and interaction warnings from your own data.",
  "/docs/components/medication-schedule"
)

const usage = `"use client"
import { useState } from "react"
import {
  MedicationSchedule,
  type DoseStatus,
} from "@/components/ui/medication-schedule"

const medications = [
  { id: "levothyroxine", name: "Levothyroxine", dose: "75 mcg", times: ["07:00"] },
  { id: "calcium", name: "Calcium carbonate", times: ["08:30", "19:00"] },
]
// From your own interaction source. None are bundled.
const interactions = [{
  id: "levothyroxine-calcium",
  medicationIds: ["levothyroxine", "calcium"],
  severity: "moderate" as const,
  summary: "Calcium can reduce levothyroxine absorption.",
  separationHours: 4,
}]

export function Schedule() {
  const [date, setDate] = useState("2026-10-19")
  const [doseStatus, setDoseStatus] = useState<Record<string, DoseStatus>>({})
  return <MedicationSchedule medications={medications}
    interactions={interactions} date={date} onDateChange={setDate}
    doseStatus={doseStatus} onDoseStatusChange={setDoseStatus} />
}`

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <DocsHeader
        href="/docs/components/medication-schedule"
        title="Medication schedule"
      >
        <p className="text-[1.05rem] text-balance text-muted-foreground sm:text-base md:max-w-[80%]">
          A day of doses on a 24-hour timeline, with a checklist to mark each
          one taken or skipped and warnings for interactions you supply.
        </p>
      </DocsHeader>
      <ComponentPreview name="medication-schedule-demo" />
      <section className="flex flex-col gap-4">
        <DocsHeading id="installation">Installation</DocsHeading>
        <p>
          In a project set up as in{" "}
          <Link href="/docs/installation" className="underline">
            Installation
          </Link>
          , run:
        </p>
        <ComponentInstallation
          name="medication-schedule"
          command={`bunx ${shadcn} add ${site.url}/r/medication-schedule.json`}
        />
        <p>
          Or by name:{" "}
          <code>bunx {shadcn} add @organui/medication-schedule</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          The source installs into your configured UI directory, along with
          shadcn&apos;s <code>alert</code>, <code>button</code> and{" "}
          <code>empty</code> if you do not have them yet. It uses your existing
          theme tokens and installs no global styles, date library or drug
          database.
        </p>
        <a className="underline" href="/r/medication-schedule.json">
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="usage">Usage</DocsHeading>
        <CodeSnippet label="Data wiring example" code={usage} />
        <p>
          Each medication has a unique <code>id</code>, a <code>name</code> and
          its local dosing <code>times</code> as <code>&quot;HH:MM&quot;</code>.
          Optional <code>days</code> (0 for Sunday to 6 for Saturday),{" "}
          <code>start</code> and <code>end</code> dates limit when it is due.
          Dates are <code>&quot;YYYY-MM-DD&quot;</code> calendar days with no
          time zone, so the schedule renders the same on the server and the
          client. Invalid times, dates or repeated IDs throw an error.
        </p>
        <p>
          The date is controlled. Pass <code>onDateChange</code> to show
          previous and next day buttons. Pass <code>now</code> from client state
          to mark the current time on the timeline; the component never reads
          the clock itself.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="dose-tracking">Dose tracking</DocsHeading>
        <p>
          Dose status is a map from dose keys, such as{" "}
          <code>levothyroxine@2026-10-19T07:00</code>, to{" "}
          <code>&quot;taken&quot;</code> or <code>&quot;skipped&quot;</code>.
          Missing doses are still to take. With <code>onDoseStatusChange</code>,
          each dose in the list becomes a button that cycles from to take, to
          taken, to skipped and back; the callback receives the whole new map
          for you to store. Without it the status is shown as text.
        </p>
        <p>
          The timeline is a visual summary and is hidden from assistive
          technology. The ordered dose list carries the same times, names,
          statuses and warnings, and each status button names its medication and
          time.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="interaction-warnings">
          Interaction warnings
        </DocsHeading>
        <p>
          The component ships no drug database and makes no clinical judgement.
          It shows only the <code>interactions</code> you pass, each naming two
          or more medication IDs, a <code>severity</code> of <code>minor</code>,{" "}
          <code>moderate</code> or <code>major</code>, and a{" "}
          <code>summary</code>. A warning appears on days when every medication
          it names is due, most severe first, and major ones get a destructive
          border and title. Give <code>separationHours</code> to flag same-day
          doses of those medications that are closer than that, on the timeline
          and in the dose list.
        </p>
        <p>
          Source your interactions from a reviewed clinical service, and keep
          the default disclaimer or replace it with your own through{" "}
          <code>disclaimer</code>. Doses across midnight are not compared.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <DocsHeading id="customize">Customize</DocsHeading>
        <p>
          Set <code>label</code> for the accessible name, <code>locale</code>{" "}
          for the date heading, <code>className</code> for the outer container
          and <code>color</code> on a medication for its swatch and markers. The
          helpers <code>dosesOn</code>, <code>activeInteractions</code>,{" "}
          <code>doseConflicts</code> and <code>nextDoseStatus</code> are
          exported for your own views, such as reminders or a weekly summary.
        </p>
        <p className="text-sm text-muted-foreground">
          A display component, not a medical device. No reminders,
          notifications, as-needed dosing, titration or dose calculations.
        </p>
      </section>
      <ComponentExamples examples={componentExamples["medication-schedule"]!} />
      <PropsTable item="medication-schedule" />
      <DocsPager href="/docs/components/medication-schedule" />
    </div>
  )
}
