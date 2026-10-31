"use client"

import * as React from "react"
import { cn } from "cn"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  OrganViewer,
  type OrganModel,
  type OrganViewerHandle,
  type OrganViewerProps,
} from "@/components/organ-viewer"
import { IconPlaceholder } from "@/icons/icon-placeholder"

export type TourCaption = {
  /** What to say at this step, in the reader's own language. */
  text: string
  /** The structure to highlight, by ID in the chapter's model. */
  structureId?: string
  /** The named view of the chapter's model to show. */
  view?: string
}

export type TourQuestion = {
  /** What to check, such as "Why do we keep checking your ALT?". */
  question: string
  options: readonly string[]
  /** The index of the right option. */
  answer: number
  /** Shown once the reader answers, right or wrong. */
  explanation: string
}

export type TourChapter = {
  id: string
  /** The name the chapter list shows, such as "Inside the liver". */
  label: string
  /** The model to show, such as an organ's or `conditionModel`'s. */
  model: OrganModel
  /** How wide the subject is in life, in millimetres, for the scale readout. */
  span: number
  captions: readonly TourCaption[]
  /** The question that closes the chapter. */
  question?: TourQuestion
}

export type Tour = {
  name: string
  /** In the order they are told, the default first. */
  chapters: readonly TourChapter[]
}

/** A size in millimetres, to two significant figures, in the unit that reads best. */
export function formatSpan(millimetres: number) {
  const [value, unit] =
    millimetres >= 10
      ? [millimetres / 10, "cm"]
      : millimetres >= 1
        ? [millimetres, "mm"]
        : [millimetres * 1000, "µm"]
  return `${Number(value.toPrecision(2))} ${unit}`
}

/** How far a chapter is magnified from the tour's widest, to two significant figures. */
export function tourMagnification(tour: Tour, chapter: TourChapter) {
  const widest = Math.max(...tour.chapters.map(({ span }) => span))
  return Number((widest / chapter.span).toPrecision(2))
}

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

export type OrganTourProps = Omit<
  OrganViewerProps,
  "model" | "src" | "selectedId" | "onSelectionChange" | "defaultView" | "ref"
> & {
  /** The tour: its chapters, captions and questions. */
  tour: Tour
  /** The chapter shown, by ID. */
  chapter?: string
  /** The chapter shown first when `chapter` is not set. Defaults to the first. */
  defaultChapter?: string
  /** Called with the chapter a reader moves to. */
  onChapterChange?: (chapter: string) => void
  /** Called with a chapter's ID and whether the reader answered its question rightly, for your own record of the conversation. */
  onAnswer?: (chapter: string, correct: boolean) => void
}

