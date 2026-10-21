import { HeartIcon } from "lucide-react"

export function Example() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-12">
      <figure className="flex flex-col items-center gap-3">
        <HeartIcon className="animate-heartbeat text-severity-critical heartbeat-rate-60 size-10 fill-current" />
        <figcaption className="text-sm text-muted-foreground">
          60 bpm
        </figcaption>
      </figure>
      <figure className="flex flex-col items-center gap-3">
        <HeartIcon className="animate-heartbeat text-severity-critical heartbeat-rate-90 size-10 fill-current" />
        <figcaption className="text-sm text-muted-foreground">
          90 bpm
        </figcaption>
      </figure>
      <figure className="flex flex-col items-center gap-3">
        <HeartIcon className="animate-heartbeat text-severity-critical heartbeat-rate-140 size-10 fill-current" />
        <figcaption className="text-sm text-muted-foreground">
          140 bpm
        </figcaption>
      </figure>
    </div>
  )
}
