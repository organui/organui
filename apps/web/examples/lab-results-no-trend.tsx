import { LabResultsTable } from "@workspace/registry/lab-results"
import { labResultsExampleData } from "@/lib/examples"

// Without the trend column, for narrow layouts or single results.
export function Example() {
  return (
    <LabResultsTable
      results={labResultsExampleData.slice(0, 4)}
      showTrend={false}
      caption="Illustrative values, without trends"
    />
  )
}