export function OrganTour({
  tour,
  chapter: chapterProp,
  defaultChapter = tour.chapters[0]!.id,
  onChapterChange,
  onAnswer,
  label,
  className,
  ...props
}: OrganTourProps) {
  const [chapterId, setChapterId] = useControllable(
    chapterProp,
    defaultChapter,
    onChapterChange
  )
  const chapters = tour.chapters
  const index = Math.max(
    chapters.findIndex(({ id }) => id === chapterId),
    0
  )
  const chapter = chapters[index]!
  // Where the reader is in the chapter. It belongs to one chapter, so a
  // chapter changed from outside starts at its first step.
  const [place, setPlace] = React.useState({
    id: chapter.id,
    step: 0,
    choice: null as number | null,
    picked: null as string | null,
  })
  const here =
    place.id === chapter.id
      ? place
      : { id: chapter.id, step: 0, choice: null, picked: null }
  const { step, choice, picked } = here
  const [results, setResults] = React.useState<Record<string, boolean>>({})
  const [finished, setFinished] = React.useState(false)

  const caption = chapter.captions[step]
  const selectedId = picked ?? caption?.structureId ?? null
  const structure = chapter.model.structures.find(({ id }) => id === selectedId)
  // The view this step shows, so a model that finishes loading after the
  // reader has moved on still opens where they are.
  const view = chapter.captions
    .slice(0, step + 1)
    .reduce((shown, item) => item.view ?? shown, chapter.model.defaultView)
  const viewer = React.useRef<OrganViewerHandle>(null)
  const stepView = caption?.view
  React.useEffect(() => {
    if (stepView) viewer.current?.setView(stepView)
  }, [stepView, step])

  const go = (id: string) => {
    setFinished(false)
    setPlace({ id, step: 0, choice: null, picked: null })
    if (id !== chapter.id) setChapterId(id)
  }
  const stepTo = (next: number) =>
    setPlace({ ...here, step: next, picked: null })
  const answer = (option: number) => {
    if (choice !== null || !chapter.question) return
    const correct = option === chapter.question.answer
    setPlace({ ...here, choice: option })
    setResults((current) => ({ ...current, [chapter.id]: correct }))
    onAnswer?.(chapter.id, correct)
  }

  const steps = chapter.captions.length + (chapter.question ? 1 : 0)
  const next = chapters[index + 1]
  const lastStep = step >= steps - 1
  const onNext = () => {
    if (!lastStep) stepTo(step + 1)
    else if (next) go(next.id)
    else setFinished(true)
  }
  const onBack = () => {
    if (step > 0) stepTo(step - 1)
    else if (index > 0) go(chapters[index - 1]!.id)
  }

  const magnification = tourMagnification(tour, chapter)
  const asked = chapters.filter(({ question }) => question)
  return (
    // Side by side when the component itself is wide enough, so it fits a
    // narrow column as well as a full page.
    <div data-slot="organ-tour" className={cn("@container min-w-0", className)}>
      <div className="grid gap-4 @3xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="relative min-w-0">
          <OrganViewer
            // Each chapter is its own model file and set of views.
            key={chapter.id}
            ref={viewer}
            model={chapter.model}
            selectedId={selectedId}
            onSelectionChange={(id) => setPlace({ ...here, picked: id })}
            defaultView={view}
            label={label ?? `${tour.name}: ${chapter.label}`}
            {...props}
          />
          <Badge
            variant="secondary"
            data-slot="organ-tour-scale"
            className="pointer-events-none absolute top-3 left-3 font-mono"
          >
            ×{magnification.toLocaleString("en")} · {formatSpan(chapter.span)}
          </Badge>
        </div>
        {/* Beside the model, the panel takes the height the model sets, rather
            than setting it. Its content scrolls and the buttons stay in view,
            as an answer's explanation can run long. */}
        <section
          aria-label={tour.name}
          className="flex min-w-0 flex-col gap-4 rounded-xl border p-4 text-sm @3xl:h-0 @3xl:min-h-full"
        >
          <div className="flex min-h-0 flex-1 flex-col gap-5 @3xl:overflow-y-auto">
            {finished ? (
              <TourSummary chapters={asked} results={results} onReview={go} />
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <div aria-hidden="true" className="flex gap-1">
                    {Array.from({ length: steps }, (_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-1 flex-1 rounded-full",
                          i <= step ? "bg-primary" : "bg-muted"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {chapter.label} · step {step + 1} of {steps}
                  </p>
                </div>
                {caption ? (
                  <div
                    aria-live="polite"
                    className="flex flex-col items-start gap-2"
                  >
                    <p className="text-base leading-snug">{caption.text}</p>
                    {structure && (
                      <Badge variant="outline">{structure.label}</Badge>
                    )}
                  </div>
                ) : (
                  chapter.question && (
                    <TourCheck
                      question={chapter.question}
                      choice={choice}
                      onAnswer={answer}
                      onReview={() => go(chapter.id)}
                    />
                  )
                )}
              </div>
            )}
            <ol aria-label="Chapters" className="mt-auto flex flex-col gap-0.5">
              {chapters.map((item) => {
                const current = !finished && item.id === chapter.id
                const result = results[item.id]
                return (
                  <li key={item.id}>
                    <Button
                      variant={current ? "secondary" : "ghost"}
                      size="sm"
                      aria-current={current ? "step" : undefined}
                      onClick={() => go(item.id)}
                      className="w-full justify-start gap-2 font-normal"
                    >
                      <span className="min-w-0 flex-1 truncate text-left">
                        {item.label}
                      </span>
                      {result !== undefined && (
                        <TourResult correct={result} className="size-3.5" />
                      )}
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatSpan(item.span)}
                      </span>
                    </Button>
                  </li>
                )
              })}
            </ol>
          </div>
          {!finished && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onBack}
                disabled={index === 0 && step === 0}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={onNext}
                disabled={!caption && choice === null}
              >
                {!lastStep
                  ? step === chapter.captions.length - 1
                    ? "Check understanding"
                    : "Next"
                  : next
                    ? `Next: ${next.label}`
                    : "Finish"}
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function TourResult({
  correct,
  label = correct ? "Understood" : "Needs going over",
  className,
}: {
  correct: boolean
  /** What the icon means here, for screen readers. */
  label?: string
  className?: string
}) {
  return (
    <>
      {correct ? (
        <IconPlaceholder
          lucide="CheckIcon"
          tabler="IconCheck"
          hugeicons="Tick02Icon"
          phosphor="CheckIcon"
          remixicon="RiCheckLine"
          aria-hidden="true"
          className={className}
        />
      ) : (
        <IconPlaceholder
          lucide="XIcon"
          tabler="IconX"
          hugeicons="Cancel01Icon"
          phosphor="XIcon"
          remixicon="RiCloseLine"
          aria-hidden="true"
          className={className}
        />
      )}
      <span className="sr-only">{label}</span>
    </>
  )
}

// One answer: a reader who chooses wrongly hears the explanation and goes over
// the chapter again, rather than trying the remaining options until one fits.
function TourCheck({
  question,
  choice,
  onAnswer,
  onReview,
}: {
  question: TourQuestion
  choice: number | null
  onAnswer: (option: number) => void
  onReview: () => void
}) {
  const answered = choice !== null
  const correct = choice === question.answer
  // The explanation is what the reader needs next, and in the panel beside the
  // model it can open below the fold.
  const explanation = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (answered) explanation.current?.scrollIntoView({ block: "nearest" })
  }, [answered])
  return (
    <div className="flex flex-col gap-3">
      <p className="text-base leading-snug font-medium">{question.question}</p>
      <div role="group" aria-label="Answers" className="flex flex-col gap-2">
        {question.options.map((option, index) => {
          const right = answered && index === question.answer
          const chosen = index === choice
          return (
            // Stays focusable once answered, so focus is not lost, but does
            // nothing more.
            <Button
              key={option}
              variant="outline"
              aria-pressed={chosen}
              aria-disabled={answered}
              onClick={() => onAnswer(index)}
              className={cn(
                "h-auto justify-start py-2 text-left whitespace-normal",
                answered && "cursor-default",
                right && "font-semibold",
                answered && !right && !chosen && "text-muted-foreground"
              )}
            >
              <span className="min-w-0 flex-1">{option}</span>
              {(right || chosen) && (
                <TourResult
                  correct={right}
                  label={right ? "Right answer" : "Your answer"}
                />
              )}
            </Button>
          )
        })}
      </div>
      {answered && (
        <Alert ref={explanation}>
          <AlertTitle>{correct ? "That's right" : "Not quite"}</AlertTitle>
          <AlertDescription>
            <p>{question.explanation}</p>
            {!correct && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReview}
                className="mt-2 text-foreground"
              >
                Go over this again
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

// The questions are there to find what needs explaining again, so the summary
// names those chapters and goes straight back to them.
function TourSummary({
  chapters,
  results,
  onReview,
}: {
  chapters: readonly TourChapter[]
  results: Readonly<Record<string, boolean>>
  onReview: (chapter: string) => void
}) {
  const understood = chapters.filter(({ id }) => results[id]).length
  return (
    <div aria-live="polite" className="flex flex-col gap-3">
      <p className="text-base font-medium">
        {chapters.length
          ? `${understood} of ${chapters.length} understood`
          : "Tour finished"}
      </p>
      {chapters.length > 0 && (
        <ul className="flex flex-col gap-2">
          {chapters.map(({ id, label }) => (
            <li key={id} className="flex min-h-7 items-center gap-2">
              {results[id] !== undefined && (
                <TourResult correct={results[id]} className="size-3.5" />
              )}
              <span className="min-w-0 flex-1">{label}</span>
              {!results[id] && (
                <Button
                  variant="outline"
                  size="xs"
                  aria-label={`Go over ${label}`}
                  onClick={() => onReview(id)}
                >
                  Go over
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
