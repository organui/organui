// One beat, 200 px wide, repeated across the strip.
const beat =
  "l40 0 l6 -6 l6 6 l12 0 l4 6 l6 -56 l6 64 l4 -14 l20 0 l10 -12 l12 12 l74 0"

export function Example() {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-ecg-grid h-36 overflow-hidden rounded-lg border">
        <svg
          role="img"
          aria-label="An example ECG beat repeated on ECG paper"
          viewBox="0 0 800 144"
          preserveAspectRatio="none"
          className="size-full"
        >
          <path
            d={`M0 90 ${beat} ${beat} ${beat} ${beat}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-ecg-grid ecg-grid-color-sky-500 h-20 rounded-lg border" />
        <div className="bg-ecg-grid ecg-grid-size-2 h-20 rounded-lg border" />
      </div>
    </div>
  )
}
