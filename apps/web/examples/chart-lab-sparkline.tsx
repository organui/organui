import { LabSparkline } from "@workspace/registry/lab-results"
import { labResultsExampleData } from "@/lib/examples"

// One analyte's trend, larger, beside its latest value.
const glucose = labResultsExampleData[0]!

export function Example() {
  return (
    <figure className="flex items-center gap-6">
      <figcaption className="flex flex-col">
        <span className="text-sm text-muted-foreground">{glucose.name}</span>
        <span className="text-2xl font-semibold tabular-nums">
          {glucose.value}{" "}
          <span className="text-sm font-normal">{glucose.unit}</span>
        </span>
      </figcaption>
      <LabSparkline
        result={glucose}
        label="Fasting glucose, rising over a year"
        className="h-16 w-48"
      />
    </figure>
  )
}
