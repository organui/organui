import { LabResultsTable } from "@workspace/registry/lab-results"
import { labResultsExampleData } from "@/lib/examples"

export function Example() {
  return (
    <div role="region" aria-label="Lab results example">
      <LabResultsTable
        results={labResultsExampleData}
        caption="Illustrative values, not patient data"
      />
    </div>
  )
}
