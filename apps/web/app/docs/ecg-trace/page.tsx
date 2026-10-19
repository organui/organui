import { ComponentPreview } from "@/components/component-preview"
import {
  codeBlock,
  docsMetadata,
  registryNamespace,
  shadcn,
} from "@/lib/registry"
import { site } from "@/lib/site"

export const metadata = docsMetadata(
  "ECG trace",
  "A recorded or live ECG rhythm strip on standard paper, with labelled P, QRS and T waves.",
  "/docs/ecg-trace"
)

const recorded = `import { EcgTrace } from "@/components/ui/ecg-trace"

// Millivolts, sampled at 500 Hz.
<EcgTrace samples={leadII} sampleRate={500} lead="II" />`

const live = `"use client"
import { useMemo } from "react"
import { EcgTrace, type EcgStream } from "@/components/ui/ecg-trace"

export function Monitor({ socket }: { socket: WebSocket }) {
  const stream = useMemo<EcgStream>(() => ({
    subscribe(listener) {
      const read = (event: MessageEvent) => listener(JSON.parse(event.data))
      socket.addEventListener("message", read)
      return () => socket.removeEventListener("message", read)
    },
  }), [socket])
  return <EcgTrace stream={stream} sampleRate={250} duration={6} />
}`

const synthetic = `import {
  EcgTrace, syntheticEcg, syntheticEcgStream,
} from "@/components/ui/ecg-trace"

<EcgTrace samples={syntheticEcg({ heartRate: 60, duration: 10 })} />
<EcgTrace stream={syntheticEcgStream({ heartRate: 90 })} />`

export default function Page() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Components / Monitoring
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">ECG trace</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          A rhythm strip for a recorded trace or a live stream, drawn on
          standard ECG paper with its P, QRS and T waves labelled. Not for
          diagnostic use.
        </p>
      </header>
      <ComponentPreview name="ecg-trace-demo" />
      <section className="flex flex-col gap-4">
        <h2 id="installation" className="text-2xl font-semibold">
          Installation
        </h2>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Installation command"
          className={codeBlock}
        >
          {`bunx ${shadcn} add ${site.url}/r/ecg-trace.json`}
        </pre>
        <p>
          Or by name, with the OrganUI namespace in <code>components.json</code>
          : <code>bunx {shadcn} add @organui/ecg-trace</code>.
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
          The source installs into your configured UI directory, with
          shadcn&apos;s <code>button</code> for the live pause control. It draws
          with SVG and your theme tokens, and installs no chart or 3D packages.
        </p>
        <a className="underline" href="/r/ecg-trace.json">
          View registry item JSON
        </a>
      </section>
      <section className="flex flex-col gap-4">
        <h2 id="usage" className="text-2xl font-semibold">
          Usage
        </h2>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Recorded trace example"
          className={codeBlock}
        >
          {recorded}
        </pre>
        <p>
          Pass <code>samples</code> in millivolts and their{" "}
          <code>sampleRate</code> in hertz (250 by default). The strip shows the
          whole recording unless you set <code>duration</code> in seconds. One
          lead per component; stack several for a multi-lead view.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Live streams</h2>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Live stream example"
          className={codeBlock}
        >
          {live}
        </pre>
        <p>
          A <code>stream</code> is any object whose <code>subscribe</code> takes
          a listener for chunks of samples and returns an unsubscribe function.
          The strip sweeps like a bedside monitor: it overwrites the window in
          place, with a short blank bar ahead of the write head, and shows 6
          seconds unless you set <code>duration</code>. Memoize the stream so
          the sweep is not reset on every render. The Pause button freezes the
          sweep and drops samples until it resumes.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Paper, labels and rate</h2>
        <p>
          The grid follows standard ECG paper: 1 mm small boxes and 5 mm large
          boxes, at 25 mm/s and 10 mm/mV by default. Change <code>speed</code>{" "}
          and <code>gain</code> to match your device, and <code>range</code> for
          the millivolts shown (-1.5 to 2 by default). A 1 mV calibration pulse
          comes first unless <code>calibration=&#123;false&#125;</code>. On
          narrow screens the strip scrolls sideways rather than shrinking below
          3 pixels per millimetre.
        </p>
        <p>
          The grid is red, like printed ECG paper. To match your theme, set{" "}
          <code>--ecg-grid</code> to any colour in your CSS; the small and large
          boxes draw it at 15% and 35% opacity.
        </p>
        <p>
          Labels and the heart rate come from <code>detectEcgWaves</code>, a
          simple slope and amplitude heuristic tuned for clean sinus rhythms.
          For real recordings pass your own <code>annotations</code>, each a
          wave (<code>P</code>, <code>QRS</code> or <code>T</code>) and its peak
          time in seconds, or <code>annotations=&#123;false&#125;</code> to hide
          them. The heart rate is the median of the R to R intervals.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Synthetic rhythm</h2>
        <pre
          tabIndex={0}
          role="region"
          aria-label="Synthetic rhythm example"
          className={codeBlock}
        >
          {synthetic}
        </pre>
        <p>
          <code>syntheticEcg</code> and <code>syntheticEcgStream</code> generate
          an original, regular sinus rhythm from Gaussian P, Q, R, S and T
          waves, for demos and tests. It is not a recording and models no
          arrhythmia.
        </p>
      </section>
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Accessibility and limits</h2>
        <p>
          The strip is an image whose name gives the lead, duration, paper
          settings and heart rate. Wave labels are hidden from assistive
          technology, which gets the summary instead. The scrolling strip is a
          focusable region, and a live strip always offers Pause.
        </p>
        <p className="text-sm text-muted-foreground">
          An educational display, not a medical device: it does not filter,
          diagnose or alarm, and its wave detection is not validated. Do not use
          it for diagnosis or clinical decisions.
        </p>
      </section>
    </div>
  )
}
