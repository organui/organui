import {
  codeBlock,
  docsMetadata,
  registryNamespace,
  shadcn,
} from "@/lib/registry"
import { site } from "@/lib/site"
import { Example } from "./example"

export const metadata = docsMetadata(
  "Medication schedule",
  "A medication schedule component with a daily dosing timeline, dose tracking and interaction warnings from your own data.",
  "/docs/medication-schedule"
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
      <header className="flex flex-col gap-4">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Components / Clinical
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Medication schedule
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          A day of doses on a 24-hour timeline, with a checklist to mark each
          one taken or skipped and warnings for interactions you supply.
        </p>
      </header>
      <Example />
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Install</h2>
        <p>
          In a React 19 project configured with shadcn, Tailwind CSS 4, and the
          Base UI / Nova theme, run the command below.
        </p>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Installation command"
          className={codeBlock}
        >
          {`bunx ${shadcn} add ${site.url}/r/medication-schedule.json`}
        </pre>
        <p>
          To install by name, add the OrganUI namespace to{" "}
          <code>components.json</code> and run{" "}
          <code>bunx {shadcn} add @organui/medication-schedule</code>, or
          install from GitHub with{" "}
          <code>bunx {shadcn} add organui/organui/medication-schedule</code>.
        </p>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Registry namespace configuration"
          className={codeBlock}
        >
          {registryNamespace}
        </pre>
        <p className="text-sm text-muted-foreground">
          The source installs into your configured UI directory, along with
          shadcn&apos;s <code>alert</code> and <code>button</code> if you do not
          have them yet. It uses your existing theme tokens and installs no
          global styles, date library or drug database.
        </p>
        <a className="underline" href="/r/medication-schedule.json">
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Connect your data</h2>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Data wiring example"
          className={codeBlock}
        >
          {usage}
        </pre>
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
        <h2 className="text-2xl font-semibold">Dose tracking</h2>
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
        <h2 className="text-2xl font-semibold">Interaction warnings</h2>
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
        <h2 className="text-2xl font-semibold">Customize</h2>
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
          notifications, as-needed dosing, titration or dose calculations. Built
          on shadcn&apos;s Base UI components; compatibility with Radix-based
          presets is not claimed.
        </p>
      </section>
    </div>
  )
}
