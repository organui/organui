import { LabResultsTable } from "@workspace/registry/lab-results"

// Text results print their own range, and a flag the laboratory reports
// wins over the computed one.
export function Example() {
  return (
    <LabResultsTable
      caption="Urinalysis, illustrative"
      showTrend={false}
      results={[
        {
          id: "protein",
          name: "Protein",
          value: "Trace",
          referenceRange: { text: "Negative" },
          flag: "abnormal",
        },
        {
          id: "glucose",
          name: "Glucose",
          value: "Negative",
          referenceRange: { text: "Negative" },
          flag: "normal",
        },
        {
          id: "sg",
          name: "Specific gravity",
          value: 1.032,
          decimals: 3,
          referenceRange: { low: 1.005, high: 1.03 },
        },
      ]}
    />
  )
}
