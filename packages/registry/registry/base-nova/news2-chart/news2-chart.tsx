import * as React from "react"
import { cn } from "cn"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IconPlaceholder } from "@/icons/icon-placeholder"

/** ACVPU: alert, or new confusion, or responding only to voice or pain, or unresponsive. */
export type Consciousness =
  "alert" | "confusion" | "voice" | "pain" | "unresponsive"

export type News2Observation = {
  /** An ISO 8601 date-time. */
  time: string
  /** Breaths per minute. */
  respirationRate?: number
  /** Percent. */
  spo2?: number
  /** Whether the patient is on supplemental oxygen. */
  onOxygen?: boolean
  /** mmHg. */
  systolic?: number
  /** Beats per minute. */
  pulse?: number
  consciousness?: Consciousness
  /** Degrees Celsius. */
  temperature?: number
}

export type News2Parameter =
  | "respirationRate"
  | "spo2"
  | "onOxygen"
  | "systolic"
  | "pulse"
  | "consciousness"
  | "temperature"

/**
 * Scale 1 for most patients; scale 2 only for those with hypercapnic
 * respiratory failure and a prescribed target of 88–92%.
 */
export type Spo2Scale = 1 | 2

export type News2Risk = "low" | "low-medium" | "medium" | "high"

export type News2Score = {
  /** Each parameter's points; null when it was not recorded. */
  points: Record<News2Parameter, number | null>
  /** The aggregate score; null unless every parameter was recorded. */
  total: number | null
  /** Null when the score is incomplete. */
  risk: News2Risk | null
}

export const news2Parameters: readonly News2Parameter[] = [
  "respirationRate",
  "spo2",
  "onOxygen",
  "systolic",
  "pulse",
  "consciousness",
  "temperature",
]

export const news2ParameterLabels: Record<News2Parameter, string> = {
  respirationRate: "Respirations",
  spo2: "SpO₂",
  onOxygen: "Air or oxygen",
  systolic: "Systolic BP",
  pulse: "Pulse",
  consciousness: "Consciousness",
  temperature: "Temperature",
}

/** What the Royal College of Physicians asks for at each level of risk. */
export const news2Responses: Record<
  News2Risk,
  { label: string; monitoring: string; response: string }
> = {
  low: {
    label: "Low",
    monitoring: "At least every 4–6 hours",
    response:
      "A registered nurse assesses and decides whether care or monitoring should change.",
  },
  "low-medium": {
    label: "Low–medium",
    monitoring: "At least hourly",
    response:
      "A single parameter scores 3: the nurse informs the medical team for an urgent ward-based review.",
  },
  medium: {
    label: "Medium",
    monitoring: "At least hourly",
    response:
      "Urgent response: the nurse informs the medical team at once for assessment by a clinician skilled in acute illness.",
  },
  high: {
    label: "High",
    monitoring: "Continuous",
    response:
      "Emergency response: assessment by a team with critical care skills, usually with transfer to a higher level of care.",
  },
}

// Points for a value against bands, each [upper limit, points] in order; a
// value above every limit scores `above`.
function band(value: number, bands: [number, number][], above: number) {
  return bands.find(([limit]) => value <= limit)?.[1] ?? above
}

function spo2Points(spo2: number, scale: Spo2Scale, onOxygen?: boolean) {
  if (scale === 1)
    return band(
      spo2,
      [
        [91, 3],
        [93, 2],
        [95, 1],
      ],
      0
    )
  if (spo2 <= 92 || !onOxygen)
    return band(
      spo2,
      [
        [83, 3],
        [85, 2],
        [87, 1],
      ],
      0
    )
  // On oxygen above the 88–92% target, scale 2 scores the excess.
  return band(
    spo2,
    [
      [94, 1],
      [96, 2],
    ],
    3
  )
}

/**
 * Scores a set of observations against the Royal College of Physicians'
 * NEWS2 chart (2017). Check it against the chart your organisation uses.
 */
export function news2Score(
  observation: Omit<News2Observation, "time">,
  spo2Scale: Spo2Scale = 1
): News2Score {
  const {
    respirationRate,
    spo2,
    onOxygen,
    systolic,
    pulse,
    consciousness,
    temperature,
  } = observation
  const points: Record<News2Parameter, number | null> = {
    respirationRate:
      respirationRate === undefined
        ? null
        : band(
            respirationRate,
            [
              [8, 3],
              [11, 1],
              [20, 0],
              [24, 2],
            ],
            3
          ),
    spo2: spo2 === undefined ? null : spo2Points(spo2, spo2Scale, onOxygen),
    onOxygen: onOxygen === undefined ? null : onOxygen ? 2 : 0,
    systolic:
      systolic === undefined
        ? null
        : band(
            systolic,
            [
              [90, 3],
              [100, 2],
              [110, 1],
              [219, 0],
            ],
            3
          ),
    pulse:
      pulse === undefined
        ? null
        : band(
            pulse,
            [
              [40, 3],
              [50, 1],
              [90, 0],
              [110, 1],
              [130, 2],
            ],
            3
          ),
    consciousness:
      consciousness === undefined ? null : consciousness === "alert" ? 0 : 3,
    temperature:
      temperature === undefined
        ? null
        : band(
            temperature,
            [
              [35, 3],
              [36, 1],
              [38, 0],
              [39, 1],
            ],
            2
          ),
  }
  const values = Object.values(points)
  if (values.some((value) => value === null))
    return { points, total: null, risk: null }
  const total = (values as number[]).reduce((sum, value) => sum + value, 0)
  const risk: News2Risk =
    total >= 7
      ? "high"
      : total >= 5
        ? "medium"
        : values.includes(3)
          ? "low-medium"
          : "low"
  return { points, total, risk }
}

