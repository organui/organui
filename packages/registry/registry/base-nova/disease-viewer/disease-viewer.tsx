"use client"

import * as React from "react"
import { cn } from "cn"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  diseaseModel,
  scaleOf,
  stageOf,
  type Disease,
  type DiseaseEvent,
  type DiseaseInvestigation,
  type DiseaseScale,
  type DiseaseStage,
} from "@/components/disease-model"
import {
  OrganViewer,
  type OrganModel,
  type OrganViewerProps,
} from "@/components/organ-viewer"
import { IconPlaceholder } from "@/icons/icon-placeholder"

function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
) {
  const [inner, setInner] = React.useState(defaultValue)
  const controlled = value !== undefined
  const set = React.useCallback(
    (next: T) => {
      if (!controlled) setInner(next)
      onChange?.(next)
    },
    [controlled, onChange]
  )
  return [controlled ? value : inner, set] as const
}

export type DiseaseViewerProps = Omit<
  OrganViewerProps,
  "model" | "selectedId" | "onSelectionChange"
> & {
  /** The disease: its scales, stages, findings and investigations. */
  disease: Disease
  /** The scale shown, by ID. */
  scale?: string
  /** The scale shown first when `scale` is not set. Defaults to the first. */
  defaultScale?: string
  /** Called with the scale a reader chooses. */
  onScaleChange?: (scale: string) => void
  /** The stage shown, by ID. */
  stage?: string
  /** The stage shown first when `stage` is not set. Defaults to the first. */
  defaultStage?: string
  /** Called with the stage a reader chooses. */
  onStageChange?: (stage: string) => void
  /** The selected structure ID, or null. */
  selectedId?: string | null
  /** Called with the structure a reader selects, or null when they clear it. */
  onSelectionChange?: (id: string | null) => void
  /** Shows the panel with the scales, findings and investigations. Defaults to true. */
  panel?: boolean
  /** Shows the course under the model as a timeline, with its events and a play button. Defaults to true; a disease with one stage has none. */
  timeline?: boolean
}

export function DiseaseViewer({
  disease,
  scale: scaleProp,
  defaultScale = disease.scales[0]!.id,
  onScaleChange,
  stage: stageProp,
  defaultStage = disease.stages?.[0]?.id ?? "",
  onStageChange,
  selectedId: selectedProp,
  onSelectionChange,
  panel = true,
  timeline = true,
  label,
  className,
  ...props
}: DiseaseViewerProps) {
  const [scaleId, setScaleId] = useControllable(
    scaleProp,
    defaultScale,
    onScaleChange
  )
  const [stageId, setStageId] = useControllable(
    stageProp,
    defaultStage,
    onStageChange
  )
  const [selectedId, setSelectedId] = useControllable<string | null>(
    selectedProp,
    null,
    onSelectionChange
  )
  const scale = scaleOf(disease, scaleId)
  const stage = stageOf(disease, stageId)
  const model = React.useMemo(
    () => diseaseModel(disease, scale.id, stage?.id),
    [disease, scale.id, stage?.id]
  )
  const changeScale = (next: string) => {
    if (next === scale.id) return
    setScaleId(next)
    // Each scale has its own structures.
    setSelectedId(null)
  }
  return (
    // Side by side when the component itself is wide enough, so it fits a
    // narrow column as well as a full page.
    <div
      data-slot="disease-viewer"
      className={cn("@container min-w-0", className)}
    >
      <div
        className={cn(
          "grid gap-4",
          panel && "@3xl:grid-cols-[minmax(0,1fr)_20rem]"
        )}
      >
        <div className="flex min-w-0 flex-col gap-3">
          <OrganViewer
            // A new scale is a new model file.
            key={scale.id}
            model={model}
            selectedId={selectedId}
            onSelectionChange={setSelectedId}
            label={
              label ??
              `Interactive ${disease.name.toLowerCase()} model${
                disease.scales.length > 1
                  ? `, ${scale.label.toLowerCase()}`
                  : ""
              }`
            }
            {...props}
          />
          {timeline && stage && (disease.stages?.length ?? 0) > 1 && (
            <DiseaseTimeline
              disease={disease}
              stage={stage}
              onStageChange={setStageId}
            />
          )}
        </div>
        {panel && (
          <DiseasePanel
            disease={disease}
            model={model}
            scale={scale}
            stage={stage}
            selectedId={selectedId}
            onScaleChange={changeScale}
            onSelectionChange={setSelectedId}
          />
        )}
      </div>
    </div>
  )
}

