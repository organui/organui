import type { ItemDoc } from "@/components/item-docs"

// The content of each utility's page: how to use its classes, the styles
// each one sets, and what to know before relying on them.
export const utilityDocs: Record<string, ItemDoc> = {
  heartbeat: {
    usageLang: "tsx",
    usage: `<HeartIcon className="animate-heartbeat heartbeat-rate-72" />`,
    reference: [
      {
        name: "animate-heartbeat",
        description:
          "animation: heartbeat var(--heartbeat-duration, 1s) ease-in-out infinite; none for people who prefer reduced motion.",
      },
      {
        name: "heartbeat-rate-<number>",
        description:
          "--heartbeat-duration: calc(60s / <number>); one beat per minute at that rate.",
      },
      {
        name: "--heartbeat-duration",
        description:
          'Set it inline for a rate that changes, such as style={{ "--heartbeat-duration": `${60 / bpm}s` }}.',
      },
    ],
    notes: [
      "The pulse is decorative. Show the rate as text too, and don't let the animation stand in for a monitor.",
    ],
  },
  "ecg-grid": {
    usageLang: "tsx",
    usage: `<div className="h-40 rounded-lg border bg-ecg-grid">
  {/* Your trace, such as an SVG path */}
</div>`,
    reference: [
      {
        name: "bg-ecg-grid",
        description:
          "Draws ECG paper: a fine line every --ecg-grid-size (4px by default) and a bolder line every fifth.",
      },
      {
        name: "ecg-grid-size-<number>",
        description: "--ecg-grid-size: calc(var(--spacing) * <number>);",
      },
      {
        name: "ecg-grid-color-<color>",
        description:
          "--ecg-grid-color: <color>; any theme colour, such as ecg-grid-color-sky-500, or a value in brackets. Red by default.",
      },
    ],
    notes: [
      "The grid sets no paper speed. At 25 mm/s with 1 mm squares, one small square is 40 ms and one large square 200 ms; scale your trace to match.",
      "The ECG trace component draws its own grid on its canvas. Use this utility for static strips, thumbnails and backgrounds.",
    ],
  },
  severity: {
    usageLang: "tsx",
    usage: `<p className="text-severity-critical">Potassium 6.4 mmol/L, critical high</p>
<div className="border-severity-warning/30 bg-severity-warning/10">…</div>`,
    reference: [
      {
        name: "text-, bg-, border-severity-normal",
        description: "Results within range. --severity-normal.",
      },
      {
        name: "text-, bg-, border-severity-info",
        description: "Notes and pending work. --severity-info.",
      },
      {
        name: "text-, bg-, border-severity-warning",
        description: "Results out of range. --severity-warning.",
      },
      {
        name: "text-, bg-, border-severity-critical",
        description: "Results that need action now. --severity-critical.",
      },
    ],
    notes: [
      "Each colour reaches 4.5:1 as text on the default light and dark backgrounds, and on its own 10% tint. Change the variables in :root and .dark to match your theme.",
      "Colour alone doesn't carry meaning for everyone: pair it with text or an icon, as the lab results table does.",
    ],
  },
}
