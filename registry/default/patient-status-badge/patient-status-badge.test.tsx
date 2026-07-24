import axe from "axe-core"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  PatientStatusBadge,
  type PatientStatus,
} from "./patient-status-badge"

const statuses = [
  ["active", "Active"],
  ["inactive", "Inactive"],
  ["critical", "Critical"],
  ["pending", "Pending"],
  ["unknown", "Unknown"],
] satisfies Array<[PatientStatus, string]>

describe("PatientStatusBadge", () => {
  it.each(statuses)("renders the %s status as text", (status, label) => {
    render(<PatientStatusBadge status={status} />)

    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it("supports a context-specific label", () => {
    render(
      <PatientStatusBadge
        status="pending"
        label="Pending clinical review"
      />
    )

    expect(screen.getByText("Pending clinical review")).toBeInTheDocument()
    expect(screen.queryByText("Pending")).not.toBeInTheDocument()
  })

  it("forwards accessible badge properties", () => {
    render(
      <PatientStatusBadge
        status="critical"
        aria-label="Patient status: Critical"
      />
    )

    expect(
      screen.getByLabelText("Patient status: Critical")
    ).toBeInTheDocument()
  })

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <div>
        {statuses.map(([status]) => (
          <PatientStatusBadge key={status} status={status} />
        ))}
      </div>
    )

    const results = await axe.run(container, {
      rules: {
        "color-contrast": { enabled: false },
      },
    })

    expect(results.violations).toEqual([])
  })
})
