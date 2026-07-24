import axe from "axe-core"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  LabResultCard,
  type LabResultStatus,
} from "./lab-result-card"

const statuses = [
  ["normal", "Within range"],
  ["abnormal", "Outside range"],
  ["critical", "Critical result"],
  ["pending", "Pending"],
  ["unavailable", "Unavailable"],
] satisfies Array<[LabResultStatus, string]>

describe("LabResultCard", () => {
  it.each(statuses)("renders the %s state with a text label", (status, label) => {
    render(<LabResultCard name="Hemoglobin" status={status} />)

    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it("renders the result, unit, reference range, and collection time", () => {
    render(
      <LabResultCard
        name="Hemoglobin"
        value="13.8"
        unit="g/dL"
        referenceRange="12.0–16.0 g/dL"
        collectedAt="24 Jul 2026, 09:30"
        status="normal"
      />
    )

    expect(screen.getByText("13.8 g/dL")).toBeInTheDocument()
    expect(screen.getByText("12.0–16.0 g/dL")).toBeInTheDocument()
    expect(screen.getByText(/24 Jul 2026/)).toBeInTheDocument()
  })

  it("communicates missing data explicitly", () => {
    render(<LabResultCard name="Potassium" status="unavailable" />)

    expect(screen.getByText("Not available")).toBeInTheDocument()
    expect(screen.getByText("Not provided")).toBeInTheDocument()
  })

  it("supports contextual status labels and forwards properties", () => {
    render(
      <LabResultCard
        name="Potassium"
        status="abnormal"
        statusLabel="Below local range"
        aria-label="Potassium result"
      />
    )

    expect(screen.getByText("Below local range")).toBeInTheDocument()
    expect(screen.getByLabelText("Potassium result")).toBeInTheDocument()
  })

  it("has no detectable semantic accessibility violations", async () => {
    const { container } = render(
      <LabResultCard
        name="Hemoglobin"
        value="13.8"
        unit="g/dL"
        referenceRange="12.0–16.0 g/dL"
        collectedAt="24 Jul 2026, 09:30"
        status="normal"
      />
    )
    const results = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    })

    expect(results.violations).toEqual([])
  })
})