function DiseasePanel({
  disease,
  model,
  scale,
  stage,
  selectedId,
  onScaleChange,
  onSelectionChange,
}: {
  disease: Disease
  model: OrganModel
  scale: DiseaseScale
  stage?: DiseaseStage
  selectedId: string | null
  onScaleChange: (scale: string) => void
  onSelectionChange: (id: string | null) => void
}) {
  const title = React.useId()
  const investigations = stage?.investigations ?? disease.investigations ?? []
  return (
    // Beside the model, the panel takes the height the model and timeline
    // set, rather than setting it, and scrolls.
    <section
      aria-labelledby={title}
      className="flex min-w-0 flex-col gap-5 rounded-xl border p-4 text-sm @3xl:h-0 @3xl:min-h-full @3xl:overflow-y-auto"
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-3">
          <p id={title} className="leading-snug font-semibold">
            {disease.name}
          </p>
          <Badge variant="outline" className="shrink-0 font-mono">
            <span className="sr-only">ICD-10 </span>
            {disease.code}
          </Badge>
        </div>
        <p className="text-muted-foreground">{disease.summary}</p>
      </div>
      {disease.scales.length > 1 && (
        <Choice
          label="Scale"
          options={disease.scales}
          value={scale.id}
          onChange={onScaleChange}
        />
      )}
      <Findings
        // Each scale starts with its spared structures folded.
        key={scale.id}
        model={model}
        noted={
          new Set(
            Object.keys({
              ...scale.findings,
              ...stage?.findings?.[scale.id],
            })
          )
        }
        selectedId={selectedId}
        onSelectionChange={onSelectionChange}
      />
      {investigations.length > 0 && (
        <Investigations investigations={investigations} />
      )}
    </section>
  )
}

