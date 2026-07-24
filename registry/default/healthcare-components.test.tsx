import axe from "axe-core"
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ClinicalAlert } from "./clinical-alert/clinical-alert"
import { MedicationStatus } from "./medication-status/medication-status"
import { PatientSummaryHeader } from "./patient-summary-header/patient-summary-header"
import { SpecimenStatus } from "./specimen-status/specimen-status"
import { StudyPhaseBadge } from "./study-phase-badge/study-phase-badge"
import { VitalSignCard } from "./vital-sign-card/vital-sign-card"

describe("OrganUI healthcare components", () => {
  it("renders every workflow state as explicit text", () => {
    render(
      <div>
        <MedicationStatus status="held" />
        <SpecimenStatus status="in-transit" />
        <StudyPhaseBadge phase="phase-3" />
        <VitalSignCard label="Heart rate" status="attention" />
      </div>
    )

    for (const label of ["On hold", "In transit", "Phase 3", "Review", "—"]) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it("renders synthetic record context without requiring sensitive data", () => {
    render(
      <PatientSummaryHeader
        displayName="Sample Patient"
        identifier="SYN-2048"
        details={["Age 42", "Pronouns they/them"]}
        status="Active"
      />
    )

    expect(screen.getByText("Sample Patient")).toBeInTheDocument()
    expect(screen.getByText("Record SYN-2048")).toBeInTheDocument()
  })

  it("uses alert semantics for clinical notices", () => {
    render(
      <ClinicalAlert
        severity="critical"
        title="Review required"
        description="Confirm this synthetic result using your local workflow."
      />
    )

    expect(screen.getByRole("alert")).toHaveTextContent("Review required")
  })

  it("has no detectable semantic accessibility violations", async () => {
    const { container } = render(
      <div>
        <ClinicalAlert
          severity="information"
          title="Example notice"
          description="Synthetic data only."
        />
        <PatientSummaryHeader
          displayName="Sample Patient"
          identifier="SYN-2048"
          details={["Age 42"]}
        />
        <VitalSignCard label="Heart rate" value={72} unit="bpm" />
      </div>
    )
    const results = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    })

    expect(results.violations).toEqual([])
  })
})
