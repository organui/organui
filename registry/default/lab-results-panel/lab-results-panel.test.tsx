import axe from "axe-core"
import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  LabResultsPanel,
  type LabPanelResult,
} from "./lab-results-panel"

const results: LabPanelResult[] = [
  {
    id: "hemoglobin",
    name: "Hemoglobin",
    value: "13.8",
    unit: "g/dL",
    referenceRange: "12.0–16.0 g/dL",
    status: "normal",
  },
  {
    id: "potassium",
    name: "Potassium",
    value: "6.2",
    unit: "mmol/L",
    referenceRange: "3.5–5.1 mmol/L",
    status: "critical",
  },
  {
    id: "culture",
    name: "Blood culture",
    status: "pending",
  },
]

describe("LabResultsPanel", () => {
  it("renders values, ranges, statuses, and a summary", () => {
    render(<LabResultsPanel results={results} />)

    expect(screen.getByText("13.8 g/dL")).toBeInTheDocument()
    expect(screen.getByText("3.5–5.1 mmol/L")).toBeInTheDocument()
    expect(screen.getByText("1 flagged")).toBeInTheDocument()
    expect(screen.getByText("1 pending")).toBeInTheDocument()

    const cultureRow = screen.getByText("Blood culture").closest("tr")
    expect(cultureRow).not.toBeNull()
    expect(within(cultureRow!).getAllByText("Not available")).toHaveLength(2)
  })

  it("renders a clear empty state", () => {
    render(<LabResultsPanel results={[]} />)

    expect(screen.getByText("No lab results")).toBeInTheDocument()
    expect(screen.getByText("0 total")).toBeInTheDocument()
  })

  it("supports custom copy and forwards card properties", () => {
    render(
      <LabResultsPanel
        results={results}
        title="Chemistry panel"
        description="Collected today"
        aria-label="Latest chemistry results"
      />
    )

    expect(screen.getByLabelText("Latest chemistry results")).toBeInTheDocument()
    expect(screen.getByText("Chemistry panel")).toBeInTheDocument()
    expect(screen.getByText("Collected today")).toBeInTheDocument()
  })

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<LabResultsPanel results={results} />)
    const accessibility = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    })

    expect(accessibility.violations).toEqual([])
  })
})