// The course as a timeline: each stage at its typical time, the events along
// it, and play to step through. The model recolours as the stage changes.
function DiseaseTimeline({
  disease,
  stage,
  onStageChange,
}: {
  disease: Disease
  stage: DiseaseStage
  onStageChange: (stage: string) => void
}) {
  const stages = React.useMemo(() => disease.stages ?? [], [disease.stages])
  const index = stages.findIndex(({ id }) => id === stage.id)
  const [playing, setPlaying] = React.useState(false)
  const [event, setEvent] = React.useState<DiseaseEvent | null>(null)
  // Each stage shows for a few seconds, then the next; playing stops on the
  // last stage of the course.
  React.useEffect(() => {
    const next = stages[index + 1]
    if (!playing || !next) return
    const timer = setTimeout(() => {
      onStageChange(next.id)
      if (index + 2 === stages.length) setPlaying(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [playing, index, stages, onStageChange])
  const choose = (id: string) => {
    setPlaying(false)
    setEvent(null)
    onStageChange(id)
  }
  const shown = event?.stage === stage.id ? event : null
  return (
    <div
      data-slot="disease-timeline"
      className="flex min-w-0 flex-col gap-3 rounded-xl border p-3 text-sm"
    >
      <div className="flex items-start gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={playing ? "Pause the course" : "Play the course"}
          onClick={() => {
            setEvent(null)
            // Playing from the end starts the course again.
            if (!playing && index === stages.length - 1)
              onStageChange(stages[0]!.id)
            setPlaying(!playing)
          }}
          className="mt-0.5 shrink-0"
        >
          {playing ? (
            <IconPlaceholder
              lucide="PauseIcon"
              tabler="IconPlayerPause"
              hugeicons="PauseIcon"
              phosphor="PauseIcon"
              remixicon="RiPauseLine"
              aria-hidden="true"
            />
          ) : (
            <IconPlaceholder
              lucide="PlayIcon"
              tabler="IconPlayerPlay"
              hugeicons="PlayIcon"
              phosphor="PlayIcon"
              remixicon="RiPlayLine"
              aria-hidden="true"
            />
          )}
        </Button>
        <ol
          aria-label="Course"
          className="grid min-w-0 flex-1"
          style={{
            gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))`,
          }}
        >
          {stages.map((item, i) => {
            const current = i === index
            const reached = i <= index
            const events = (disease.events ?? []).filter(
              (entry) => entry.stage === item.id
            )
            return (
              <li key={item.id} className="flex min-w-0 flex-col gap-1">
                {/* The track: a line in from the previous stage, a dot, and a
                    line out to the next. An alternative stage is dashed. */}
                <div aria-hidden="true" className="flex h-3 items-center">
                  <Segment
                    hidden={i === 0}
                    reached={reached}
                    dashed={item.alternative}
                  />
                  <span
                    className={cn(
                      "size-2.5 shrink-0 rounded-full border-2 border-foreground/30 bg-background transition-colors",
                      reached && "border-foreground",
                      current && "bg-foreground"
                    )}
                  />
                  <Segment
                    hidden={i === stages.length - 1}
                    reached={i < index}
                    dashed={stages[i + 1]?.alternative}
                  />
                </div>
                <button
                  type="button"
                  aria-pressed={current}
                  onClick={() => choose(item.id)}
                  className="flex flex-col items-center rounded-md px-1 py-0.5 text-center transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <span
                    className={cn(
                      "leading-snug text-muted-foreground",
                      current && "font-medium text-foreground"
                    )}
                  >
                    {item.alternative && (
                      <span className="font-normal text-muted-foreground">
                        or{" "}
                      </span>
                    )}
                    {item.label}
                  </span>
                  {item.time && (
                    <span className="text-xs text-muted-foreground">
                      {item.time}
                    </span>
                  )}
                </button>
                {events.length > 0 && (
                  <ul className="flex flex-col items-center gap-0.5">
                    {events.map((entry) => (
                      <li key={entry.label}>
                        <button
                          type="button"
                          aria-pressed={shown === entry}
                          onClick={() => {
                            setPlaying(false)
                            onStageChange(entry.stage)
                            setEvent(shown === entry ? null : entry)
                          }}
                          className="flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-pressed:bg-muted aria-pressed:text-foreground"
                        >
                          <span
                            aria-hidden="true"
                            className="size-1.5 shrink-0 rotate-45 bg-current"
                          />
                          {entry.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ol>
      </div>
      <p aria-live="polite" className="text-muted-foreground">
        {shown ? (
          <>
            <span className="font-medium text-foreground">
              {shown.label}
              {shown.time && `, ${shown.time.toLowerCase()}`}:
            </span>{" "}
            {shown.description}
          </>
        ) : (
          <>
            <span className="font-medium text-foreground">{stage.label}:</span>{" "}
            {stage.summary}
          </>
        )}
      </p>
    </div>
  )
}

function Segment({
  hidden,
  reached,
  dashed,
}: {
  hidden: boolean
  reached: boolean
  dashed?: boolean
}) {
  return (
    <span
      className={cn(
        "h-0 flex-1 border-t-2 border-foreground/15 transition-colors",
        reached && "border-foreground",
        dashed && "border-dashed",
        hidden && "invisible"
      )}
    />
  )
}

function Choice({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly { id: string; label: string }[]
  value: string
  onChange: (value: string) => void
}) {
  const id = React.useId()
  return (
    <div className="flex flex-col gap-1.5">
      <span id={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <div
        role="group"
        aria-labelledby={id}
        className="flex flex-wrap gap-0.5 rounded-lg bg-muted p-[3px]"
      >
        {options.map((option) => (
          <Button
            key={option.id}
            type="button"
            size="sm"
            variant="ghost"
            aria-pressed={option.id === value}
            onClick={() => onChange(option.id)}
            className="h-7 flex-1 px-2 text-muted-foreground aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

function Findings({
  model,
  noted,
  selectedId,
  onSelectionChange,
}: {
  model: OrganModel
  noted: ReadonlySet<string>
  selectedId: string | null
  onSelectionChange: (id: string | null) => void
}) {
  const list = React.useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = React.useState(false)
  // A structure picked in 3D scrolls its finding into view.
  React.useEffect(() => {
    if (!selectedId) return
    list.current
      ?.querySelector(`[data-structure="${CSS.escape(selectedId)}"]`)
      ?.scrollIntoView({ block: "nearest" })
  }, [selectedId])
  const row = (structure: OrganModel["structures"][number]) => {
    const selected = structure.id === selectedId
    const affected = structure.group === "Affected"
    return (
      <li key={structure.id} data-structure={structure.id}>
        <button
          type="button"
          aria-pressed={selected}
          onClick={() => onSelectionChange(selected ? null : structure.id)}
          className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring aria-pressed:bg-muted"
        >
          <span
            aria-hidden="true"
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: structure.color }}
          />
          <span className={cn("min-w-0 flex-1", affected && "font-medium")}>
            {structure.label}
          </span>
        </button>
        {selected && structure.description && (
          <p className="pt-1 pr-2 pb-2 pl-7 text-muted-foreground">
            {structure.description}
          </p>
        )}
      </li>
    )
  }
  const affected = model.structures.filter(({ group }) => group === "Affected")
  const spared = model.structures.filter(({ group }) => group === "Spared")
  // Spared structures the disease says something about come first; the rest
  // of the model folds away, unless one of them is selected.
  const shown = spared.filter(({ id }) => noted.has(id))
  const folded = spared.filter(({ id }) => !noted.has(id))
  const open = expanded || folded.some(({ id }) => id === selectedId)
  return (
    <div ref={list} className="flex flex-col gap-4">
      {affected.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            Affected · {affected.length}
          </span>
          <ul className="-mx-2 flex flex-col">{affected.map(row)}</ul>
        </div>
      )}
      {spared.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">
            Spared · {spared.length}
          </span>
          <ul className="-mx-2 flex flex-col">
            {shown.map(row)}
            {open && folded.map(row)}
          </ul>
          {folded.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-expanded={open}
              onClick={() => setExpanded(!open)}
              className="-mx-2 h-7 self-start px-2 text-muted-foreground"
            >
              {open
                ? "Show fewer"
                : `Show ${folded.length} more ${folded.length === 1 ? "structure" : "structures"}`}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

const flagLabels = { high: "High", low: "Low", abnormal: "Abnormal" }

function Investigations({
  investigations,
}: {
  investigations: readonly DiseaseInvestigation[]
}) {
  const id = React.useId()
  return (
    <div className="flex flex-col gap-1.5">
      <span id={id} className="text-xs font-medium text-muted-foreground">
        Investigations
      </span>
      <dl
        aria-labelledby={id}
        className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1.5"
      >
        {investigations.map(({ name, result, flag }) => (
          <React.Fragment key={name}>
            <dt className="text-muted-foreground">{name}</dt>
            <dd
              className={cn(
                "flex items-center justify-end gap-1 text-right",
                flag && "font-semibold"
              )}
            >
              {result}
              {flag && (
                <>
                  <FlagIcon flag={flag} />
                  <span className="sr-only">({flagLabels[flag]})</span>
                </>
              )}
            </dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
  )
}

function FlagIcon({
  flag,
}: {
  flag: NonNullable<DiseaseInvestigation["flag"]>
}) {
  if (flag === "high")
    return (
      <IconPlaceholder
        lucide="ArrowUpIcon"
        tabler="IconArrowUp"
        hugeicons="ArrowUpIcon"
        phosphor="ArrowUpIcon"
        remixicon="RiArrowUpLine"
        aria-hidden="true"
        className="size-4 shrink-0"
      />
    )
  if (flag === "low")
    return (
      <IconPlaceholder
        lucide="ArrowDownIcon"
        tabler="IconArrowDown"
        hugeicons="ArrowDownIcon"
        phosphor="ArrowDownIcon"
        remixicon="RiArrowDownLine"
        aria-hidden="true"
        className="size-4 shrink-0"
      />
    )
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