export type News2ChartProps = React.ComponentProps<"div"> & {
  /** Sets of observations, in any order; the newest shows first. */
  observations: readonly News2Observation[]
  /** The SpO₂ scale the patient is prescribed. Defaults to 1. */
  spo2Scale?: Spo2Scale
  /** Names the table for assistive technology and shows below it. */
  caption?: React.ReactNode
  /**
   * Defaults to a UTC date and 24-hour time such as "Oct 25, 14:00"; the
   * column headings then show the day only where it changes.
   */
  formatTime?: (time: string) => string
}

const timeFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "UTC",
})

const dayFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
})

const clockFormat = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "UTC",
})

// A fixed locale and time zone render the same on the server and the client.
function defaultFormatTime(time: string) {
  const parsed = Date.parse(time)
  return Number.isNaN(parsed) ? time : timeFormat.format(parsed)
}

/**
 * A column heading with the default format: the time, and the day above it
 * only where the day changes, so columns stay narrow. The day is still read
 * out on every column.
 */
function DefaultTimeHeading({
  time,
  previous,
}: {
  time: string
  previous?: string
}) {
  const parsed = Date.parse(time)
  if (Number.isNaN(parsed)) return time
  const day = dayFormat.format(parsed)
  // A previous time that doesn't parse shows verbatim, so this one shows its day.
  const before = previous === undefined ? NaN : Date.parse(previous)
  const newDay = Number.isNaN(before) || dayFormat.format(before) !== day
  return (
    <>
      <span
        className={cn(
          "block text-xs font-normal text-muted-foreground",
          !newDay && "sr-only"
        )}
      >
        {day}
      </span>
      {clockFormat.format(parsed)}
    </>
  )
}

const consciousnessLabels: Record<Consciousness, string> = {
  alert: "Alert",
  confusion: "New confusion",
  voice: "Voice",
  pain: "Pain",
  unresponsive: "Unresponsive",
}

function formatReading(
  parameter: News2Parameter,
  observation: News2Observation
) {
  switch (parameter) {
    case "onOxygen":
      if (observation.onOxygen === undefined) return undefined
      if (!observation.onOxygen) return "Air"
      // As the NEWS2 chart writes it, narrow enough for an equal column.
      return (
        <>
          <span aria-hidden>O₂</span>
          <span className="sr-only">Oxygen</span>
        </>
      )
    case "consciousness":
      return observation.consciousness
        ? consciousnessLabels[observation.consciousness]
        : undefined
    case "temperature":
      return observation.temperature?.toFixed(1)
    default:
      return observation[parameter]?.toString()
  }
}

const units: Partial<Record<News2Parameter, string>> = {
  respirationRate: "/min",
  spo2: "%",
  systolic: "mmHg",
  pulse: "/min",
  temperature: "°C",
}

// The parameter column stays put while the sets scroll under it, so it needs
// a solid background: the surface it sits on, page or card, with the row's
// hover tint mixed in.
const sticky =
  "sticky left-0 z-10 bg-(--news2-surface) group-hover/row:bg-[color-mix(in_oklab,var(--muted)_50%,var(--news2-surface))]"

function Alarm() {
  return (
    <IconPlaceholder
      lucide="TriangleAlertIcon"
      tabler="IconAlertTriangle"
      hugeicons="Alert02Icon"
      phosphor="WarningIcon"
      remixicon="RiErrorWarningLine"
      aria-hidden="true"
      className="size-4 shrink-0"
    />
  )
}

function Points({ points }: { points: number }) {
  return (
    <span
      data-slot="news2-points"
      data-points={points}
      className={cn(
        "ml-1.5 inline-flex min-w-5 items-center justify-center rounded-sm border border-transparent px-1 text-xs tabular-nums",
        points === 0 && "text-muted-foreground",
        points > 0 && "font-semibold",
        // A single parameter scoring 3 calls for an urgent review.
        points === 3 && "border-destructive text-destructive"
      )}
    >
      <span className="sr-only">, scores </span>
      {points}
    </span>
  )
}

