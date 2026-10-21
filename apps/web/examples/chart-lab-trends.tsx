import { LabResultsTable } from "@workspace/registry/lab-results"
import { labResultsExampleData } from "@/lib/examples"

// Each row's sparkline draws its history against the reference range.
export function Example() {
  return (
    <LabResultsTable
      results={labResultsExampleData.slice(0, 5)}
      caption="Illustrative values, not patient data"
    />
  )
}