/** The latest complete score, its risk and the response it calls for. */
export function News2Summary({
  score,
  className,
}: {
  score: News2Score
  className?: string
}) {
  if (score.total === null || score.risk === null)
    return (
      <p
        data-slot="news2-summary"
        data-risk="incomplete"
        className={cn("text-sm text-muted-foreground", className)}
      >
        NEWS2 incomplete: every parameter is needed for a score.
      </p>
    )
  const { label, ...advice } = news2Responses[score.risk]
  // A score of 0 needs only routine observations.
  const { monitoring, response } =
    score.total === 0
      ? {
          monitoring: "At least every 12 hours",
          response: "Continue routine care.",
        }
      : advice
  const critical = score.risk === "high"
  return (
    <div
      data-slot="news2-summary"
      data-risk={score.risk}
      className={cn("flex flex-col gap-1 text-sm", className)}
    >
      <p
        className={cn(
          "inline-flex items-center gap-1.5 font-semibold",
          critical && "text-destructive"
        )}
      >
        {score.risk !== "low" && <Alarm />}
        NEWS2 {score.total} · {label} risk
      </p>
      <p className="text-muted-foreground">
        {response} Monitoring: {monitoring.toLowerCase()}.
      </p>
    </div>
  )
}

export function News2Chart({
  observations,
  spo2Scale = 1,
  caption,
  formatTime = defaultFormatTime,
  className,
  ...props
}: News2ChartProps) {
  const columns = [...observations]
    .sort((a, b) => Date.parse(b.time) - Date.parse(a.time))
    .map((observation) => ({
      observation,
      score: news2Score(observation, spo2Scale),
    }))
  const latest = columns[0]
  const first = columns.at(-1)
  // The span of times names the scrolling region, so several charts on one
  // page are told apart.
  const label = !first
    ? "NEWS2 observations"
    : first === latest
      ? `NEWS2 observations, ${formatTime(first.observation.time)}`
      : `NEWS2 observations, ${formatTime(first.observation.time)} to ${formatTime(latest!.observation.time)}`
  return (
    <div
      data-slot="news2-chart"
      className={cn(
        "flex w-full min-w-0 flex-col gap-3 [--news2-surface:var(--background)] in-data-[slot=card]:[--news2-surface:var(--card)]",
        className
      )}
      {...props}
    >
      {latest && <News2Summary score={latest.score} />}
      {/* A long run of sets scrolls here, where the keyboard can reach it. */}
      <div
        role="region"
        aria-label={label}
        tabIndex={0}
        className="w-full overflow-x-auto rounded-md focus-visible:outline-2 focus-visible:outline-ring [&_[data-slot=table-container]]:overflow-visible"
      >
        <Table>
          {caption && <TableCaption>{caption}</TableCaption>}
          <TableHeader>
            <TableRow className="group/row">
              <TableHead scope="col" className={sticky}>
                <span className="sr-only">Parameter</span>
              </TableHead>
              {columns.map(({ observation }, index) => (
                <TableHead
                  key={observation.time}
                  scope="col"
                  // Every set gets the same width, whatever its readings.
                  style={{ width: `${100 / columns.length}%` }}
                  className="h-auto py-2 text-right align-bottom tabular-nums"
                >
                  {formatTime === defaultFormatTime ? (
                    <DefaultTimeHeading
                      time={observation.time}
                      previous={columns[index - 1]?.observation.time}
                    />
                  ) : (
                    formatTime(observation.time)
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {columns.length === 0 && (
              <TableRow>
                <TableCell className="h-16 text-center text-muted-foreground">
                  No observations.
                </TableCell>
              </TableRow>
            )}
            {columns.length > 0 &&
              news2Parameters.map((parameter) => (
                <TableRow
                  key={parameter}
                  data-parameter={parameter}
                  className="group/row"
                >
                  <TableHead scope="row" className={cn(sticky, "font-normal")}>
                    {news2ParameterLabels[parameter]}
                    {parameter === "spo2" && (
                      <span className="text-muted-foreground">
                        {" "}
                        (scale {spo2Scale})
                      </span>
                    )}
                    {units[parameter] && (
                      <span className="text-xs text-muted-foreground">
                        {" "}
                        {units[parameter]}
                      </span>
                    )}
                  </TableHead>
                  {columns.map(({ observation, score }) => {
                    const reading = formatReading(parameter, observation)
                    const points = score.points[parameter]
                    return (
                      <TableCell
                        key={observation.time}
                        className="text-right tabular-nums"
                      >
                        {reading === undefined ? (
                          <>
                            <span aria-hidden className="text-muted-foreground">
                              —
                            </span>
                            <span className="sr-only">Not recorded</span>
                          </>
                        ) : (
                          <>
                            {reading}
                            {points !== null && <Points points={points} />}
                          </>
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            {columns.length > 0 && (
              <TableRow className="group/row border-t-2">
                <TableHead scope="row" className={cn(sticky, "font-semibold")}>
                  NEWS2
                </TableHead>
                {columns.map(({ observation, score }) => (
                  <TableCell
                    key={observation.time}
                    data-risk={score.risk ?? "incomplete"}
                    className={cn(
                      "text-right font-semibold tabular-nums",
                      score.risk === "high" && "text-destructive"
                    )}
                  >
                    {score.total === null ? (
                      <span className="font-normal text-muted-foreground">
                        Incomplete
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        {score.risk !== "low" && <Alarm />}
                        {score.total}
                        {/* As wide as a reading's points, so totals line up
                            with the readings above them. */}
                        <span aria-hidden className="ml-0.5 min-w-5" />
                      </span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
